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
            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Product
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Category
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Price
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Rating
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Stock
            </th>

            <th className="px-4 py-3 text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b hover:bg-gray-50"
            >
              <td className="px-4 py-4">
                <Link
                  href={`/products/${product.id}`}
                  className="flex items-center gap-3 group"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-lg"
                  />

                  <span className="font-medium text-gray-800 group-hover:text-blue-600">
                    {product.title}
                  </span>
                </Link>
              </td>

              <td className="px-4 py-4 text-gray-600 capitalize">
                {product.category}
              </td>

              <td className="px-4 py-4 font-medium">
                ${product.price}
              </td>

              <td className="px-4 py-4">
                ⭐ {product.rating}
              </td>

              <td className="px-4 py-4 text-gray-600">
                {product.stock}
              </td>

              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    View
                  </Link>

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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}