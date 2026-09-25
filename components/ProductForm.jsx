"use client";

import { useEffect, useState } from "react";

export default function ProductForm({
  product,
  onSubmit,
  onClose,
  loading,
}) {
  const isEditing = Boolean(product);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    stock: "",
    category: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        price: product.price ?? "",
        stock: product.stock ?? "",
        category: product.category || "",
        description: product.description || "",
      });
    } else {
      setFormData({
        title: "",
        price: "",
        stock: "",
        category: "",
        description: "",
      });
    }

    setErrors({});
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required.";
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      newErrors.price = "Enter a valid price.";
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      newErrors.stock = "Enter a valid stock quantity.";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description =
        "Product description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      category: formData.category.trim(),
      description: formData.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditing
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p className="mt-1 text-base text-gray-700">
                {isEditing
                  ? "Update the product information"
                  : "Enter the product information"}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Close form"
              className="text-2xl font-bold text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              ×
            </button>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 space-y-5"
        >
          {/* PRODUCT TITLE */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Product Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter product title"
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 bg-white outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
            />

            {errors.title && (
              <p className="mt-1 text-sm font-medium text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          {/* PRICE + STOCK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="19.99"
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 bg-white outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
              />

              {errors.price && (
                <p className="mt-1 text-sm font-medium text-red-600">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Stock
              </label>

              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="34"
                disabled={loading}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 bg-white outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
              />

              {errors.stock && (
                <p className="mt-1 text-sm font-medium text-red-600">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          {/* CATEGORY */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Category
            </label>

            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              placeholder="beauty"
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 bg-white outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
            />

            {errors.category && (
              <p className="mt-1 text-sm font-medium text-red-600">
                {errors.category}
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 bg-white outline-none transition resize-y focus:border-blue-600 focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
            />

            {errors.description && (
              <p className="mt-1 text-sm font-medium text-red-600">
                {errors.description}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-3 border border-gray-300 rounded-lg text-gray-900 font-semibold bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-5 py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Product"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}