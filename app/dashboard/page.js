"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  createProduct,
  deleteProduct,
  getCategories,
  getProducts,
  updateProduct,
} from "../../lib/productApi";

import ProductTable from "../../components/ProductTable";
import ProductCard from "../../components/ProductCard";
import Pagination from "../../components/Pagination";
import SearchBar from "../../components/SearchBar";
import ProductFilters from "../../components/ProductFilters";
import ProductForm from "../../components/ProductForm";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL STATE
  const searchQuery = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "asc";

  const rawPage = Number(searchParams.get("page"));
  const rawLimit = Number(searchParams.get("limit"));

  const allowedLimits = [10, 20, 50];

  const page =
    Number.isInteger(rawPage) && rawPage > 0
      ? rawPage
      : 1;

  const limit = allowedLimits.includes(rawLimit)
    ? rawLimit
    : 10;

  // STATE
  const [searchInput, setSearchInput] = useState(
    searchQuery
  );

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // PREVENT STALE REQUESTS
  const latestRequestId = useRef(0);

  // PROTECT DASHBOARD
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  // KEEP SEARCH INPUT IN SYNC WITH URL
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // DEBOUNCED SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(
        window.location.search
      );

      const trimmedSearch = searchInput.trim();

      if (trimmedSearch) {
        params.set("search", trimmedSearch);
        params.delete("category");
      } else {
        params.delete("search");
      }

      params.set("page", "1");

      const queryString = params.toString();

      const newUrl = queryString
        ? `/dashboard?${queryString}`
        : "/dashboard";

      const currentUrl =
        window.location.pathname +
        window.location.search;

      if (newUrl !== currentUrl) {
        router.push(newUrl);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, router]);

  // FETCH CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data);
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
    async (signal, requestId) => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts({
          search: searchQuery,
          category,
          sortBy,
          sortOrder,
          page,
          limit,
          signal,
        });

        if (signal.aborted) {
          return;
        }

        if (
          requestId !== latestRequestId.current
        ) {
          return;
        }

        setProducts(data.products || []);
        setTotal(data.total || 0);
      } catch (error) {
        if (
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED"
        ) {
          return;
        }

        if (
          requestId !== latestRequestId.current
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
        if (
          !signal.aborted &&
          requestId === latestRequestId.current
        ) {
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

    const requestId =
      latestRequestId.current + 1;

    latestRequestId.current = requestId;

    fetchProducts(
      controller.signal,
      requestId
    );

    return () => {
      controller.abort();
    };
  }, [fetchProducts]);

  // CLEAR SEARCH AND FILTERS
  const handleClearFilters = () => {
    setSearchInput("");

    router.push("/dashboard?page=1");
  };

  // CATEGORY CHANGE
  const handleCategoryChange = (
    newCategory
  ) => {
    setSearchInput("");

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.delete("search");

    if (newCategory) {
      params.set(
        "category",
        newCategory
      );
    } else {
      params.delete("category");
    }

    params.set("page", "1");

    router.push(
      `/dashboard?${params.toString()}`
    );
  };

  // SORT BY CHANGE
  const handleSortByChange = (
    newSortBy
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (newSortBy) {
      params.set(
        "sortBy",
        newSortBy
      );
    } else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }

    params.set("page", "1");

    router.push(
      `/dashboard?${params.toString()}`
    );
  };

  // SORT ORDER CHANGE
  const handleSortOrderChange = (
    newSortOrder
  ) => {
    if (!sortBy) {
      return;
    }

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set(
      "sortOrder",
      newSortOrder
    );

    params.set("page", "1");

    router.push(
      `/dashboard?${params.toString()}`
    );
  };

  // PAGE CHANGE
  const handlePageChange = (
    newPage
  ) => {
    if (newPage < 1) {
      return;
    }

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set(
      "page",
      String(newPage)
    );

    router.push(
      `/dashboard?${params.toString()}`
    );
  };

  // LIMIT CHANGE
  const handleLimitChange = (
    newLimit
  ) => {
    if (
      !allowedLimits.includes(newLimit)
    ) {
      return;
    }

    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set(
      "limit",
      String(newLimit)
    );

    params.set("page", "1");

    router.push(
      `/dashboard?${params.toString()}`
    );
  };

  // ADD PRODUCT
  const handleAddProduct = () => {
    if (
      formLoading ||
      deleteLoading
    ) {
      return;
    }

    setEditingProduct(null);
    setShowForm(true);
  };

  // EDIT PRODUCT
  const handleEditProduct = (
    product
  ) => {
    if (
      formLoading ||
      deleteLoading
    ) {
      return;
    }

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
  const handleSubmitProduct =
    async (productData) => {
      if (formLoading) {
        return;
      }

      try {
        setFormLoading(true);

        if (editingProduct) {
          const data =
            await updateProduct(
              editingProduct.id,
              productData
            );

          const updatedProduct = {
            ...editingProduct,
            ...data,
          };

          setProducts(
            (currentProducts) =>
              currentProducts.map(
                (product) =>
                  product.id ===
                  editingProduct.id
                    ? updatedProduct
                    : product
              )
          );
        } else {
          const data =
            await createProduct(
              productData
            );

          const newProduct = {
            ...data,
            thumbnail:
              data.thumbnail ||
              "https://dummyjson.com/image/100x100",
          };

          setProducts(
            (currentProducts) => [
              newProduct,
              ...currentProducts,
            ]
          );

          setTotal(
            (currentTotal) =>
              currentTotal + 1
          );
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
  const handleDeleteProduct =
    async (product) => {
      if (deleteLoading) {
        return;
      }

      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${product.title}"?`
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeleteLoading(true);

        await deleteProduct(
          product.id
        );

        setProducts(
          (currentProducts) =>
            currentProducts.filter(
              (item) =>
                item.id !== product.id
            )
        );

        setTotal(
          (currentTotal) =>
            Math.max(
              currentTotal - 1,
              0
            )
        );
      } catch (error) {
        console.error(error);

        alert(
          "Unable to delete the product. Please try again."
        );
      } finally {
        setDeleteLoading(false);
      }
    };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(
      "refreshToken"
    );

    router.replace("/login");
  };

  // NAVBAR
  const renderNavbar = () => {
    return (
      <nav className="bg-white shadow px-4 md:px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          Product Admin
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </nav>
    );
  };

  // INVALID PAGE
  const totalPages =
    Math.ceil(total / limit);

  if (
    !loading &&
    total > 0 &&
    page > totalPages
  ) {
    return (
      <main className="min-h-screen bg-gray-100">
        {renderNavbar()}

        <section className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow p-8 text-center max-w-lg w-full">
            <div className="text-6xl mb-5">
              📄
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Page Not Found
            </h2>

            <p className="text-gray-700 mb-6">
              Page {page} does not exist
              for the current product
              results.
            </p>

            <button
              onClick={() => {
                const params =
                  new URLSearchParams(
                    searchParams.toString()
                  );

                params.set("page", "1");

                router.push(
                  `/dashboard?${params.toString()}`
                );
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
            >
              Go to Page 1
            </button>
          </div>
        </section>
      </main>
    );
  }

  // LOADING
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

  // ERROR
  if (error) {
    return (
      <main className="min-h-screen bg-gray-100">
        {renderNavbar()}

        <section className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow p-8 md:p-12 text-center max-w-lg w-full">
            <div className="text-6xl mb-5">
              ⚠️
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Unable to Load Products
            </h2>

            <p className="text-gray-700 mb-6">
              {error}
            </p>

            <button
              onClick={() =>
                window.location.reload()
              }
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg"
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
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col gap-4">

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Products
                  </h2>

                  <p className="text-gray-700 mt-1">
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
                    disabled={
                      formLoading ||
                      deleteLoading
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-lg whitespace-nowrap transition"
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
                onCategoryChange={
                  handleCategoryChange
                }
                onSortByChange={
                  handleSortByChange
                }
                onSortOrderChange={
                  handleSortOrderChange
                }
                categories={categories}
              />

            </div>
          </div>

          {/* SEARCH MESSAGE */}
          {searchQuery && (
            <div className="px-4 md:px-6 py-3 bg-blue-50 border-b border-blue-100">
              <p className="text-sm text-gray-800">
                Searching for{" "}
                <span className="font-bold text-gray-900">
                  "{searchQuery}"
                </span>
              </p>
            </div>
          )}

          {/* CATEGORY MESSAGE */}
          {category && !searchQuery && (
            <div className="px-4 md:px-6 py-3 bg-gray-50 border-b border-gray-200">
              <p className="text-sm text-gray-800">
                Showing products in{" "}
                <span className="font-bold text-gray-900 capitalize">
                  {category}
                </span>
              </p>
            </div>
          )}

          {/* EMPTY */}
          {products.length === 0 ? (
            <div className="p-10 md:p-16 text-center">

              <div className="text-6xl mb-5">
                📦
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Products Found
              </h3>

              <p className="text-gray-700 max-w-md mx-auto">
                We couldn't find any products
                matching your current search
                or filters.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">

                <button
                  onClick={
                    handleClearFilters
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg"
                >
                  Clear Search & Filters
                </button>

                <button
                  onClick={
                    handleAddProduct
                  }
                  disabled={
                    formLoading ||
                    deleteLoading
                  }
                  className="border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-900 font-semibold px-5 py-3 rounded-lg"
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
                  onEdit={
                    handleEditProduct
                  }
                  onDelete={
                    handleDeleteProduct
                  }
                />
              </div>

              {/* MOBILE CARDS */}
              <div className="block md:hidden">
                {products.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={
                        handleEditProduct
                      }
                      onDelete={
                        handleDeleteProduct
                      }
                    />
                  )
                )}
              </div>

              {/* PAGINATION */}
              <Pagination
                page={page}
                limit={limit}
                total={total}
                onPageChange={
                  handlePageChange
                }
                onLimitChange={
                  handleLimitChange
                }
              />
            </>
          )}
        </div>
      </section>

      {/* PRODUCT FORM */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={
            handleSubmitProduct
          }
          onClose={
            handleCloseForm
          }
          loading={formLoading}
        />
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-lg font-semibold text-gray-800">
            Loading dashboard...
          </div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}