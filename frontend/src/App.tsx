import { useEffect, useState } from "react";
import { getReviewItemById, getReviewItems, performReviewAction } from "./api";
import { ReviewDetail } from "./components/ReviewDetail";
import { ReviewList } from "./components/ReviewList";
import type { ReviewAction, ReviewItem } from "./types";

export default function App() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [listError, setListError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  async function loadReviewQueue(preferredId?: string | null) {
    try {
      const reviewItems = await getReviewItems();
      setItems(reviewItems);
      setSelectedId((currentSelectedId) => {
        const candidateId = preferredId ?? currentSelectedId;
        const nextSelectedId =
          reviewItems.find((item) => item.id === candidateId)?.id ?? reviewItems[0]?.id ?? null;

        return nextSelectedId;
      });
    } catch {
      setListError("Could not load review items.");
    } finally {
      setListLoading(false);
    }
  }

  useEffect(() => {
    void loadReviewQueue();
  }, []);

  useEffect(() => {
    async function loadSelectedItem() {
      if (!selectedId) {
        setSelectedItem(null);
        return;
      }

      setDetailLoading(true);
      setDetailError("");

      try {
        const reviewItem = await getReviewItemById(selectedId);
        setSelectedItem(reviewItem);
      } catch {
        setDetailError("Could not load the selected review item.");
        setSelectedItem(null);
      } finally {
        setDetailLoading(false);
      }
    }

    void loadSelectedItem();
  }, [selectedId]);

  async function handleAction(action: ReviewAction) {
    if (!selectedItem) {
      return;
    }

    setActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      const updatedItem = await performReviewAction(selectedItem.id, action);
      const isStillActive = updatedItem.status === "unassigned" || updatedItem.status === "in_review";

      await loadReviewQueue(isStillActive ? updatedItem.id : null);
      setActionSuccess(`${updatedItem.title} was updated to ${updatedItem.status}.`);
    } catch (caughtError) {
      setActionError(
        caughtError instanceof Error ? caughtError.message : "Could not update the review item.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Reviewer workspace</h1>
          <p className="mt-2 text-sm text-slate-600">
            A simple React and Tailwind view of the queue and selected review item.
          </p>
        </div>

        {listLoading ? <p className="mb-6 text-sm text-slate-600">Loading review queue...</p> : null}
        {listError ? <p className="mb-6 text-sm text-red-600">{listError}</p> : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <ReviewList items={items} selectedId={selectedId} onSelect={setSelectedId} />
          <ReviewDetail
            item={selectedItem}
            loading={detailLoading}
            error={detailError}
            actionLoading={actionLoading}
            actionError={actionError}
            actionSuccess={actionSuccess}
            onAction={handleAction}
          />
        </div>
      </div>
    </main>
  );
}
