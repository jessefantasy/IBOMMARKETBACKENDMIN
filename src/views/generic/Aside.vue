<script setup>
import { reactive } from "vue";
import { RouterLink } from "vue-router";
const dropdownStates = reactive({
  categories: false,
});
</script>
<template>
  <aside class="navbar-aside" id="offcanvas_aside">
    <div class="aside-top">
      <RouterLink to="/" class="brand-wrap">
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
        <li class="menu-item">
          <RouterLink class="menu-link" to="/">
            <i class="icon material-icons md-home"></i>
            <span class="text">Dashboard</span>
          </RouterLink>
        </li>
        <li
          @click.prevent="
            dropdownStates.categories = !dropdownStates.categories
          "
          class="menu-item has-submenu"
          :class="{
            active:
              dropdownStates.categories ||
              $route.path == '/subcategories' ||
              $route.path == '/categories',
          }"
        >
          <div class="menu-link" href="#">
            <i class="icon material-icons md-person"></i>
            <span class="text">Categories</span>
          </div>
          <div class="submenu">
            <RouterLink
              :class="{ active: $route.path == '/categories' }"
              to="/categories"
              >Main Categories</RouterLink
            >
            <RouterLink
              :class="{ active: $route.path == '/subcategories' }"
              to="/subcategories"
              >Sub Categories</RouterLink
            >
          </div>
        </li>
        <li
          class="menu-item"
          :class="{
            active: dropdownStates.categories || $route.path == '/adverts',
          }"
        >
          <RouterLink class="menu-link" to="/adverts">
            <i class="icon material-icons md-comment"></i>
            <span class="text">Advert Banners</span>
          </RouterLink>
        </li>
        <li class="menu-item">
          <RouterLink class="menu-link" to="/posts">
            <i class="icon material-icons md-pie_chart"></i>
            <span class="text">Posts</span>
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
          <a class="menu-link" href="page-blank.html">
            <i class="icon material-icons md-local_offer"></i>
            <span class="text"> Starter page </span>
          </a>
        </li>
      </ul>
      <br />
      <br />
    </nav>
  </aside>
</template>
