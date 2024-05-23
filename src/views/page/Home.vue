<script setup lang="ts">
// import { ref, reactive } from "vue";
// import useVuelidate from "@vuelidate/core";
// import { required, helpers } from "@vuelidate/validators";
// import agent from "@/app/agent.js";
// import { message as antMessage } from "ant-design-vue";
import { useRouter } from "vue-router";

const router = useRouter();

router.push("/login");
</script>
<template>
  <main style="height: 100vh">
    <section class="content-main">
      <div class="card mx-auto card-login">
        <div class="card-body">
          <h4 class="card-title mb-4">Sign in to Ibommarket</h4>
          <div class="card-body">
            <RouterLink to="/manager-login">
              <article class="itemlist">
                <div class="row align-items-center">
                  <div class="col-lg-4 col-sm-4 col-8 flex-grow-1 col-name">
                    <h6 class="mb-0">Sign in as Manager</h6>
                  </div>
                </div>
              </article>
            </RouterLink>
            <RouterLink to="/admin-login">
              <article class="itemlist">
                <div class="row align-items-center">
                  <h6 class="mb-0">Sign in as Admin</h6>
                </div>
              </article>
            </RouterLink>
            <RouterLink to="/marketer-login">
              <article class="itemlist">
                <div class="row align-items-center">
                  <h6 class="mb-0">Sign in as Marketer</h6>
                </div>
              </article>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<style scoped>
main {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.main-wrap {
  margin-left: 0;
}
.content-main {
  width: 100%;
}
</style>
