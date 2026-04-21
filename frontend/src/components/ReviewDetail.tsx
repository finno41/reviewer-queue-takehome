import type { ReviewItem } from "../types";

type ReviewDetailProps = {
  item: ReviewItem | null;
  loading: boolean;
  error: string;
};

function formatSubmittedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function ReviewDetail({ item, loading, error }: ReviewDetailProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">Review detail</h2>
        <p className="mt-1 text-sm text-slate-600">A plain detail panel for the selected review item.</p>
      </div>

      {loading ? <p className="mt-4 text-sm text-slate-600">Loading selected review...</p> : null}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      {!loading && !error && !item ? (
        <p className="mt-4 text-sm text-slate-600">Choose a review item from the list to see its details.</p>
      ) : null}

      {!loading && !error && item ? (
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">ID</dt>
            <dd className="mt-1 text-sm text-slate-900">{item.id}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Title</dt>
            <dd className="mt-1 text-sm text-slate-900">{item.title}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-900">{item.summary}</dd>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</dt>
              <dd className="mt-1 text-sm text-slate-900">{item.status}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Risk level</dt>
              <dd className="mt-1 text-sm text-slate-900">{item.risk_level}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer tier</dt>
              <dd className="mt-1 text-sm text-slate-900">{item.customer_tier}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned reviewer</dt>
              <dd className="mt-1 text-sm text-slate-900">{item.assigned_reviewer ?? "Unassigned"}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes count</dt>
              <dd className="mt-1 text-sm text-slate-900">{item.notes_count}</dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Submitted at</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatSubmittedAt(item.submitted_at)}</dd>
            </div>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
