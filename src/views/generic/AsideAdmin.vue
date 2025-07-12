<script setup>
import { reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";
const router = useRouter();
const dropdownStates = reactive({
  categories: false,
});
const logoutFunction = () => {
  localStorage.removeItem("ibmManagementToken");

  setTimeout(function () {
    router.push("/login");
  }, 1000);
};
</script>
<template>
  <aside class="navbar-aside" id="offcanvas_aside">
    <div class="aside-top">
      <RouterLink to="/manager" class="brand-wrap">
        <img
          src="https://res.cloudinary.com/djp2xd5rl/image/upload/v1699784268/da-net7/hefi0ey2dxsir0kvzuba.png"
          class="logo"
          alt="Nest Dashboard"
        />
      </RouterLink>
      <div>
        <button class="btn btn-icon btn-aside-minimize">
          <i class="text-muted material-icons md-menu_open"></i>
        </button>
      </div>
    </div>
    <nav>
      <ul class="menu-aside">
        <li
          class="menu-item"
          :class="{
            active: $route.path == '/admin/',
          }"
        >
          <RouterLink class="menu-link" to="/admin">
            <i class="icon material-icons md-home"></i>
            <span class="text">Dashboard</span>
          </RouterLink>
        </li>
        <li
          class="menu-item"
          :class="{
            active: $route.path == '/admin/adverts',
          }"
        >
          <RouterLink class="menu-link" to="/admin/adverts">
            <i class="icon material-icons md-home"></i>
            <span class="text">Adverts</span>
          </RouterLink>
        </li>
        <li
          class="menu-item"
          :class="{
            active: $route.path == '/admin/managers',
          }"
        >
          <RouterLink class="menu-link" to="/admin/managers">
            <i class="icon material-icons md-home"></i>
            <span class="text">Managers</span>
          </RouterLink>
        </li>
        <li
          class="menu-item"
          :class="{
            active: $route.path == '/admin/posts',
          }"
        >
          <RouterLink class="menu-link" to="/admin/posts">
            <i class="icon material-icons md-home"></i>
            <span class="text">Posts</span>
          </RouterLink>
        </li>
        <li
          class="menu-item"
          :class="{
            active: $route.path == '/admin/uiconfig',
          }"
        >
          <RouterLink class="menu-link" to="/admin/uiconfig">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              style="margin-right: 10px"
              fill="#adb5bd"
              viewBox="0 0 256 256"
            >
              <path
                d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H216V96H40ZM216,200H112V112H216v88Z"
              ></path>
            </svg>

            <span class="text">UI Config</span>
          </RouterLink>
        </li>
        <li
          class="menu-item"
          :class="{
            active: $route.path == '/admin/urgent-requests',
          }"
        >
          <RouterLink class="menu-link" to="/admin/urgent-requests">
            <i class="icon material-icons md-home"></i>
            <span class="text">Urgent Requests</span>
          </RouterLink>
        </li>
        <li
          class="menu-item"
          :class="{
            active: $route.path == '/admin/tasks',
          }"
        >
          <RouterLink class="menu-link" to="/admin/tasks">
            <i class="icon material-icons md-home"></i>
            <span class="text">Tasks</span>
          </RouterLink>
        </li>
      </ul>
      <hr />
      <ul class="menu-aside">
        <li class="menu-item has-submenu">
          <a class="menu-link" href="#">
            <i class="icon material-icons md-settings"></i>
            <span class="text">Settings</span>
          </a>
          <div class="submenu">
            <a href="#">Setting sample 1</a>
            <a href="#">Setting sample 2</a>
          </div>
        </li>
        <li class="menu-item">
          <div @click="logoutFunction" class="menu-link cursor">
            <i class="icon material-icons md-local_offer"></i>
            <span class="text"> Logout </span>
          </div>
        </li>
      </ul>
      <br />
      <br />
    </nav>
  </aside>
</template>

<style scoped>
.cursor {
  cursor: pointer;
}
</style>
