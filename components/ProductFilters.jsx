"use client";

export default function ProductFilters({
  category,
  sortBy,
  sortOrder,
  onCategoryChange,
  onSortByChange,
  onSortOrderChange,
  categories,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
        className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
      >
        <option value="">All Categories</option>

        {categories.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        aria-label="Sort products by"
        className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
      >
        <option value="">Sort By</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
        <option value="title">Title</option>
      </select>

      <select
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value)}
        disabled={!sortBy}
        aria-label="Sort order"
        className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}