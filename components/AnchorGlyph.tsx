export default function AnchorGlyph({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="4.5" r="1.6" fill="currentColor" stroke="none" />
      <path d="M12 6.5v11" />
      <path d="M12 17.5c-3.4 0-5-2.1-5-5h2.6c0 1.5.7 2.4 2.4 2.4s2.4-.9 2.4-2.4H17c0 2.9-1.6 5-5 5z" />
      <path d="M7 20.5h10" />
    </svg>
  );
}
