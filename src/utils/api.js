import axios from "./axios-customize";

const postRegister = (fullName, email, password, phone) => {
  return axios.post("/api/v1/user/register", {
    fullName,
    email,
    password,
    phone,
  });
};

const postLogin = (username, password) => {
  return axios.post("/api/v1/auth/login", {
    username,
    password,
  });
};

const postLogout = () => {
  return axios.post("/api/v1/auth/logout");
};

const getAccount = () => {
  return axios.get("/api/v1/auth/account");
};

const getUsersWithPaginate = (current, pageSize, query) => {
  return axios.get(
    `/api/v1/user?current=${current}&pageSize=${pageSize}${query}`
  );
};

const postCreateNewUser = (fullName, password, email, phone) => {
  return axios.post("/api/v1/user", {
    fullName,
    password,
    email,
    phone,
  });
};

const postCreateListUsers = (data) => {
  return axios.post("/api/v1/user/bulk-create", data);
};

const putUpdateUser = (_id, fullName, phone) => {
  return axios.put("/api/v1/user", {
    _id,
    fullName,
    phone,
  });
};

const deleteUser = (id) => {
  return axios.delete(`/api/v1/user/${id}`);
};

const getBooksWithPaginate = (current, pageSize, query) => {
  return axios.get(
    `/api/v1/book?current=${current}&pageSize=${pageSize}${query}`
  );
};

const getBookCategory = () => {
  return axios.get("/api/v1/database/category");
};

const postUploadBookImg = (fileImg) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "book",
    },
  });
};

const postCreateBook = (data) => {
  return axios.post("/api/v1/book", data);
};

const putUpdateBook = (_id, data) => {
  return axios.put(`/api/v1/book/${_id}`, data);
};

const deleteBook = (id) => {
  return axios.delete(`/api/v1/book/${id}`);
};

const getBookById = (id) => {
  return axios.get(`/api/v1/book/${id}`);
};

const postCreateOrder = (data) => {
  return axios.post("/api/v1/order", data);
};

const getHistory = () => {
  return axios.get(`/api/v1/history`);
};

const putUpdateProfile = (data) => {
  return axios.put(`/api/v1/user`, data);
};

const postUploadAvatar = (fileImg) => {
  const avatarFormData = new FormData();
  avatarFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: "/api/v1/file/upload",
    data: avatarFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};

const postChangePassword = (data) => {
  return axios.post("/api/v1/user/change-password", data);
};

const getDashboard = () => {
  return axios.get(`/api/v1/database/dashboard`);
};

const getOrderWithPaginate = (current, pageSize, query) => {
  return axios.get(
    `/api/v1/order?current=${current}&pageSize=${pageSize}${query}`
  );
};

export {
  postRegister,
  postLogin,
  postLogout,
  getAccount,
  getUsersWithPaginate,
  postCreateNewUser,
  postCreateListUsers,
  putUpdateUser,
  deleteUser,
  getBooksWithPaginate,
  getBookCategory,
  postUploadBookImg,
  postCreateBook,
  putUpdateBook,
  deleteBook,
  getBookById,
  postCreateOrder,
  getHistory,
  postUploadAvatar,
  putUpdateProfile,
  postChangePassword,
  getDashboard,
  getOrderWithPaginate,
};
