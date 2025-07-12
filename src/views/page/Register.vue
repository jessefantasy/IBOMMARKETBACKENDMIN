<script setup>
import { ref, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import agent from "@/app/agent.js";

const passwordRules = helpers.regex(
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/
);
const PhoneNumberRule = helpers.regex(/^(?:\+?234|0)[789]\d{9}$/);

const data = reactive({
  Username: "",
  Email: "",
  Password: "",
  PhoneNumber: "",
});
const rules = {
  Username: {
    required: helpers.withMessage("Username field cannot be empty", required),
  },
  Email: {
    required: helpers.withMessage("Email field cannot be empty", required),
    email: helpers.withMessage("Please enter a valid email address", email),
  },
  Password: {
    required: helpers.withMessage("Password field cannot be empty", required),
    passwordRules: helpers.withMessage(
      "Password must have at least 8 characters , one upper-case, lowercase, one number and a special character",
      passwordRules
    ),
  },
  PhoneNumber: {
    required: helpers.withMessage(
      "PhoneNumber field cannot be empty",
      required
    ),
    PhoneNumberRule: helpers.withMessage(
      "Please enter a valid Nigerian phone number ",
      PhoneNumberRule
    ),
  },
};

const v$ = useVuelidate(rules, data);

async function submitForm() {
  const result = await v$.value.$validate();

  if (!result) {
    return;
  } else {
  }
}
</script>

<template>
  <div class="register-bg">
    <main class="register-main">
      <div class="register-card">
        <div class="register-logo">
          <img
            src="https://res.cloudinary.com/djp2xd5rl/image/upload/v1699784268/da-net7/hefi0ey2dxsir0kvzuba.png"
            alt="Ibommarket Logo"
            class="logo-img"
          />
        </div>
        <h2 class="register-title">Create an Account</h2>
        <form @submit.prevent="submitForm" class="register-form">
          <div class="form-group">
            <label for="username">Username</label>
            <div class="input-icon">
              <span class="icon">👤</span>
              <input
                id="username"
                v-model="data.Username"
                :class="{ error: v$.Username.$errors[0] }"
                class="form-control"
                placeholder="Username"
                type="text"
                autocomplete="username"
              />
            </div>
            <span
              v-for="error in v$.Username.$errors"
              :key="error.$message.toString()"
              class="error"
              >{{ error.$message }}</span
            >
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <div class="input-icon">
              <span class="icon">📧</span>
              <input
                id="email"
                v-model="data.Email"
                :class="{ error: v$.Email.$errors[0] }"
                class="form-control"
                placeholder="Email"
                type="email"
                autocomplete="email"
              />
            </div>
            <span
              v-for="error in v$.Email.$errors"
              :key="error.$message.toString()"
              class="error"
              >{{ error.$message }}</span
            >
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <div class="input-icon">
              <span class="icon">🔒</span>
              <input
                id="password"
                v-model="data.Password"
                :class="{ error: v$.Password.$errors[0] }"
                class="form-control"
                placeholder="Password"
                type="password"
                autocomplete="new-password"
              />
            </div>
            <span
              v-for="error in v$.Password.$errors"
              :key="error.$message.toString()"
              class="error"
              >{{ error.$message }}</span
            >
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <div class="input-icon">
              <span class="icon">📱</span>
              <input
                id="phone"
                v-model="data.PhoneNumber"
                :class="{ error: v$.PhoneNumber.$errors[0] }"
                class="form-control"
                placeholder="Phone Number"
                type="tel"
                autocomplete="tel"
              />
            </div>
            <span
              v-for="error in v$.PhoneNumber.$errors"
              :key="error.$message.toString()"
              class="error"
              >{{ error.$message }}</span
            >
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
              v$.Username.$errors[0] ||
              v$.Email.$errors[0] ||
              v$.Password.$errors[0] ||
              v$.PhoneNumber.$errors[0]
            "
            class="form-message error-message"
          >
            Please fix the errors above.
          </div>
          <button class="register-btn" type="submit">Register</button>
        </form>
        <footer class="register-footer">
          <p class="footer-text">
            Already have an account?
            <RouterLink to="/login" class="footer-link">Sign in now</RouterLink>
          </p>
          <p class="footer-text muted">
            © {{ new Date().getFullYear() }} Ibommarket. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  </div>
</template>

<style scoped>
.register-bg {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #e0e7ff 0%, #f0f7ff 60%, #f7941d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-main {
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.register-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 104, 56, 0.12);
  padding: 2.5rem 2rem 1.5rem 2rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.register-logo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}
.logo-img {
  height: 40px;
  object-fit: cover;
}
.register-title {
  font-size: 1.7rem;
  font-weight: 700;
  color: #006838;
  margin-bottom: 1.5rem;
  text-align: center;
}
.register-form {
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
  border: 1.5px solid #e5e7eb;
}
.input-icon .icon {
  margin-right: 0.5rem;
  font-size: 1.1rem;
  color: #006838;
}
.form-control {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  font-size: 1rem;
  padding: 0.4rem 0;
  color: #1e293b;
}
.form-control.error {
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
.register-btn {
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
.register-btn:disabled {
  background: #b6e2c7;
  cursor: not-allowed;
}
.register-btn:hover:not(:disabled) {
  background: #f7941d;
  color: #fff;
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
.register-footer {
  margin-top: 1.5rem;
  width: 100%;
  text-align: center;
}
.footer-text {
  color: #94a3b8;
  font-size: 0.92rem;
}
.footer-link {
  color: #f7941d;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-link:hover {
  color: #006838;
  text-decoration: underline;
}
@media (max-width: 600px) {
  .register-card {
    padding: 1.5rem;
    max-width: 80vw;
  }
  .register-title {
    font-size: 1.2rem;
  }
}
</style>
