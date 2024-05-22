<script setup>
	import { ref, reactive } from "vue"
	import useVuelidate from "@vuelidate/core"
	import { required,   email, helpers } from "@vuelidate/validators"
	import agent from "@/app/agent.js"

	const passwordRules = helpers.regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/)
	const PhoneNumberRule = helpers.regex(/^(?:\+?234|0)[789]\d{9}$/)


	const data = reactive({
		Username: "",
		Email: "",
		Password: "",
		PhoneNumber : ""
	})
	const rules = {
		Username: { required: helpers.withMessage('Username field cannot be empty', required) },
		Email: { required: helpers.withMessage('Email field cannot be empty', required), email : helpers.withMessage("Please enter a valid email address", email)  },
		Password: { required: helpers.withMessage('Password field cannot be empty', required ) , passwordRules : helpers.withMessage('Password must have at least 8 characters , one upper-case, lowercase, one number and a special character', passwordRules) } ,
		PhoneNumber: { required: helpers.withMessage('PhoneNumber field cannot be empty', required), PhoneNumberRule: helpers.withMessage("Please enter a valid Nigerian phone number ", PhoneNumberRule) },

	}
			
	const v$ = useVuelidate(rules, data)

	async function submitForm () {
		const result = await v$.value.$validate()

		if (!result) {
			return
		} else {

		}

	}
</script>

<template>
    <main>
	       <header class="main-header style-2 navbar">
                <div class="col-brand">
                    <a href="index.html" class="brand-wrap">
                        <img src="@/assets/imgs/theme/logo.svg" class="logo" alt="Nest Dashboard" />
                    </a>
                </div>
                <div class="col-nav">
                    <ul class="nav">
                        <li class="nav-item">
                            <RouterLink to="/login" class="requestfullscreen nav-link btn-icon">
                            	<button class="btn btn-primary w-100"> Login</button> 
                            </RouterLink>
                        </li>
                       <li class="nav-item">
                            <div  class="requestfullscreen nav-link btn-icon"> 
                            	<button class="btn btn-secondary w-100"> Register</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </header>
            <section class="content-main mt-80 mb-80">
                <div class="card mx-auto card-login">
                    <div class="card-body">
                        <h4 class="card-title mb-4">Create an Account</h4>
                         <form @submit.prevent="submitForm">
                            <div class="mb-3">
                                <input v-model="data.Username" :class = "{ error : v$.Username.$errors[0] }" class="form-control" placeholder="Username" type="text" />
                                <span  v-for="error in v$.Username.$errors" :key="error" class="error"> {{ error.$message }}  </span>
                            </div>
                            <!-- form-group// -->
							<div class="mb-3">
                                <input v-model="data.Email" :class = "{ error : v$.Email.$errors[0] }" class="form-control" placeholder="Email" type="email" />
                                <span  v-for="error in v$.Email.$errors" :key="error" class="error"> {{ error.$message }}  </span>
                            </div>
                            <!-- form-group// -->
                            <div class="mb-3">
                                <input v-model="data.Password" :class = "{ error : v$.Password.$errors[0] }" class="form-control" placeholder="Password" type="password" />
                                <span  v-for="error in v$.Password.$errors" :key="error" class="error"> {{ error.$message }}  </span>
                            </div>
                            <!-- form-group form-check .// -->
							<div class="mb-3">
                                <input v-model="data.PhoneNumber" :class = "{ error : v$.PhoneNumber.$errors[0] }" class="form-control" placeholder="PhoneNumber" type="tel" />
                                <span  v-for="error in v$.PhoneNumber.$errors" :key="error" class="error"> {{ error.$message }}  </span>
                            </div>
                            <!-- form-group// -->
                            <div class="mb-3">
                                <a href="#" class="float-end font-sm text-muted">Forgot password?</a>
                                <label class="form-check">
                                    <input  type="checkbox" class="form-check-input" checked="" />
                                    <span class="form-check-label">Remember</span>
                                </label>
                            </div>
                            <!-- form-group// -->
                            <div class="mb-4">
                                <a-button @click="submitForm" size="large" type="submit" class="btn btn-primary w-100">Register</a-button>
                            </div>
                            <!-- form-group// -->
                        </form>
                        <p class="text-center small text-muted mb-15">or sign up with</p>
                        <div class="d-flex gap-2 mb-4">
                            <a href="#" class="w-50 btn btn-light font-sm">
                                <svg aria-hidden="true" class="icon-svg" style="vertical-align: bottom; margin-top: -4px" width="20" height="20" viewBox="0 0 20 20">
                                    <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path>
                                    <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z" fill="#34A853"></path>
                                    <path d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z" fill="#FBBC05"></path>
                                    <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z" fill="#EA4335"></path>
                                </svg>
                                Google
                            </a>
                            <a href="#" class="w-50 btn btn-light font-sm">
                                <svg aria-hidden="true" class="icon-svg" width="20" height="20" viewBox="0 0 20 20">
                                    <path d="M3 1a2 2 0 00-2 2v12c0 1.1.9 2 2 2h12a2 2 0 002-2V3a2 2 0 00-2-2H3zm6.55 16v-6.2H7.46V8.4h2.09V6.61c0-2.07 1.26-3.2 3.1-3.2.88 0 1.64.07 1.87.1v2.16h-1.29c-1 0-1.19.48-1.19 1.18V8.4h2.39l-.31 2.42h-2.08V17h-2.5z" fill="#4167B2"></path>
                                </svg>
                                Facebook
                            </a>
                        </div>
                        <p class="text-center mb-2">Already have an account? <RouterLink to="/login">Sign in now</RouterLink></p>
                    </div>
                </div>
            </section> 
        </main>	

</template>