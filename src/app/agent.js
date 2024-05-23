import axios from "axios";
 
axios.defaults.baseURL = import.meta.env.VITE_IBM_API_BASE_URL; 
axios.defaults.withCredentials = false;
const responseBody = (response) => response.data;

axios.interceptors.request.use((config) => {
  const token =  localStorage.getItem("ibmManagementToken")
  console.log(token)
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const requests = {
  get: (url, params) => axios.get(url, { params }).then(responseBody),
  post: (url, body) =>
    axios.post(url, body).then((response) => responseBody(response)),
  put: (url, body) => axios.put(url, body).then(responseBody),
  patch: (url, body) => axios.patch(url, body).then(responseBody),
  delete: (url) => axios.delete(url).then(responseBody),
  postForm: (url, data) =>
    axios
      .post(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  patchFileForm: (url, data) =>
    axios
      .patch(url, data, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody),
  patchForm: (url, data) => axios.patch(url, data).then(responseBody),
};

const Cards = {
  getCards: () => requests.get("post"),
  postCards: (body) => requests.post("post", body),
  deleteCards: (id) => requests.delete("post/" + id),
};
const Account = {
  login: (body) => requests.post("account/role-login", body),
  currentUser: () => requests.get("account/role-current-user"),
  register: (body) => requests.post("account/register", body),
  sendResetEmail: (body) =>
    requests.post("account/send-password-recovery-email", body),
  resetPassword: (body) => requests.post("account/reset-password", body),
};
const Business = {
  getBusinesses: () => requests.get("business"),
  getBusiness: (id) => requests.get("business/" + id),
  getBusinessWithUserId: (id) => requests.get("business/user-businesses/" + id),
  getBusinessWithIbmId: (id) => requests.get("business/getbybusinessid/" + id),
  getBusinessSlides: () => requests.get("business/with-properties"),
  addBusiness: (body) => requests.postForm("business", body),
  editBusiness: (id, body) => requests.patchForm("business/" + id, body),
  editBusinessLogo: (id, body) =>
    requests.patchFileForm("business/" + id + "/image", body),
  delete: (id) => requests.delete("business/" + id),
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
  get: (pageNumber = 1) => requests.get("post?pageNumber=" + pageNumber),
  search: (
    SearchTerm = "",
    subcategory = "",
    PageNumber = 1,
    PageSize = 10,
    OrderBy = "title",
    businessid = ""
  ) =>
    requests.get("posts", {
      SearchTerm,
      PageNumber,
      PageSize,
      OrderBy,
      subcategory,
      businessid,
    }),
  adminGet: (pageNumber = 1) => requests.get("post-admin?pageNumber=" + pageNumber),
  search: (
    SearchTerm = "",
    subcategory = "",
    PageNumber = 1,
    PageSize = 10,
    OrderBy = "title",
    businessid = ""
  ) =>
    requests.get("posts", {
      SearchTerm,
      PageNumber,
      PageSize,
      OrderBy,
      subcategory,
      businessid,
    }),
  getOne: (token) => requests.get("post/" + token),
  getBusinessProperties: (id) => requests.get("business/" + id),
  getSimilarProperties: (id, pageNumber = 1) =>
    requests.get(
      "properties/relatedproperties/" + id + "?pageNumber=" + pageNumber
    ),
  post: (body) => requests.postForm("post", body),
  delete: (id) => requests.delete("properties/" + id),
  adminEdit : ( body , id ) => requests.patch ("post/admin-edit/" + id , body)
};
const UrgentRequests = {
  get: () => requests.get("urgentRequests"),
  getOne: (id) => requests.get("urgentRequests/", id),
  post: (body) => requests.post("urgentRequests", body),
  put: (body) => requests.put("urgentRequests", body),
  delete: (id) => requests.delete("urgentRequests/" + id),
  getRandom: () => requests.get("urgentRequests/randomurgentrequests"),
};
const Managers = {
  getAll : () => requests.get("/admin-get-manager"),
  addManager : (data) => requests.post("/admin-add-manager" , data),
  adminDelete :(id) => requests.delete("/admin-delete-manager/" + id ),
  adminPauseResume :(id , type) => requests.patch("/admin-pause-resume-manager/" + id , type ),
  activate : (token) => requests.post("/manager/activate/" , token)
}
const AdminAndManager = {
  getAllPosts : () => requests.get("/admin-manager/get-post" ),
  eidtPost : (body , id) => requests.patch("/admin/admin-manager-edit-post/" + id , body)
}
const agent = { 
  Cards,
  Account,
  Advert,
  Business,
  Categories,
  SubCategories,
  Properties,
  UrgentRequests,
  Managers,
  AdminAndManager,
};

export default agent;
