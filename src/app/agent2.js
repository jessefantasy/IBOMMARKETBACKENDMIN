import axios from "axios";

// axios.defaults.baseURL = "https://ibommarket.azurewebsites.net/api/";
axios.defaults.baseURL = "http://localhost:3000/";
axios.defaults.withCredentials = false;
const responseBody = (response) => response.data;

axios.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem("ibmAdminToken"));
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const requests = {
  get: (url, params) => axios.get(url, { params }).then(responseBody),
  post: (url, body) =>
    axios.post(url, body).then((response) => responseBody(response)),
  put: (url, body) => axios.put(url, body).then(responseBody),
  delete: (url) => axios.delete(url).then(responseBody),
  postForm: (url, data) =>
    axios
      .post(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  patchForm: (url, data) => axios.patch(url, data).then(responseBody),
};

const Account = {
  login: (body) => requests.post("account/login", body),
  currentUser: () => requests.get("account/currentUser"),
  register: (body) => requests.post("account/register", body),
};
const Advert = {
  get: () => requests.get("adverts"),
  post: (body) => requests.postForm("adverts", body),
  delete: (id) => requests.delete("adverts/" + id),
};
const Categories = {
  get: () => requests.get("categories"),
  post: (body) => requests.postForm("categories", body),
  delete: (id) => requests.delete("categories/" + id),
};
const SubCategories = {
  get: () => requests.get("subcategories"),
  post: (body) => requests.postForm("subcategories", body),
  delete: (id) => requests.delete("subcategories/" + id),
};
const Properties = {
  get: () => requests.get("properties"),
  getOne: (token) => requests.get("properties/getbytoken/" + token),
  post: (body) => requests.postForm("properties", body),
  delete: (id) => requests.delete("properties/" + id),
};
const UrgentRequests = {
  get: () => requests.get("urgentRequests"),
  getOne: (id) => requests.get("urgentRequests/", id),
  post: (body) => requests.post("urgentRequests", body),
  put: (body) => requests.put("urgentRequests", body),
  delete: (id) => requests.delete("urgentRequests/" + id),
  getRandom: () => requests.get("urgentRequests/randomurgentrequests"),
};
const agent = {
  Account,
  Advert,
  Categories,
  SubCategories,
  Properties,
  UrgentRequests,
};

export default agent;
