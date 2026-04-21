import type { ReviewAction, ReviewItem } from "../types";

type ReviewDetailProps = {
  item: ReviewItem | null;
  loading: boolean;
  error: string;
  actionLoading: boolean;
  actionError: string;
  actionSuccess: string;
  onAction: (action: ReviewAction) => void;
};

function formatSubmittedAt(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getAvailableActions(item: ReviewItem | null): ReviewAction[] {
  if (!item) {
    return [];
  }

  if (item.status === "unassigned") {
    return ["claim"];
  }

  if (item.status === "in_review") {
    return [];
  }

  return [];
}

function getPlaceholderActions(item: ReviewItem | null): ReviewAction[] {
  if (!item) {
    return [];
  }

  if (item.status === "in_review") {
    return ["approve", "reject", "escalate"];
  }

  return [];
}

function getActionLabel(action: ReviewAction) {
  switch (action) {
    case "claim":
      return "Claim";
    case "approve":
      return "Approve";
    case "reject":
      return "Reject";
    case "escalate":
      return "Escalate";
  }
}

export function ReviewDetail({
  item,
  loading,
  error,
  actionLoading,
  actionError,
  actionSuccess,
  onAction,
}: ReviewDetailProps) {
  const availableActions = getAvailableActions(item);
  const placeholderActions = getPlaceholderActions(item);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">Review detail</h2>
        <p className="mt-1 text-sm text-slate-600">A plain detail panel for the selected review item.</p>
      </div>

      {loading ? <p className="mt-4 text-sm text-slate-600">Loading selected review...</p> : null}

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
      {actionError ? <p className="mt-4 text-sm text-red-600">{actionError}</p> : null}
      {actionSuccess ? <p className="mt-4 text-sm text-emerald-700">{actionSuccess}</p> : null}

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

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</dt>
              <dd className="mt-2 flex flex-wrap gap-3">
                {availableActions.length === 0 ? (
                  placeholderActions.length === 0 ? (
                    <span className="text-sm text-slate-600">No actions available.</span>
                  ) : (
                    placeholderActions.map((action) => (
                      <button
                        key={action}
                        type="button"
                        disabled
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-400"
                      >
                        {getActionLabel(action)}
                      </button>
                    ))
                  )
                ) : (
                  availableActions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => onAction(action)}
                      disabled={actionLoading}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                      {actionLoading ? "Updating..." : getActionLabel(action)}
                    </button>
                  ))
                )}
              </dd>
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
