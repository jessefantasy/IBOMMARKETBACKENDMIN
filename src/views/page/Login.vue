<script setup lang="ts">
import { ref, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import agent from "../../app/agent.js";
import { message as antMessage } from "ant-design-vue";
import { useRouter } from "vue-router";
import { Store } from "../../store/AdminStore.js";

const AdminStore = Store();
// import { ErrorCallback } from "typescript";

// const passwordRules = helpers.regex(
//   /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
// );
const router = useRouter();
  localStorage.removeItem("ibmManagementToken")


interface dataInterface {
  username: string;
  password: string;
  role: string;
}
const data: dataInterface = reactive({
  username: "",
  password: "",
  role: "",
});

const rules = {
  username: {
    required: helpers.withMessage("Username field cannot be empty", required),
  },
  password: {
    required: helpers.withMessage("password field cannot be empty", required),
    // passwordRules: helpers.withMessage(
    //   "Password must have at least 8 characters , one upper-case, lowercase, one number and a special character",
    //   passwordRules
    // ),
  },
  role: {
    required: helpers.withMessage("Select your role on Ibommarket", required),
  },
};
const v$ = useVuelidate(rules, data);
const makingRequest = ref(false);

async function submitForm() {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  } else {
    makingRequest.value = true;
    try {
      const res = await agent.Account.login(data);
      AdminStore.updateAdmin(res);
      localStorage.setItem("ibmManagementToken", res.Token);
      switch (res.Role) {
        case "admin":
          antMessage.success("Logged in as admin");
          router.push("/admin");

          break;
        case "manager":
          antMessage.success("Logged in as manager");
          router.push("/manager");

          break;
        case "marketer":
          antMessage.success("Logged in as marketer");
          router.push("/marketer");

          break;
      }

      makingRequest.value = false;
      // antMessage.success("Login successful!");
      console.log(res);
    } catch (err: any) {
      console.log(err);
      antMessage.error(err.response.data.message);
    } finally {
      makingRequest.value = false;
    }
  }
}
</script>
<template>
  <main>
    <header class="main-header style-2 navbar">
      <div class="col-brand">
        <RouterLink to="/" class="brand-wrap">
          <img
            src="https://res.cloudinary.com/djp2xd5rl/image/upload/v1699784268/da-net7/hefi0ey2dxsir0kvzuba.png"
            class="logo"
            alt="Nest Dashboard"
          />
        </RouterLink>
      </div>
      <div class="col-nav">
        <ul class="nav">
          <li class="nav-item">
            <div href="#" class="requestfullscreen nav-link btn-icon">
              <button class="btn btn-secondary w-100">Login</button>
            </div>
          </li>
        </ul>
      </div>
    </header>
    <section class="content-main mt-80 mb-80">
      <div class="card mx-auto card-login">
        <div class="card-body">
          <h4 class="card-title mb-4">Sign in</h4>
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <input
                v-model="data.username"
                :class="{ error: v$.username.$errors[0] }"
                class="form-control"
                placeholder="username"
                type="text"
              />
              <span
                v-for="error in v$.username.$errors"
                :key="error.$message.toString()"
                class="error"
              >
                {{ error.$message }}
              </span>
            </div>
            <!-- form-group// -->
            <div class="mb-3">
              <input
                v-model="data.password"
                :class="{ error: v$.password.$errors[0] }"
                class="form-control"
                placeholder="password"
                type="password"
              />
              <span
                v-for="error in v$.password.$errors"
                :key="error.$message.toString()"
                class="error"
              >
                {{ error.$message }}
              </span>
            </div>

            <!-- form-group// -->

            <div class="mb-4">
              <select
                class="form-select"
                :class="{ error: v$.role.$errors[0] }"
                v-model="data.role"
              >
                <option v-if="!data.role" value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="marketer">Marketer</option>
              </select>
              <span
                v-for="error in v$.role.$errors"
                :key="error.$message.toString()"
                class="error"
              >
                {{ error.$message }}
              </span>
            </div>
            <!-- form-group// -->
            <div class="mb-3">
              <a href="#" class="float-end font-sm text-muted"
                >Forgot password?</a
              >
              <label class="form-check">
                <input type="checkbox" class="form-check-input" checked />
                <span class="form-check-label">Remember</span>
              </label>
            </div>

            <!-- form-group form-check .// -->
            <div class="mb-4">
              <a-button
                :loading="makingRequest"
                @click="submitForm"
                size="large"
                type="submit"
                class="btn btn-primary w-100"
                >Login</a-button
              >
            </div>
            <!-- form-group// -->
          </form>
        </div>
      </div>
    </section>

    <footer class="main-footer text-center">
      <p class="font-xs">
        {{ new Date().getFullYear() }}

        &copy; Ibommarket.
      </p>
      <p class="font-xs mb-30">All rights reserved</p>
    </footer>
  </main>
</template>
