"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";
import ProductTable from "../../components/ProductTable";

export default function DashboardPage() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products?limit=10");

      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    router.replace("/login");
  };

  return (
    <main className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Product Admin
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      {/* Dashboard */}
      <section className="p-6">
        <div className="max-w-7xl mx-auto">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Products
            </h2>

            <p className="text-gray-500 mt-1">
              Manage your products
            </p>
          </div>

          <div className="bg-white rounded-xl shadow overflow-hidden">

            {/* Loading */}
            {loading && (
              <div className="p-10 text-center">
                <p className="text-gray-500">
                  Loading products...
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="p-10 text-center">
                <p className="text-red-500 mb-4">
                  {error}
                </p>

                <button
                  onClick={fetchProducts}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Products */}
            {!loading && !error && products.length > 0 && (
              <ProductTable products={products} />
            )}

            {/* Empty */}
            {!loading && !error && products.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-gray-500">
                  No products found.
                </p>
              </div>
            )}

          </div>
        </div>
      </section>
    </main>
  );
}