"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import api from "../../lib/axios";

import ProductTable from "../../components/ProductTable";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import ProductFilters from "../../components/ProductFilters";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ==========================================
  // URL STATE
  // ==========================================

  const searchQuery = searchParams.get("search") || "";

  const category = searchParams.get("category") || "";

  const sortBy = searchParams.get("sortBy") || "";

  const sortOrder = searchParams.get("sortOrder") || "asc";

  const pageParam = Number(searchParams.get("page")) || 1;

  const limitParam = Number(searchParams.get("limit")) || 10;

  const allowedLimits = [10, 20, 50];

  const page = pageParam < 1 ? 1 : pageParam;

  const limit = allowedLimits.includes(limitParam)
    ? limitParam
    : 10;

  // ==========================================
  // STATE
  // ==========================================

  const [searchInput, setSearchInput] = useState(searchQuery);

  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // PROTECT DASHBOARD
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  // ==========================================
  // KEEP SEARCH INPUT IN SYNC WITH URL
  // ==========================================

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // ==========================================
  // DEBOUNCED SEARCH
  // ==========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(
        searchParams.toString()
      );

      const trimmedSearch = searchInput.trim();

      if (trimmedSearch) {
        params.set("search", trimmedSearch);
      } else {
        params.delete("search");
      }

      // Search should always start from page 1
      params.set("page", "1");

      const newUrl = `/dashboard?${params.toString()}`;

      const currentUrl = `/dashboard?${searchParams.toString()}`;

      if (newUrl !== currentUrl) {
        router.push(newUrl);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, router, searchParams]);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/products/categories");

        setCategories(response.data);
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      }
    };

    fetchCategories();
  }, []);

  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const skip = (page - 1) * limit;

        let url;

        // ======================================
        // SEARCH
        // ======================================

        if (searchQuery) {
          url =
            `/products/search?q=${encodeURIComponent(
              searchQuery
            )}` +
            `&limit=${limit}&skip=${skip}`;
        }

        // ======================================
        // CATEGORY
        // ======================================

        else if (category) {
          url =
            `/products/category/${encodeURIComponent(
              category
            )}` +
            `?limit=${limit}&skip=${skip}`;
        }

        // ======================================
        // ALL PRODUCTS
        // ======================================

        else {
          url = `/products?limit=${limit}&skip=${skip}`;
        }

        // ======================================
        // SORTING
        // ======================================

        if (sortBy) {
          const separator = url.includes("?")
            ? "&"
            : "?";

          url += `${separator}sortBy=${sortBy}&order=${sortOrder}`;
        }

        const response = await api.get(url, {
          signal: controller.signal,
        });

        // Ignore cancelled requests
        if (controller.signal.aborted) {
          return;
        }

        setProducts(response.data.products);

        setTotal(response.data.total);
      } catch (error) {
        // Ignore cancelled requests
        if (
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(error);

        setError(
          "Failed to load products. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Cancel old request when
    // URL state changes
    return () => {
      controller.abort();
    };
  }, [
    searchQuery,
    category,
    sortBy,
    sortOrder,
    page,
    limit,
  ]);

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = (newCategory) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    // Start from page 1
    params.set("page", "1");

    router.push(`/dashboard?${params.toString()}`);
  };

  // ==========================================
  // SORT BY CHANGE
  // ==========================================

  const handleSortByChange = (newSortBy) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (newSortBy) {
      params.set("sortBy", newSortBy);
    } else {
      params.delete("sortBy");
    }

    // Start from page 1
    params.set("page", "1");

    router.push(`/dashboard?${params.toString()}`);
  };

  // ==========================================
  // SORT ORDER CHANGE
  // ==========================================

  const handleSortOrderChange = (newSortOrder) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("sortOrder", newSortOrder);

    // Start from page 1
    params.set("page", "1");

    router.push(`/dashboard?${params.toString()}`);
  };

  // ==========================================
  // PAGE CHANGE
  // ==========================================

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", String(newPage));

    router.push(`/dashboard?${params.toString()}`);
  };

  // ==========================================
  // LIMIT CHANGE
  // ==========================================

  const handleLimitChange = (newLimit) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("limit", String(newLimit));

    // Start from page 1
    params.set("page", "1");

    router.push(`/dashboard?${params.toString()}`);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("refreshToken");

    router.replace("/login");
  };

  // ==========================================
  // LOADING STATE
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
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

        <section className="p-4 md:p-6">
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-600">
              Loading products...
            </p>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100">
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

        <section className="p-4 md:p-6">
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-red-600 mb-4">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100">

      {/* NAVBAR */}

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

      {/* CONTENT */}

      <section className="p-4 md:p-6">
        <div className="bg-white rounded-xl shadow overflow-hidden">

          {/* HEADER */}

          <div className="p-4 md:p-6 border-b">

            <div className="flex flex-col gap-4">

              {/* TITLE + SEARCH */}

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Products
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Manage your products
                  </p>
                </div>

                <SearchBar
                  value={searchInput}
                  onChange={setSearchInput}
                />

              </div>

              {/* FILTERS */}

              <ProductFilters
                category={category}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onCategoryChange={handleCategoryChange}
                onSortByChange={handleSortByChange}
                onSortOrderChange={handleSortOrderChange}
                categories={categories}
              />

            </div>
          </div>

          {/* SEARCH MESSAGE */}

          {searchQuery && (
            <div className="px-4 md:px-6 py-3 bg-gray-50 border-b">
              <p className="text-sm text-gray-600">
                Search results for{" "}
                <span className="font-semibold text-gray-800">
                  "{searchQuery}"
                </span>
              </p>
            </div>
          )}

          {/* EMPTY STATE */}

          {products.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500">
                No products found.
              </p>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}

              <div className="hidden md:block">
                <ProductTable products={products} />
              </div>

              {/* MOBILE CARDS */}

              <div className="block md:hidden">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>

              {/* PAGINATION */}

              <Pagination
                page={page}
                limit={limit}
                total={total}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </>
          )}
        </div>
      </section>
    </main>
  );
}