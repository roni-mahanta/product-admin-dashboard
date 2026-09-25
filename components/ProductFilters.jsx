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
      {/* Category Filter */}

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Categories</option>

        {categories.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>

      {/* Sort By */}

      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Sort By</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
        <option value="title">Title</option>
      </select>

      {/* Sort Order */}

      <select
        value={sortOrder}
        onChange={(e) => onSortOrderChange(e.target.value)}
        disabled={!sortBy}
        className="border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}