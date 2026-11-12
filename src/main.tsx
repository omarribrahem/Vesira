import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LangProvider } from './i18n/LangContext';
import App from './App';
import { OceanAudioProvider } from './components/OceanSound';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('#root not found');

createRoot(rootElement).render(
  <StrictMode>
    <LangProvider>
      <OceanAudioProvider><App /></OceanAudioProvider>
    </LangProvider>
  </StrictMode>,
);
