"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import api from "../../lib/axios";

import ProductTable from "../../components/ProductTable";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import ProductFilters from "../../components/ProductFilters";
import ProductForm from "../../components/ProductForm";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL STATE
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

  // STATE
  const [searchInput, setSearchInput] = useState(searchQuery);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // CRUD STATE
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // PROTECT DASHBOARD
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  // KEEP SEARCH INPUT IN SYNC
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // DEBOUNCED SEARCH
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

      params.set("page", "1");

      const newUrl = `/dashboard?${params.toString()}`;
      const currentUrl =
        `/dashboard?${searchParams.toString()}`;

      if (newUrl !== currentUrl) {
        router.push(newUrl);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, router, searchParams]);

  // FETCH CATEGORIES
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

  // FETCH PRODUCTS
  const fetchProducts = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError("");

        const skip = (page - 1) * limit;

        let url;

        if (searchQuery) {
          url =
            `/products/search?q=${encodeURIComponent(
              searchQuery
            )}` +
            `&limit=${limit}&skip=${skip}`;
        } else if (category) {
          url =
            `/products/category/${encodeURIComponent(
              category
            )}` +
            `?limit=${limit}&skip=${skip}`;
        } else {
          url = `/products?limit=${limit}&skip=${skip}`;
        }

        if (sortBy) {
          const separator = url.includes("?")
            ? "&"
            : "?";

          url +=
            `${separator}sortBy=${sortBy}` +
            `&order=${sortOrder}`;
        }

        const response = await api.get(url, {
          signal,
        });

        if (signal?.aborted) {
          return;
        }

        setProducts(response.data.products || []);
        setTotal(response.data.total || 0);
      } catch (error) {
        if (
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(error);

        setProducts([]);
        setTotal(0);

        setError(
          "Failed to load products. Please check your connection and try again."
        );
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [
      searchQuery,
      category,
      sortBy,
      sortOrder,
      page,
      limit,
    ]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  // CLEAR SEARCH / FILTERS
  const handleClearFilters = () => {
    setSearchInput("");

    router.push("/dashboard?page=1");
  };

  // CATEGORY CHANGE
  const handleCategoryChange = (newCategory) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }

    params.set("page", "1");

    router.push(`/dashboard?${params.toString()}`);
  };

  // SORT BY CHANGE
  const handleSortByChange = (newSortBy) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (newSortBy) {
      params.set("sortBy", newSortBy);
    } else {
      params.delete("sortBy");
    }

    params.set("page", "1");

    router.push(`/dashboard?${params.toString()}`);
  };

  // SORT ORDER CHANGE
  const handleSortOrderChange = (newSortOrder) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("sortOrder", newSortOrder);
    params.set("page", "1");

    router.push(`/dashboard?${params.toString()}`);
  };

  // PAGE CHANGE
  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("page", String(newPage));

    router.push(`/dashboard?${params.toString()}`);
  };

  // LIMIT CHANGE
  const handleLimitChange = (newLimit) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("limit", String(newLimit));
    params.set("page", "1");

    router.push(`/dashboard?${params.toString()}`);
  };

  // OPEN ADD FORM
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  // OPEN EDIT FORM
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // CLOSE FORM
  const handleCloseForm = () => {
    if (formLoading) {
      return;
    }

    setShowForm(false);
    setEditingProduct(null);
  };

  // ADD / EDIT PRODUCT
  const handleSubmitProduct = async (productData) => {
    try {
      setFormLoading(true);

      if (editingProduct) {
        const response = await api.put(
          `/products/${editingProduct.id}`,
          productData
        );

        const updatedProduct = {
          ...editingProduct,
          ...response.data,
        };

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product.id === editingProduct.id
              ? updatedProduct
              : product
          )
        );
      } else {
        const response = await api.post(
          "/products/add",
          productData
        );

        const newProduct = {
          ...response.data,
          thumbnail:
            response.data.thumbnail ||
            "https://dummyjson.com/image/100x100",
        };

        setProducts((currentProducts) => [
          newProduct,
          ...currentProducts,
        ]);

        setTotal((currentTotal) => currentTotal + 1);
      }

      setShowForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error(error);

      alert(
        "Unable to save the product. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // DELETE PRODUCT
  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/products/${product.id}`);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== product.id
        )
      );

      setTotal((currentTotal) =>
        Math.max(currentTotal - 1, 0)
      );
    } catch (error) {
      console.error(error);

      alert(
        "Unable to delete the product. Please try again."
      );
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    router.replace("/login");
  };

  // NAVBAR
  const renderNavbar = () => {
    return (
      <nav className="bg-white shadow px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">
          Product Admin
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </nav>
    );
  };

  // LOADING STATE
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        {renderNavbar()}

        <section className="p-4 md:p-6">
          <div className="bg-white rounded-xl shadow p-6 md:p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-40 mb-3" />

              <div className="h-4 bg-gray-200 rounded w-64 mb-8" />

              <div className="h-12 bg-gray-200 rounded w-full mb-4" />

              <div className="space-y-4">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <main className="min-h-screen bg-gray-100">
        {renderNavbar()}

        <section className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow p-8 md:p-12 text-center max-w-lg w-full">
            <div className="text-6xl mb-5">
              ⚠️
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Unable to Load Products
            </h2>

            <p className="text-gray-500 mb-6">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        </section>
      </main>
    );
  }

  // DASHBOARD
  return (
    <main className="min-h-screen bg-gray-100">
      {renderNavbar()}

      <section className="p-4 md:p-6">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {/* HEADER */}
          <div className="p-4 md:p-6 border-b">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Products
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Manage your products
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <SearchBar
                    value={searchInput}
                    onChange={setSearchInput}
                  />

                  <button
                    onClick={handleAddProduct}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg font-medium whitespace-nowrap transition"
                  >
                    + Add Product
                  </button>
                </div>
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

          {/* ACTIVE SEARCH */}
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
            <div className="p-10 md:p-16 text-center">
              <div className="text-6xl mb-5">
                📦
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Products Found
              </h3>

              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any products matching your
                current search or filters.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                <button
                  onClick={handleClearFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
                >
                  Clear Search & Filters
                </button>

                <button
                  onClick={handleAddProduct}
                  className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-lg transition"
                >
                  + Add Product
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block">
                <ProductTable
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                />
              </div>

              {/* MOBILE CARDS */}
              <div className="block md:hidden">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
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

      {/* PRODUCT FORM */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmitProduct}
          onClose={handleCloseForm}
          loading={formLoading}
        />
      )}
    </main>
  );
}