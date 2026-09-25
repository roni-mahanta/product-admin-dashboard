"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import api from "../../lib/axios";
import ProductTable from "../../components/ProductTable";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Read page and limit from URL
   */
  const rawPage = Number(searchParams.get("page"));
  const rawLimit = Number(searchParams.get("limit"));

  const page =
    Number.isInteger(rawPage) && rawPage >= 1
      ? rawPage
      : 1;

  const allowedLimits = [10, 20, 50];

  const limit = allowedLimits.includes(rawLimit)
    ? rawLimit
    : 10;

  /*
   * Redirect invalid URL values
   */
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    let changed = false;

    if (searchParams.get("page") !== String(page)) {
      params.set("page", String(page));
      changed = true;
    }

    if (searchParams.get("limit") !== String(limit)) {
      params.set("limit", String(limit));
      changed = true;
    }

    if (changed) {
      router.replace(`/dashboard?${params.toString()}`);
    }
  }, [searchParams, page, limit, router]);

  /*
   * Check login
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  /*
   * Fetch products
   */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const skip = (page - 1) * limit;

        const response = await api.get(
          `/products?limit=${limit}&skip=${skip}`
        );

        setProducts(response.data.products);
        setTotal(response.data.total);
      } catch (error) {
        console.error(error);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit]);

  /*
   * Change page
   */
  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil(total / limit);

    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", String(newPage));

    router.push(`/dashboard?${params.toString()}`);
  };

  /*
   * Change page size
   */
  const handleLimitChange = (newLimit) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("limit", String(newLimit));

    // Reset to page 1 when page size changes
    params.set("page", "1");

    router.push(`/dashboard?${params.toString()}`);
  };

  /*
   * Logout
   */
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
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Products */}
            {!loading &&
              !error &&
              products.length > 0 && (
                <>
                  {/* Desktop */}
                  <div className="hidden md:block">
                    <ProductTable products={products} />
                  </div>

                  {/* Mobile */}
                  <div className="block md:hidden">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    page={page}
                    limit={limit}
                    total={total}
                    onPageChange={handlePageChange}
                    onLimitChange={handleLimitChange}
                  />
                </>
              )}

            {/* Empty */}
            {!loading &&
              !error &&
              products.length === 0 && (
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