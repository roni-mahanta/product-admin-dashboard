"use client";

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.ceil(total / limit);

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="border-t px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      {/* Showing text */}
      <p className="text-sm text-gray-600">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-3">

        {/* Page size */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="pageSize"
            className="text-sm text-gray-600"
          >
            Rows:
          </label>

          <select
            id="pageSize"
            value={limit}
            onChange={(e) =>
              onLimitChange(Number(e.target.value))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>

        {/* Page number */}
        <span className="text-sm font-medium">
          Page {page} of {totalPages || 1}
        </span>

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>

      </div>
    </div>
  );
}