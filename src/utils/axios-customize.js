import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL;
const NO_RETRY_HEADER = "x-no-retry";

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

instance.defaults.headers.common = {
  Authorization: `bearer ${localStorage.getItem("access_token")}`,
};

const handleRefreshToken = async () => {
  let res = await instance.get("/api/v1/auth/refresh");
  if (res && res.data.access_token) {
    return res.data.access_token;
  } else null;
};

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if (
      error.config &&
      error.response &&
      +error.response.status === 401 &&
      !error.config.headers[NO_RETRY_HEADER]
    ) {
      const access_token = await handleRefreshToken();
      if (access_token) {
        error.config.headers[NO_RETRY_HEADER] = "true";
        error.config.headers["Authorization"] = `bearer ${access_token}`;
        localStorage.setItem("access_token", access_token);
        return instance.request(error.config);
      }
    }

    if (
      error.config &&
      error.response &&
      +error.response.status === 400 &&
      error.config.url === "/api/v1/auth/refresh"
    ) {
      window.location.href = "/login";
    }

    return error?.response?.data ?? Promise.reject(error);
  }
);

export default instance;