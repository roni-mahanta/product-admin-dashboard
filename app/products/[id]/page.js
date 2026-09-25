"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { getProduct } from "../../../lib/productApi";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState("");

  // PROTECT PAGE
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  // FETCH PRODUCT
  const fetchProduct = useCallback(async () => {
    if (!productId) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setProduct(null);

      const data = await getProduct(productId);

      setProduct(data);

      if (data.images?.length > 0) {
        setSelectedImage(data.images[0]);
      } else if (data.thumbnail) {
        setSelectedImage(data.thumbnail);
      }
    } catch (error) {
      console.error("Failed to load product:", error);

      if (error.response?.status === 404) {
        setError("Product not found.");
      } else {
        setError(
          "Unable to load this product. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    router.replace("/login");
  };

  // LOADING STATE
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow px-4 md:px-6 py-4 flex items-center justify-between">
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
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-40 mb-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <div className="h-80 bg-gray-200 rounded-xl" />

                  <div className="flex gap-3 mt-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                    <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                    <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                  </div>
                </div>

                <div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-6" />
                  <div className="h-10 bg-gray-200 rounded w-1/4 mb-6" />
                  <div className="h-24 bg-gray-200 rounded mb-6" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ERROR / NOT FOUND STATE
  if (error) {
    return (
      <main className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow px-4 md:px-6 py-4 flex items-center justify-between">
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

        <section className="min-h-[70vh] flex items-center justify-center p-6">
          <div className="bg-white rounded-xl shadow p-8 md:p-12 text-center max-w-lg w-full">
            <div className="text-6xl mb-5">
              🔍
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              {error === "Product not found."
                ? "Product Not Found"
                : "Something Went Wrong"}
            </h2>

            <p className="text-gray-500 mb-6">
              {error}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={fetchProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg"
              >
                Try Again
              </button>

              <Link
                href="/dashboard"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-lg"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  const images =
    product.images?.length > 0
      ? product.images
      : product.thumbnail
      ? [product.thumbnail]
      : [];

  return (
    <main className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <nav className="bg-white shadow px-4 md:px-6 py-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="text-xl font-bold text-gray-800 hover:text-blue-600"
        >
          Product Admin
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </nav>

      {/* CONTENT */}
      <section className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-5"
          >
            ← Back to Products
          </Link>

          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 md:p-8">
              {/* IMAGE SECTION */}
              <div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-center h-[350px] md:h-[450px]">
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400">
                      No image available
                    </div>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        onClick={() =>
                          setSelectedImage(image)
                        }
                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 p-1 ${
                          selectedImage === image
                            ? "border-blue-500"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-contain rounded"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PRODUCT INFO */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full capitalize">
                    {product.category}
                  </span>

                  <span className="text-sm text-gray-500">
                    Product ID: {product.id}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {product.title}
                </h1>

                <div className="flex flex-wrap items-center gap-5 mt-5">
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </span>

                  <span className="text-gray-600">
                    ⭐ {product.rating}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      product.stock > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h2>

                  <p className="text-gray-600 leading-7">
                    {product.description ||
                      "No description available."}
                  </p>
                </div>

                <div className="mt-8 border-t pt-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Product Information
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Brand
                      </p>
                      <p className="font-medium text-gray-800 mt-1">
                        {product.brand || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        SKU
                      </p>
                      <p className="font-medium text-gray-800 mt-1">
                        {product.sku || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Minimum Order
                      </p>
                      <p className="font-medium text-gray-800 mt-1">
                        {product.minimumOrderQuantity ||
                          "N/A"}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Discount
                      </p>
                      <p className="font-medium text-gray-800 mt-1">
                        {product.discountPercentage
                          ? `${product.discountPercentage}%`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {product.tags?.length > 0 && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">
                      Tags
                    </h2>

                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* REVIEWS */}
            {product.reviews?.length > 0 && (
              <div className="border-t p-5 md:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Customer Reviews
                </h2>

                <div className="space-y-5">
                  {product.reviews.map((review, index) => (
                    <div
                      key={`${review.reviewerEmail}-${index}`}
                      className="border rounded-xl p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {review.reviewerName}
                          </p>

                          <p className="text-sm text-gray-500">
                            {review.reviewerEmail}
                          </p>
                        </div>

                        <span className="text-sm">
                          ⭐ {review.rating}/5
                        </span>
                      </div>

                      <p className="text-gray-600 mt-4">
                        {review.comment}
                      </p>

                      <p className="text-xs text-gray-400 mt-3">
                        {review.date
                          ? new Date(
                              review.date
                            ).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}