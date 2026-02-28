import { useEffect, useState, useCallback } from 'react';
import { getMyWorkItems, updateWorkItemStatus } from '../api/endpoints';
import { WorkItemStatus } from '../contracts';
import { PageSpinner, InlineSpinner } from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import {
  CheckCircle2,
  Play,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardX,
} from 'lucide-react';

const actions = [
  { status: WorkItemStatus.IN_PROGRESS, label: 'Start', icon: Play, color: 'text-amber-600 hover:bg-amber-50' },
  { status: WorkItemStatus.COMPLETED, label: 'Complete', icon: CheckCircle2, color: 'text-green-600 hover:bg-green-50' },
  { status: WorkItemStatus.REJECTED, label: 'Reject', icon: XCircle, color: 'text-red-500 hover:bg-red-50' },
];

export default function OperatorDashboard() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  // Track per-item status updates: { [itemId]: targetStatus }
  const [updatingIds, setUpdatingIds] = useState({});

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const workItemPage = await getMyWorkItems(page, 10);
      setItems(workItemPage.content);
      setTotalPages(workItemPage.totalPages);
    } catch (err) {
      console.error('Failed to load work items', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleStatus = async (id, status) => {
    // Mark this item + target status as updating
    setUpdatingIds((prev) => ({ ...prev, [id]: status }));
    try {
      const updated = await updateWorkItemStatus(id, status);
      // Inline update — replace just the changed item, no full refetch
      setItems((prev) =>
        prev.map((item) => (item.id === id ? updated : item)),
      );
    } catch (err) {
      console.error('Status update failed', err);
    } finally {
      setUpdatingIds((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Assigned Work Items</h2>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-16 text-center shadow-card">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <ClipboardX className="h-7 w-7 text-slate-400" />
          </div>
          <p className="mt-4 text-sm font-medium text-slate-500">No tasks assigned yet</p>
          <p className="mt-1 text-xs text-slate-400">Work items assigned to you will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => {
            const itemUpdating = updatingIds[item.id];
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition hover:shadow-card-hover"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-slate-800">
                        {item.title}
                      </h3>
                      <StatusBadge status={item.status} />
                    </div>
                    {item.description && (
                      <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-2 flex gap-4 text-xs text-slate-400">
                      <span>ID: #{item.id?.slice(0, 8)}</span>
                      {item.createdByName && <span>Created by: {item.createdByName}</span>}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1.5">
                    {actions.map(({ status, label, icon: Icon, color }) => {
                      const isThis = itemUpdating === status;
                      const isAny = !!itemUpdating;
                      const isCurrent = item.status === status;
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatus(item.id, status)}
                          disabled={isCurrent || isAny}
                          className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium shadow-sm transition disabled:opacity-30 ${color}`}
                          title={label}
                        >
                          {isThis ? (
                            <InlineSpinner size="xs" />
                          ) : (
                            <Icon className="h-3.5 w-3.5" />
                          )}
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
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
    </div>
  );
}
