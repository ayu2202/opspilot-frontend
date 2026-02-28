/**
 * Reusable loading spinner with multiple size variants.
 * Supports inline (next to controls) and overlay (full-screen) modes.
 */

/** Inline spinner — sits next to a button or dropdown. */
export function InlineSpinner({ size = 'sm', className = '' }) {
  const sizes = {
    xs: 'h-3 w-3 border',
    sm: 'h-4 w-4 border-2',
    md: 'h-5 w-5 border-2',
    lg: 'h-8 w-8 border-4',
  };

  return (
    <div
      className={`animate-spin rounded-full border-brand-500 border-t-transparent ${sizes[size] || sizes.sm} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

/** Page-level spinner — centered in a container. */
export function PageSpinner() {
  return (
    <div className="flex h-64 items-center justify-center animate-fade-in">
      <InlineSpinner size="lg" />
    </div>
  );
}

/**
 * Global overlay — covers the whole screen with a translucent backdrop.
 * Use for login and initial dashboard load.
 */
export function OverlaySpinner({ message = 'Loading…' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <InlineSpinner size="lg" className="border-white border-t-transparent" />
      {message && (
        <p className="mt-4 text-sm font-medium text-white/90">{message}</p>
      )}
    </div>
  );
}
