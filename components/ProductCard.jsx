"use client";

import Link from "next/link";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}) {
  return (
    <div className="border-b border-gray-200 p-4 last:border-b-0">
      <div className="flex gap-4">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-200"
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">
            {product.title}
          </h3>

          <p className="text-sm text-gray-700 capitalize mt-1">
            {product.category}
          </p>

          <div className="flex flex-wrap gap-4 mt-3 text-sm">
            <span className="font-bold text-gray-900">
              ${product.price}
            </span>

            <span className="font-medium text-gray-800">
              ⭐ {product.rating}
            </span>

            <span className="font-medium text-gray-700">
              Stock: {product.stock}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Link
              href={`/products/${product.id}`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-3 py-2 rounded-lg text-sm"
            >
              View
            </Link>

            <button
              onClick={() => onEdit(product)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-3 py-2 rounded-lg text-sm"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete(product)}
              className="bg-red-100 hover:bg-red-200 text-red-800 font-medium px-3 py-2 rounded-lg text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}