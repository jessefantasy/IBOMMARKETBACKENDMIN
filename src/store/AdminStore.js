import { defineStore } from "pinia" 
import agent from "@/app/agent.js"
import { ref } from "vue"

export const Store = defineStore ("Admin", ()=> {

		const Admin = ref(null)   
   		const token =   localStorage.getItem("ibmManagementToken") ;
		const AdminProfile = ref(null)

		if (token) {
			Admin.value	 = true
			async function fetchAdminBusiness(argument) {
				try {
					 const res = await agent.Account.currentUser()
	     			 Admin.value = res
				} catch(error) {
					Admin.value= null
					localStorage.removeItem("ibmManagementToken")
				}
			
	     	}

	     	fetchAdminBusiness()
		}  
	
		function updateAdmin (newAdmin) {
			Admin.value = newAdmin 
		}
	return {
		Admin,
		updateAdmin
	}

})