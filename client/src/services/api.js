const API_BASE_URL = "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? {
              Authorization: `Bearer ${token}`
            }
          : {}),
        ...(options.headers || {})
      }
    }
  );

  const result = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Something went wrong"
    );
  }

  return result;
};

const api = {
  get: (endpoint) =>
    request(endpoint),

  post: (endpoint, body) =>
    request(endpoint, {
      method: "POST",
      body: JSON.stringify(body)
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body)
    }),

  delete: (endpoint) =>
    request(endpoint, {
      method: "DELETE"
    })
};

export default api;