import { useEffect, useState, useCallback } from 'react';
import { getMyWorkItems } from '../api/endpoints';
import { PageSpinner } from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export default function ViewerDashboard() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const workItemPage = await getMyWorkItems(page, 10);
      setItems(workItemPage.content);
      setTotalPages(workItemPage.totalPages);
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading) return <PageSpinner />;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-lg font-semibold text-slate-800">Work Items Overview</h2>

      <div className="rounded-xl border border-slate-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 font-medium text-slate-500">ID</th>
                <th className="px-6 py-3 font-medium text-slate-500">Title</th>
                <th className="px-6 py-3 font-medium text-slate-500">Status</th>
                <th className="px-6 py-3 font-medium text-slate-500">Created By</th>
                <th className="px-6 py-3 font-medium text-slate-500">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <Inbox className="h-7 w-7 text-slate-400" />
                      </div>
                      <p className="mt-4 text-sm font-medium text-slate-500">No work items available</p>
                      <p className="mt-1 text-xs text-slate-400">Items will appear here once they are created.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
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
                  </tr>
                ))
              )}
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
      </div>
    </div>
  );
}
