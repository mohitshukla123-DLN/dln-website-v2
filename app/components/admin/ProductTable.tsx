import type { Product } from "../../types/product";

interface Props {
  products: Product[];
}

export default function ProductTable({
  products,
}: Props) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border p-8 text-center text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 text-left">Image</th>
            <th className="p-4 text-left">Name</th>
            <th className="p-4 text-left">Category</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left">Stock</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-t"
            >
              <td className="p-3">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              </td>

              <td className="p-3 font-medium">
                {product.name}
              </td>

              <td className="p-3">
                {product.category}
              </td>

              <td className="p-3">
                ₹{product.price}
              </td>

              <td className="p-3">
                {product.stock}
              </td>

              <td className="p-3">
                {product.availability}
              </td>

              <td className="p-3 text-right">
                <button className="mr-2 rounded-lg border px-3 py-1">
                  Edit
                </button>

                <button className="rounded-lg bg-red-600 px-3 py-1 text-white">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}