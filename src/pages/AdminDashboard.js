import { useEffect, useState, useCallback } from 'react';
import {
  getAdminDashboard,
  getOperators,
  assignWorkItem,
  getAllWorkItems,
  loadDemoData,
} from '../api/endpoints';
import { PageSpinner, InlineSpinner } from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { useToast } from '../components/Toast';
import {
  ClipboardList,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XOctagon,
  ChevronLeft,
  ChevronRight,
  DatabaseZap,
  Inbox,
} from 'lucide-react';

export default function AdminDashboard() {
  const toast = useToast();
  const [metrics, setMetrics] = useState(null);
  const [operators, setOperators] = useState([]);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  // Track which row is currently being assigned: { [workItemId]: true }
  const [assigningIds, setAssigningIds] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashMetrics, opsList, workItemPage] = await Promise.all([
        getAdminDashboard(),
        getOperators(),
        getAllWorkItems(page, 10, 'createdAt', 'desc'),
      ]);
      setMetrics(dashMetrics);
      setOperators(opsList);
      setItems(workItemPage.content);
      setTotalPages(workItemPage.totalPages);
    } catch (err) {
      console.error('Failed to load admin dashboard', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssign = async (workItemId, employeeId) => {
    // Prevent re-assigning to the already-assigned operator
    const current = items.find((i) => i.id === workItemId);
    if (current?.assignedToId === employeeId) return;

    setAssigningIds((prev) => ({ ...prev, [workItemId]: true }));
    try {
      const updated = await assignWorkItem(workItemId, employeeId);
      // Inline update — replace just the changed row
      setItems((prev) =>
        prev.map((item) => (item.id === workItemId ? updated : item)),
      );
    } catch (err) {
      console.error('Assignment failed', err);
    } finally {
      setAssigningIds((prev) => {
        const next = { ...prev };
        delete next[workItemId];
        return next;
      });
    }
  };

  const handleLoadDemo = async () => {
    setDemoLoading(true);
    try {
      await loadDemoData();
      toast({ type: 'success', message: 'Demo data loaded successfully!' });
      fetchData(); // refresh everything
    } catch (err) {
      toast({ type: 'error', message: err.response?.data?.message || 'Failed to load demo data' });
    } finally {
      setDemoLoading(false);
    }
  };

  if (loading) return <PageSpinner />;

  const summaryCards = [
    { label: 'Total Items', value: metrics?.totalWorkItems ?? 0, icon: ClipboardList, color: 'text-brand-500', bg: 'bg-brand-50' },
    { label: 'Open', value: metrics?.openWorkItems ?? 0, icon: AlertTriangle, color: 'text-slate-500', bg: 'bg-slate-50' },
    { label: 'In Progress', value: metrics?.inProgressWorkItems ?? 0, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Completed', value: metrics?.completedWorkItems ?? 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Rejected', value: metrics?.rejectedWorkItems ?? 0, icon: XOctagon, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Operators', value: operators.length, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header row with demo-data button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Admin Dashboard</h2>
        <button
          onClick={handleLoadDemo}
          disabled={demoLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-600 disabled:opacity-60"
        >
          {demoLoading ? (
            <InlineSpinner size="xs" className="text-white" />
          ) : (
            <DatabaseZap className="h-4 w-4" />
          )}
          Load Demo Data
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition hover:shadow-card-hover"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-800">{card.value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* WorkItems table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-800">Work Items</h2>
        </div>

        {items.length === 0 ? (
          /* Intentional empty state */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Inbox className="h-7 w-7 text-slate-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-500">No work items available</p>
            <p className="mt-1 text-xs text-slate-400">Use "Load Demo Data" above to seed sample items.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-3 font-medium text-slate-500">ID</th>
                    <th className="px-6 py-3 font-medium text-slate-500">Title</th>
                    <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                    <th className="px-6 py-3 font-medium text-slate-500">Created By</th>
                    <th className="px-6 py-3 font-medium text-slate-500">Assigned To</th>
                    <th className="px-6 py-3 font-medium text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const isAssigning = !!assigningIds[item.id];
                    return (
                      <tr key={item.id} className="transition hover:bg-slate-50/50">
                        <td className="px-6 py-3.5 font-mono text-xs text-slate-500">
                          #{item.id?.slice(0, 8)}
                        </td>
                        <td className="px-6 py-3.5 font-medium text-slate-800">
                          {item.title}
                        </td>
                        <td className="px-6 py-3.5">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-6 py-3.5 text-slate-600">
                          {item.createdByName || '—'}
                        </td>
                        <td className="px-6 py-3.5 text-slate-600">
                          {item.assignedToName || '—'}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <select
                              className="min-w-[180px] appearance-none rounded-lg border border-slate-200 bg-white py-1.5 pl-2.5 pr-8 text-xs text-slate-700 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 bg-[length:16px_16px] bg-[right_0.35rem_center] bg-no-repeat"
                              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2364748b'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")" }}
                              value={item.assignedToId || ''}
                              disabled={isAssigning}
                              onChange={(e) => {
                                if (e.target.value) handleAssign(item.id, e.target.value);
                              }}
                            >
                              <option value="" disabled>
                                Assign operator
                              </option>
                              {operators.map((op) => {
                                const isCurrent = op.id === item.assignedToId;
                                return (
                                  <option key={op.id} value={op.id} disabled={isCurrent}>
                                    {op.fullName || op.email}
                                    {isCurrent ? ' (Currently Assigned)' : ''}
                                  </option>
                                );
                              })}
                            </select>
                            {isAssigning && <InlineSpinner size="xs" />}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3">
                <p className="text-sm text-slate-500">
                  Page {page + 1} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Prev
                  </button>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
