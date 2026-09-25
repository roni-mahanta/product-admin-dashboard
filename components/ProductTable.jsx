"use client";

export default function ProductTable({ products }) {
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
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b hover:bg-gray-50"
            >
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-lg"
                  />

                  <span className="font-medium text-gray-800">
                    {product.title}
                  </span>
                </div>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}