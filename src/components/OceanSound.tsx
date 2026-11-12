import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLang } from '../i18n/LangContext';

interface OceanState { enabled: boolean; on: boolean; loading: boolean; failed: boolean; toggle: () => void }
const OceanContext = createContext<OceanState | null>(null);

/** Enabled by owner default; audible playback waits for the first gesture. */
export function OceanAudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const operationRef = useRef(0);
  const enabledRef = useRef(true);
  const playingRef = useRef(false);
  const pendingRef = useRef(false);
  const failedRef = useRef(false);
  const [enabled, setEnabled] = useState(true);
  const [on, setOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const stop = () => {
    operationRef.current++;
    audioRef.current?.pause();
    if (gainRef.current && contextRef.current) {
      gainRef.current.gain.cancelScheduledValues(contextRef.current.currentTime);
      gainRef.current.gain.value = 0;
    }
    playingRef.current = false;
    pendingRef.current = false;
    setOn(false);
    setLoading(false);
  };

  useEffect(() => {
    const onHidden = () => { if (document.hidden) stop(); };
    const onGesture = (event: Event) => {
      if ((event.target as Element)?.closest?.('.ocean-sound-toggle')) return;
      if (event instanceof KeyboardEvent && (!['Enter', ' '].includes(event.key) || event.repeat)) return;
      if (event instanceof PointerEvent && (!event.isPrimary || event.button !== 0)) return;
      void start();
    };
    document.addEventListener('pointerup', onGesture, { passive: true });
    document.addEventListener('keydown', onGesture);
    document.addEventListener('visibilitychange', onHidden);
    window.addEventListener('pagehide', stop);
    return () => {
      operationRef.current++;
      document.removeEventListener('visibilitychange', onHidden);
      document.removeEventListener('pointerup', onGesture);
      document.removeEventListener('keydown', onGesture);
      window.removeEventListener('pagehide', stop);
      audioRef.current?.pause();
      void contextRef.current?.close();
      contextRef.current = null;
      gainRef.current = null;
    };
  }, []);

  const start = async () => {
    if (!enabledRef.current || pendingRef.current || playingRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    const operation = ++operationRef.current;
    pendingRef.current = true;
    setLoading(true);
    setFailed(false);
    failedRef.current = false;
    try {
      // GainNode works on mobile Safari too, where element.volume can be ignored.
      if (!contextRef.current) {
        const context = new AudioContext();
        const gain = context.createGain();
        gain.gain.value = 0;
        context.createMediaElementSource(audio).connect(gain);
        gain.connect(context.destination);
        contextRef.current = context;
        gainRef.current = gain;
      }
      const context = contextRef.current;
      const gain = gainRef.current!;
      // Call both from the gesture, before yielding, to satisfy mobile policies.
      const resume = context.resume();
      const play = audio.play();
      await Promise.all([resume, play]);
      if (operation !== operationRef.current) return;
      if (document.hidden) {
        stop();
        return;
      }
      gain.gain.cancelScheduledValues(context.currentTime);
      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, context.currentTime + 0.7);
      playingRef.current = true;
      setOn(true);
    } catch {
      if (operation === operationRef.current) {
        audio.pause();
        setFailed(true);
        failedRef.current = true;
        playingRef.current = false;
        setOn(false);
      }
    } finally {
      if (operation === operationRef.current) { pendingRef.current = false; setLoading(false); }
    }
  };

  const toggle = () => {
    if (enabledRef.current && !failedRef.current) {
      enabledRef.current = false;
      setEnabled(false);
      stop();
    } else {
      enabledRef.current = true;
      setEnabled(true);
      void start();
    }
  };

  return <OceanContext.Provider value={{ enabled, on, loading, failed, toggle }}>
      <audio ref={audioRef} src="./audio/ocean-ambience.mp3" loop preload="none" aria-hidden="true" />
      {children}
    </OceanContext.Provider>;
}

export function OceanSound() {
  const { lang } = useLang();
  const state = useContext(OceanContext);
  if (!state) throw new Error('OceanSound requires OceanAudioProvider');
  const { enabled, on, loading, failed, toggle } = state;
  const ar = lang === 'ar';
  return (
    <div className="ocean-sound">
      <button type="button" className="ocean-sound-toggle" aria-pressed={enabled}
        aria-busy={loading} aria-label={ar ? 'صوت البحر' : 'Ocean sound'}
        title={enabled ? (ar ? 'إيقاف صوت البحر' : 'Turn off ocean sound') : (ar ? 'تشغيل صوت البحر' : 'Turn on ocean sound')}
        onClick={toggle}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {enabled ? <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></> : <path d="m16 9 5 6m0-6-5 6" />}
        </svg>
        <span>{ar ? 'صوت البحر' : 'Ocean sound'}</span>
        <span className="ocean-sound-state">{failed ? (ar ? 'أعد المحاولة' : 'Retry') : loading ? (ar ? 'جارٍ التشغيل' : 'Starting') : on ? (ar ? 'مفعّل' : 'On') : enabled ? (ar ? 'جاهز' : 'Ready') : (ar ? 'متوقف' : 'Off')}</span>
      </button>
      {failed && <p className="ocean-sound-error" role="status">{ar ? 'تعذّر تشغيل الصوت. اضغط للمحاولة مرة أخرى.' : 'Sound could not start. Tap to retry.'}</p>}
    </div>
  );
}
