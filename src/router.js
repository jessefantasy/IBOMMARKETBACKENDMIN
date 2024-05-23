import { createRouter, createWebHistory } from "vue-router";
import Home from "./views/page/Home.vue";
// import AdminCategories from "./views/page/AdminCategories.vue";
import SubCategories from "./views/page/SubCategories.vue";
import Login from "./views/page/Login.vue";
import Adverts from "./views/page/Adverts.vue";
import Posts from "./views/page/Posts.vue";
import ErrorComponent from "./views/page/ErrorComponent.vue";

// Manager home
import ManagerHome from "./views/roles/manager/ManagerHome.vue";
import ManagerPosts from "./views/roles/manager/ManangerPosts.vue";
import ManagerBusinesses from "./views/roles/manager/ManagerBusinesses.vue";
import ManagerAdverts from "./views/roles/manager/ManagerAdverts.vue";
import ManagerCategories from "./views/roles/manager/ManagerCategories.vue";
import ManagerSubCategories from "./views/roles/manager/ManagerSubCategories.vue";
import ManagerUsers from "./views/roles/manager/ManagerUsers.vue";
import ManagerActivation from "./views/roles/manager/ManagerActivation.vue";
//
//
//
//
//
//
// ADMIN
import AdminHome from "./views/roles/admin/AdminHome.vue";
import AdminAdverts from "./views/roles/admin/AdminAdverts.vue";
import AdminManagers from "./views/roles/admin/AdminManagers.vue";
import AdminCategories from "./views/roles/admin/AdminCategories.vue";
import AdminSubCategories from "./views/roles/admin/AdminSubCategories.vue";
import AdminUsers from "./views/roles/admin/AdminUsers.vue";
import AdminPosts from "./views/roles/admin/AdminPosts.vue";

//
//
//
//
//
// Marketer
import MarketerAdverts from "./views/roles/marketer/MarketerAdverts.vue";
import MarketerBusinesses from "./views/roles/marketer/MarketerBusinesses.vue";
import MarketerCategories from "./views/roles/marketer/MarketerCategories.vue";
import MarketerHome from "./views/roles/marketer/MarketerHome.vue";
import MarketerSubCategories from "./views/roles/marketer/MarketerSubCategories.vue";
import MarketerUsers from "./views/roles/marketer/MarketerUsers.vue";
import MarketerPosts from "./views/roles/marketer/MarketerPosts.vue";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    // marketer
    {
      path: "/marketer/adverts",
      name: "Marketer Adverts",
      component: MarketerAdverts,
    },
    {
      path: "/marketer/businesses",
      name: "Marketer Businesses",
      component: MarketerBusinesses,
    },
    {
      path: "/marketer/categories",
      name: "Marketer Categories",
      component: MarketerCategories,
    },
    {
      path: "/marketer/",
      name: "Marketer Home",
      component: MarketerHome,
    },
    {
      path: "/marketer/subcategories",
      name: "Marketer Subcategories",
      component: MarketerSubCategories,
    },
    {
      path: "/marketer/users",
      name: "Marketer Users",
      component: MarketerUsers,
    },
    {
      path: "/marketer/posts",
      name: "Marketer Posts",
      component: MarketerPosts,
    },
    // admin
    {
      path: "/admin/",
      name: "Admin Home",
      component: AdminHome,
    },
    {
      path: "/admin/adverts",
      name: "Admin Adverts",
      component: AdminAdverts,
    },
    {
      path: "/admin/managers",
      name: "Admin Managers",
      component: AdminManagers,
    },
    {
      path: "/admin/categories",
      name: "Admin Categories",
      component: AdminCategories,
    },
    {
      path: "/admin/subcategories",
      name: "Admin SubCategories",
      component: AdminSubCategories,
    },
    {
      path: "/admin/users",
      name: "Admin Users",
      component: AdminUsers,
    },
    {
      path: "/admin/posts",
      name: "Admin Posts",
      component: AdminPosts,
    },
    // mamager
    {
      path: "/manager",
      name: "Manager Home",
      component: ManagerHome,
    },
    {
      path: "/manager/posts",
      name: "Manager Posts",
      component: ManagerPosts,
    },
    {
      path: "/manager/businesses",
      name: "Manager Businesses",
      component: ManagerBusinesses,
    },
    {
      path: "/manager/adverts",
      name: "Manager Adverts",
      component: ManagerAdverts,
    },
    {
      path: "/manager/categories",
      name: "Manager Categories",
      component: ManagerCategories,
    },
    {
      path: "/manager/subcategories",
      name: "Manager SubCategories",
      component: ManagerSubCategories,
    },
    {
      path: "/manager/users",
      name: "Manager Users",
      component: ManagerUsers,
    },
    {
      path: "/manager/activate-role",
      name: "Manager Activation",
      component: ManagerActivation,
    },
    //
    //
    //
    //
    //
    //
    // admins
    {
      path: "/admin/categories",
      name: "AdminCategories",
      component: AdminCategories,
    },
    {
      path: "/subcategories",
      name: "Subcategories",
      component: SubCategories,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/adverts",
      name: "Adverts",
      component: Adverts,
    },
    {
      path: "/posts",
      name: "Posts",
      component: Posts,
    },
    {
      path: "/:catchall(.*)*",
      name: "404",
      component: ErrorComponent,
    },
  ],
});

export default router;
