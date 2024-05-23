<script setup>
import "@/assets/css/main.css";  
import Footer from "@/views/generic/Footer.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        colorPrimary: '#3BB77E',
      },
    }"
  >
    <div>
      <RouterView />
      <Footer v-if="$route.path !== '/login' && $route.path !== '/'" />
    </div>
  </a-config-provider>
</template>

<style scoped></style>
