"use client";

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.ceil(total / limit);

  const start =
    total === 0 ? 0 : (page - 1) * limit + 1;

  const end = Math.min(page * limit, total);

  return (
    <div className="border-t border-gray-200 px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm font-medium text-gray-700">
        Showing{" "}
        <span className="font-bold text-gray-900">
          {start}–{end}
        </span>{" "}
        of{" "}
        <span className="font-bold text-gray-900">
          {total}
        </span>
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {/* ROWS */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="pageSize"
            className="text-sm font-medium text-gray-700"
          >
            Rows:
          </label>

          <select
            id="pageSize"
            value={limit}
            onChange={(e) =>
              onLimitChange(Number(e.target.value))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 bg-white"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* PREVIOUS */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        {/* PAGE */}
        <span className="text-sm font-semibold text-gray-800">
          Page {page} of {totalPages || 1}
        </span>

        {/* NEXT */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-800 bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}