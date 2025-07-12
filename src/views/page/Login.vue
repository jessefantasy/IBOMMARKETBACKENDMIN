<script setup lang="ts">
import { ref, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";
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
localStorage.removeItem("ibmManagementToken");

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
    required: helpers.withMessage("email field cannot be empty", required),
    email,
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
const successMessage = ref("");

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
      successMessage.value = "Login successful!";
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
  <div class="login-bg">
    <main class="login-main">
      <div class="login-card">
        <div class="login-logo">
          <img
            src="https://res.cloudinary.com/djp2xd5rl/image/upload/v1699784268/da-net7/hefi0ey2dxsir0kvzuba.png"
            alt="Ibommarket Logo"
            class="logo-img"
          />
        </div>
        <h2 class="login-title">Admin Login</h2>
        <form @submit.prevent="submitForm" class="login-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-icon">
              <span class="icon">📧</span>
              <input
                id="email"
                v-model="data.username"
                :class="{ error: v$.username.$errors[0] }"
                class="form-control"
                placeholder="Email"
                type="text"
                autocomplete="username"
              />
            </div>
            <span
              v-for="error in v$.username.$errors"
              :key="error.$message.toString()"
              class="error"
            >
              {{ error.$message }}
            </span>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-icon">
              <span class="icon">🔒</span>
              <input
                id="password"
                v-model="data.password"
                :class="{ error: v$.password.$errors[0] }"
                class="form-control"
                placeholder="Password"
                type="password"
                autocomplete="current-password"
              />
            </div>
            <span
              v-for="error in v$.password.$errors"
              :key="error.$message.toString()"
              class="error"
            >
              {{ error.$message }}
            </span>
          </div>
          <div class="form-group">
            <label for="role">Select Role</label>
            <select
              id="role"
              class="form-select"
              :class="{ error: v$.role.$errors[0] }"
              v-model="data.role"
            >
              <option v-if="!data.role" value="">Select Role</option>
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
          <div class="form-row">
            <label class="remember-label">
              <input type="checkbox" class="form-check-input" checked />
              <span>Remember Me</span>
            </label>
            <a href="#" class="forgot-link">Forgot Password?</a>
          </div>
          <div
            v-if="
              v$.username.$errors[0] ||
              v$.password.$errors[0] ||
              v$.role.$errors[0]
            "
            class="form-message error-message"
          >
            Please fix the errors above.
          </div>
          <div class="form-message success-message" v-if="successMessage">
            {{ successMessage }}
          </div>
          <button :disabled="makingRequest" class="login-btn" type="submit">
            <span v-if="makingRequest" class="spinner"></span>
            <span v-else>Login</span>
          </button>
        </form>
        <footer class="login-footer">
          <p class="footer-text">
            © {{ new Date().getFullYear() }} Ibommarket. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  </div>
</template>

<style scoped>
.login-bg {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-main {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 2.5rem 2rem 1.5rem 2rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}
.logo-img {
  height: 40px;
  object-fit: cover;
}
.login-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: center;
}
.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.input-icon {
  display: flex;
  align-items: center;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
}
.input-icon .icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
  color: #64748b;
}
.form-control,
.form-select {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 1rem;
  padding: 0.4rem 0;
  color: #1e293b;
}
.form-control.error,
.form-select.error {
  color: #dc2626;
}
.error {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 0.1rem;
}
.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}
.remember-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.97rem;
  color: #64748b;
}
.forgot-link {
  color: #f7941d;
  font-size: 0.97rem;
  text-decoration: none;
  transition: text-decoration 0.2s, color 0.2s;
}
.forgot-link:hover {
  text-decoration: underline;
  color: #006838;
}
.login-btn {
  width: 100%;
  background: #006838;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 0;
  margin-top: 0.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 104, 56, 0.08);
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-btn:disabled {
  background: #b6e2c7;
  cursor: not-allowed;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #006838;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.form-message {
  width: 100%;
  text-align: center;
  font-size: 0.97rem;
  margin-bottom: 0.2rem;
}
.error-message {
  color: #dc2626;
}
.success-message {
  color: #16a34a;
}
.login-footer {
  margin-top: 1.5rem;
  width: 100%;
  text-align: center;
}
.footer-text {
  color: #94a3b8;
  font-size: 0.92rem;
}
@media (max-width: 600px) {
  .login-card {
    padding: 1.5rem;
    max-width: 80vw;
  }
  .login-title {
    font-size: 1.2rem;
  }
}
.form-select {
  border: 2px solid #006838;
  background: #f0f7ff;
  outline: none;
  width: 100%;
  font-size: 1rem;
  padding: 0.6rem 0.8rem;
  color: #1e293b;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 104, 56, 0.07);
  transition: border 0.2s, box-shadow 0.2s;
}
.form-select:focus {
  border: 2px solid #f7941d;
  box-shadow: 0 0 0 2px #f7941d44;
}
</style>
