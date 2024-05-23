<script setup>
	import {useRouter} from "vue-router"
	import{ref} from 'vue'
	import agent from "@/app/agent.js";


	const router = useRouter()
	const {token} = router.currentRoute.value.query
	const tokenConfirmed = ref(false)
	const count = ref(0)
	const errorMessage = ref("")

	console.log(router.currentRoute.value)

	async function activateAccount ()  {
		try{ 
			await agent.Managers.activate( {token} )
			setInterval(() => {
				localStorage.removeItem("ibmManagementToken")
				count.value = count.value + 1
			} , 1000)
			setTimeout(function() { 
				router.push("/login")
			}, 5000);
		} catch(error) {
			errorMessage.value = "Invalid token"
		} 
	}
	activateAccount() 

</script>

<template>
	<div v-if="!errorMessage" style="text-align: center;">Activating account...</div>
	<div v-else style="text-align: center;"> {{errorMessage}} </div>
	<div v-if="tokenConfirmed" style="text-align: center;">Redirecting to login page {{count}} ...</div>
</template>