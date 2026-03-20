import { ShieldOff } from 'lucide-react';

/**
 * Graceful fallback shown when a 403 (Forbidden) is returned.
 * Drop-in replacement for content the user isn't authorized to see.
 */
export default function AccessDenied({ message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/50 px-6 py-16 text-center animate-fade-in">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100">
        <ShieldOff className="h-7 w-7 text-red-400" />
      </div>
      <p className="mt-4 text-sm font-semibold text-red-600">Access Denied</p>
      <p className="mt-1 max-w-sm text-xs text-red-400">
        {message || 'You do not have permission to access this resource.'}
      </p>
    </div>
  );
}
