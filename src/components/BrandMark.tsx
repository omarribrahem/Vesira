/** The VASIRA brand mark: two dark wings forming the V and the gold stem at
 *  the vertex. Static geometry — the arms never swing. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 79" className={className} aria-hidden="true" focusable="false">
      <path className="brand-wing" d="M0 5h22l23 57L38 75z" />
      <path className="brand-wing" d="M90 5H68L45 62l7 13z" />
      <path className="brand-stem" d="M43.7 61h2.6v16h-2.6z" />
    </svg>
  );
}
