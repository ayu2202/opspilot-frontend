import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { OverlaySpinner } from '../components/LoadingSpinner';
import {
  ShieldCheck,
  UserCog,
  Wrench,
  Eye,
  Copy,
  Check,
  ArrowRight,
  Timer,
  Layout,
  GitBranch,
  Lock,
  BarChart3,
} from 'lucide-react';

/* ── Credential quick-fill chip ──────────────────────────────────────────── */
function CredChip({ role, icon: Icon, color, email, onFill }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${color}`}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <div className="text-xs leading-tight">
          <span className="font-semibold">{role}</span>
          <span className="ml-1.5 font-mono opacity-80">{email}</span>
        </div>
      </div>
      <div className="flex gap-1">
        <button
          type="button"
          onClick={handleCopy}
          className="rounded p-1 transition hover:bg-white/20"
          title="Copy email"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5 opacity-60" />}
        </button>
        <button
          type="button"
          onClick={() => onFill(email)}
          className="rounded p-1 transition hover:bg-white/20"
          title="Auto-fill"
        >
          <ArrowRight className="h-3.5 w-3.5 opacity-60" />
        </button>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setError(Object.values(data.errors).join('. '));
      } else {
        setError(data?.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillEmail = (addr) => {
    setEmail(addr);
    setPassword('Password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {loading && <OverlaySpinner message="Signing in… Backend may take up to 30 s to wake up on first use." />}

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-10 px-4 py-12 lg:flex-row lg:gap-16">

        {/* ── LEFT: Demo info ──────────────────────────────────────────── */}
        <div className="w-full max-w-lg space-y-7 text-slate-300 lg:flex-1">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 shadow-lg">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">OpsPilot</h1>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              This is a live demo of an internal operations management system designed to simulate how companies manage team tasks across roles.
            </p>
          </div>

          {/* Demo Roles */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Demo Roles</h3>
            <div className="grid gap-2">
              <div className="flex items-center gap-2.5 text-sm">
                <UserCog className="h-4 w-4 text-brand-400" />
                <span><span className="font-semibold text-white">Admin</span> — Assigns tasks</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Wrench className="h-4 w-4 text-amber-400" />
                <span><span className="font-semibold text-white">Operator</span> — Executes tasks</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Eye className="h-4 w-4 text-emerald-400" />
                <span><span className="font-semibold text-white">Viewer</span> — Monitors progress</span>
              </div>
            </div>
          </div>

          {/* Try This Flow */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Try This Workflow</h3>
            <ol className="space-y-1.5 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-[10px] font-bold text-brand-300">1</span>
                Login as <span className="font-semibold text-white">Admin</span> and assign a task
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-300">2</span>
                Login as <span className="font-semibold text-white">Operator</span> and update task status
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-300">3</span>
                Login as <span className="font-semibold text-white">Viewer</span> to monitor progress
              </li>
            </ol>
          </div>

          {/* What This Demonstrates */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">What This Demonstrates</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2"><Lock className="h-3.5 w-3.5 text-slate-500" /> Role-based access control</div>
              <div className="flex items-center gap-2"><GitBranch className="h-3.5 w-3.5 text-slate-500" /> Task lifecycle management</div>
              <div className="flex items-center gap-2"><Layout className="h-3.5 w-3.5 text-slate-500" /> Workflow orchestration</div>
              <div className="flex items-center gap-2"><BarChart3 className="h-3.5 w-3.5 text-slate-500" /> Admin dashboard systems</div>
            </div>
          </div>

          {/* Cold-start notice */}
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300/90">
            <Timer className="h-4 w-4 shrink-0" />
            Backend may take up to 30 seconds to wake up on first use.
          </div>
        </div>

        {/* ── RIGHT: Login card ────────────────────────────────────────── */}
        <div className="w-full max-w-md lg:flex-1">
          {/* Card */}
          <div className="rounded-2xl bg-white p-8 shadow-xl">
            <h2 className="mb-6 text-center text-lg font-semibold text-slate-800">
              Sign in to your account
            </h2>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="you@opspilot.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-60"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Quick-fill credentials */}
            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="mb-2 text-center text-xs font-medium text-slate-400">Quick login — click arrow to auto-fill</p>
              <div className="space-y-2">
                <CredChip role="Admin" icon={UserCog} color="border-brand-200 bg-brand-50 text-brand-700" email="admin1@opspilot.com" onFill={fillEmail} />
                <CredChip role="Operator" icon={Wrench} color="border-amber-200 bg-amber-50 text-amber-700" email="operator1@opspilot.com" onFill={fillEmail} />
                <CredChip role="Viewer" icon={Eye} color="border-emerald-200 bg-emerald-50 text-emerald-700" email="viewer1@opspilot.com" onFill={fillEmail} />
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-400">Password for all: <span className="font-mono font-medium">Password123</span></p>
            </div>
          </div>

          {/* Freelancing footer */}
          <div className="mt-6 rounded-xl border border-slate-700/40 bg-slate-800/40 px-5 py-4 text-center backdrop-blur-sm">
            <p className="text-xs leading-relaxed text-slate-400">
              This project represents my ability to design and build internal tools such as
              <span className="font-medium text-slate-300"> admin dashboards</span>,
              <span className="font-medium text-slate-300"> workflow management systems</span>,
              <span className="font-medium text-slate-300"> role-based applications</span>, and
              <span className="font-medium text-slate-300"> operational control panels</span>.
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            OpsPilot &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
