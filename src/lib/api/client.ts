// Axios HTTP client configuration
// Axios is a library for making HTTP requests (like fetch, but better)

import axios from "axios";

// Create an axios instance with default configuration
const apiClient = axios.create({
  // Base URL for all API requests
  // In development, this will be http://localhost:3000
  // In production, this will be your deployed URL
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  
  // Default headers
  headers: {
    "Content-Type": "application/json",
  },
  
  // Include credentials (cookies) in requests
  withCredentials: true,
});

// Request interceptor - runs before every request
// Useful for adding authentication tokens
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (if using client-side storage)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        // Add token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
// Useful for handling errors globally
apiClient.interceptors.response.use(
  (response) => {
    // If everything is fine, just return the response
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - user needs to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

