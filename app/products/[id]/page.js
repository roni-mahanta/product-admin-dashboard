"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import api from "../../../lib/axios";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const productId = params.id;

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState("");

  // ==========================================
  // FETCH PRODUCT
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/products/${productId}`,
          {
            signal: controller.signal,
          }
        );

        if (controller.signal.aborted) {
          return;
        }

        setProduct(response.data);

        // Set first image as selected image
        if (response.data.images?.length > 0) {
          setSelectedImage(response.data.images[0]);
        } else {
          setSelectedImage(response.data.thumbnail);
        }
      } catch (error) {
        if (
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(error);

        if (error.response?.status === 404) {
          setError("Product not found.");
        } else {
          setError(
            "Failed to load product. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (productId) {
      fetchProduct();
    }

    return () => {
      controller.abort();
    };
  }, [productId]);

  // ==========================================
  // AUTH CHECK
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

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
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-600">
              Loading product...
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
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-10 text-center">

            <div className="text-5xl mb-4">
              ⚠️
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              {error}
            </h2>

            <p className="text-gray-500 mt-2">
              The product you are looking for could not
              be loaded.
            </p>

            <div className="flex justify-center gap-3 mt-6">

              <button
                onClick={() => router.back()}
                className="border border-gray-300 hover:bg-gray-50 px-5 py-2 rounded-lg"
              >
                Go Back
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                Dashboard
              </button>

            </div>
          </div>
        </section>

      </main>
    );
  }

  // ==========================================
  // NO PRODUCT
  // ==========================================

  if (!product) {
    return null;
  }

  // ==========================================
  // PRODUCT IMAGES
  // ==========================================

  const images =
    product.images?.length > 0
      ? product.images
      : [product.thumbnail];

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <main className="min-h-screen bg-gray-100">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="bg-white shadow px-4 md:px-6 py-4 flex items-center justify-between">

        <button
          onClick={() => router.push("/dashboard")}
          className="text-xl font-bold text-gray-800 hover:text-blue-600"
        >
          Product Admin
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </nav>

      {/* ======================================
          CONTENT
      ====================================== */}

      <section className="p-4 md:p-6">

        <div className="max-w-6xl mx-auto">

          {/* BACK BUTTON */}

          <button
            onClick={() => router.back()}
            className="mb-5 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Products
          </button>

          {/* PRODUCT CARD */}

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 md:p-8">

              {/* ==================================
                  IMAGE SECTION
              ================================== */}

              <div>

                {/* MAIN IMAGE */}

                <div className="bg-gray-50 rounded-xl flex items-center justify-center p-6 h-[350px] md:h-[450px]">

                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="max-h-full max-w-full object-contain"
                  />

                </div>

                {/* IMAGE THUMBNAILS */}

                {images.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setSelectedImage(image)
                        }
                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 p-1 ${
                          selectedImage === image
                            ? "border-blue-600"
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

              {/* ==================================
                  PRODUCT INFORMATION
              ================================== */}

              <div>

                {/* CATEGORY */}

                <p className="text-sm text-blue-600 font-semibold uppercase">
                  {product.category}
                </p>

                {/* TITLE */}

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                  {product.title}
                </h1>

                {/* BRAND */}

                {product.brand && (
                  <p className="text-gray-500 mt-3">
                    Brand:{" "}
                    <span className="font-medium text-gray-700">
                      {product.brand}
                    </span>
                  </p>
                )}

                {/* RATING */}

                <div className="flex items-center gap-3 mt-5">

                  <span className="text-yellow-500 text-lg">
                    ⭐
                  </span>

                  <span className="font-semibold text-gray-800">
                    {product.rating}
                  </span>

                  <span className="text-gray-500">
                    / 5
                  </span>

                </div>

                {/* PRICE */}

                <div className="mt-6">

                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price}
                  </span>

                  {product.discountPercentage && (
                    <span className="ml-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {product.discountPercentage}% OFF
                    </span>
                  )}

                </div>

                {/* STOCK */}

                <div className="mt-5">

                  {product.stock > 0 ? (
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold">
                      In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold">
                      Out of Stock
                    </span>
                  )}

                </div>

                {/* DESCRIPTION */}

                <div className="mt-7">

                  <h2 className="text-lg font-bold text-gray-800">
                    Description
                  </h2>

                  <p className="text-gray-600 leading-7 mt-2">
                    {product.description}
                  </p>

                </div>

                {/* SHIPPING */}

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">

                  {product.shippingInformation && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Shipping
                      </p>

                      <p className="font-medium text-gray-800 mt-1">
                        {product.shippingInformation}
                      </p>
                    </div>
                  )}

                  {product.warrantyInformation && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">
                        Warranty
                      </p>

                      <p className="font-medium text-gray-800 mt-1">
                        {product.warrantyInformation}
                      </p>
                    </div>
                  )}

                </div>

                {/* RETURN POLICY */}

                {product.returnPolicy && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-3">

                    <p className="text-sm text-gray-500">
                      Return Policy
                    </p>

                    <p className="font-medium text-gray-800 mt-1">
                      {product.returnPolicy}
                    </p>

                  </div>
                )}

                {/* MINIMUM ORDER */}

                {product.minimumOrderQuantity && (
                  <p className="text-sm text-gray-500 mt-5">
                    Minimum order quantity:{" "}
                    <span className="font-semibold text-gray-700">
                      {product.minimumOrderQuantity}
                    </span>
                  </p>
                )}

              </div>

            </div>

            {/* ==================================
                TAGS
            ================================== */}

            {product.tags?.length > 0 && (
              <div className="border-t p-5 md:p-8">

                <h2 className="text-lg font-bold text-gray-800">
                  Tags
                </h2>

                <div className="flex flex-wrap gap-2 mt-3">

                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}

                </div>

              </div>
            )}

            {/* ==================================
                REVIEWS
            ================================== */}

            {product.reviews?.length > 0 && (
              <div className="border-t p-5 md:p-8">

                <h2 className="text-xl font-bold text-gray-800">
                  Customer Reviews
                </h2>

                <div className="space-y-4 mt-5">

                  {product.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4"
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

                        <div className="text-yellow-500">
                          {"⭐".repeat(
                            Math.min(review.rating, 5)
                          )}
                        </div>

                      </div>

                      <p className="text-gray-600 mt-3">
                        {review.comment}
                      </p>

                      <p className="text-xs text-gray-400 mt-3">
                        {new Date(
                          review.date
                        ).toLocaleDateString()}
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