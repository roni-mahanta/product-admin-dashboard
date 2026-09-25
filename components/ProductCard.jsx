"use client";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}) {
  return (
    <div className="border-b p-4 last:border-b-0">
      <div className="flex gap-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800">
            {product.title}
          </h3>

          <p className="text-sm text-gray-500 capitalize mt-1">
            {product.category}
          </p>

          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <span className="font-semibold">
              ${product.price}
            </span>

            <span>
              ⭐ {product.rating}
            </span>

            <span className="text-gray-500">
              Stock: {product.stock}
            </span>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(product)}
              className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(product)}
              className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}