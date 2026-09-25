"use client";

import Link from "next/link";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-4 text-sm font-bold text-gray-800">
              Product
            </th>

            <th className="px-4 py-4 text-sm font-bold text-gray-800">
              Category
            </th>

            <th className="px-4 py-4 text-sm font-bold text-gray-800">
              Price
            </th>

            <th className="px-4 py-4 text-sm font-bold text-gray-800">
              Rating
            </th>

            <th className="px-4 py-4 text-sm font-bold text-gray-800">
              Stock
            </th>

            <th className="px-4 py-4 text-sm font-bold text-gray-800">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              {/* PRODUCT */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-3 min-w-[250px]">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                  />

                  <span className="font-semibold text-gray-900">
                    {product.title}
                  </span>
                </div>
              </td>

              {/* CATEGORY */}
              <td className="px-4 py-4">
                <span className="text-gray-800 font-medium capitalize">
                  {product.category}
                </span>
              </td>

              {/* PRICE */}
              <td className="px-4 py-4">
                <span className="font-bold text-gray-900">
                  ${product.price}
                </span>
              </td>

              {/* RATING */}
              <td className="px-4 py-4">
                <span className="font-medium text-gray-800">
                  ⭐ {product.rating}
                </span>
              </td>

              {/* STOCK */}
              <td className="px-4 py-4">
                <span className="font-medium text-gray-800">
                  {product.stock}
                </span>
              </td>

              {/* ACTIONS */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium px-4 py-2 rounded-lg transition"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => onEdit(product)}
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-4 py-2 rounded-lg transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(product)}
                    className="bg-red-100 hover:bg-red-200 text-red-800 font-medium px-4 py-2 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}