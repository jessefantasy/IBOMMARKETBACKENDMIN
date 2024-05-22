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
            active: $route.path == '/admin/managers',
          }"
        >
          <RouterLink class="menu-link" to="/admin/managers">
            <i class="icon material-icons md-home"></i>
            <span class="text">Managers</span>
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
