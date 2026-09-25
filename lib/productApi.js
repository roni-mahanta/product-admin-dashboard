import api from "./axios";

export const getProducts = async ({
  search = "",
  category = "",
  sortBy = "",
  sortOrder = "asc",
  page = 1,
  limit = 10,
  signal,
}) => {
  const skip = (page - 1) * limit;

  let url;

  if (search) {
    url =
      `/products/search?q=${encodeURIComponent(search)}` +
      `&limit=${limit}&skip=${skip}`;
  } else if (category) {
    url =
      `/products/category/${encodeURIComponent(category)}` +
      `?limit=${limit}&skip=${skip}`;
  } else {
    url = `/products?limit=${limit}&skip=${skip}`;
  }

  if (sortBy) {
    const separator = url.includes("?") ? "&" : "?";

    url +=
      `${separator}sortBy=${encodeURIComponent(sortBy)}` +
      `&order=${encodeURIComponent(sortOrder)}`;
  }

  const response = await api.get(url, {
    signal,
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get("/products/categories");

  return response.data;
};

export const getProduct = async (productId) => {
  const response = await api.get(`/products/${productId}`);

  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post(
    "/products/add",
    productData
  );

  return response.data;
};

export const updateProduct = async (
  productId,
  productData
) => {
  const response = await api.put(
    `/products/${productId}`,
    productData
  );

  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(
    `/products/${productId}`
  );

  return response.data;
};