import type { ReviewItem } from "../types";

type ReviewListProps = {
  items: ReviewItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ReviewList({ items, selectedId, onSelect }: ReviewListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">Review queue</h2>
        <p className="mt-1 text-sm text-slate-600">Select an item to inspect its full details.</p>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item) => {
          const isSelected = item.id === selectedId;

          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  isSelected
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.id}</p>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
