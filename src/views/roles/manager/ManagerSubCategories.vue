<script setup>
import { useQuery } from "@tanstack/vue-query";
import agent from "@/app/agent.js";
import { useRouter } from "vue-router";
import { Store } from "@/store/AdminStore.js";
import { message as antMessage } from "ant-design-vue";
import { ref, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import AsideManager from "../../generic/AsideManager.vue";
import Header from "../../generic/Header.vue";

const AdminStore = Store();
const router = useRouter();

const formData = reactive({
  file: "",
  name: "",
  categoryId: "",
});
const rules = {
  file: { required: helpers.withMessage("Please select an image", required) },
  name: {
    required: helpers.withMessage(
      "Category name field cannot be empty",
      required
    ),
  },
  categoryId: {
    required: helpers.withMessage(
      "Category Id field cannot be empty",
      required
    ),
  },
};

let v$ = useVuelidate(rules, formData);
const makingRequest = ref(false);

if (!localStorage.ibmToken) {
  // antMessage.info("Please login to continue")
  setTimeout(function () {
    // router.push("/login")
  }, 100);
}
const fetchData = async () => {
  const res = await agent.SubCategories.get();
  console.log(res);
  return res;
};

const { isLoading, data, error, isError } = useQuery({
  queryKey: ["SubCategories"],
  queryFn: () => fetchData(),
  keepPreviousData: true,
});
const addModalVisible = ref(false);
const post_Form = ref(null);

async function postForm() {
  const result = await v$.value.$validate();
  if (!result) {
    return;
  } else {
    makingRequest.value = true;

    const formData = new FormData(post_Form.value);
    try {
      const res = await agent.SubCategories.post(formData);
      fetchData();
      data.value.push(res);
      addModalVisible.value = false;
      antMessage.success("subcategory added");
      // categories.value.push(res)
      formData.name = "";
      formData.categoryId = "";
      post_Form.value.reset();
      v$ = useVuelidate(rules, formData);
      makingRequest.value = false;
    } catch (err) {
      console.log(err);
      makingRequest.value = false;
      antMessage.error("Request failed");
    }
  }
}

const deleteModal = ref(false);
const deleteCategoryId = ref(null);

async function deleteFunction() {
  console.log(deleteCategoryId);
  try {
    const res = await agent.SubCategories.delete(deleteCategoryId.value);
    fetchData();
    deleteModal.value = false;
    antMessage.success("subcategory deleted");
  } catch (error) {
    antMessage.error("subcategory added");
  }
}
</script>

<template>
  <AsideManager />
  <main class="main-wrap">
    <Header
      v-if="
        $route.path !== '/login' &&
        $route.path !== '/register' &&
        $route.path !== '/'
      "
    />

    <section class="content-main">
      <div class="content-header">
        <div>
          <h2 class="content-title card-title">Ibommarket Sub Categories</h2>
          <p>Manage ibommarket sub categories here.</p>
        </div>
        <div>
          <div
            @click="addModalVisible = true"
            class="btn btn-primary btn-sm rounded"
          >
            Create new
          </div>
        </div>
      </div>
      <div class="card mb-4">
        <header class="card-header">
          <div class="row gx-3">
            <div class="col-lg-4 col-md-6 me-auto">
              <input type="text" placeholder="Search..." class="form-control" />
            </div>
            <div class="col-lg-2 col-6 col-md-3">
              <select class="form-select">
                <option>All category</option>
                <option>Electronics</option>
                <option>Clothings</option>
                <option>Something else</option>
              </select>
            </div>
            <div class="col-lg-2 col-6 col-md-3">
              <select class="form-select">
                <option>Latest added</option>
                <option>Cheap first</option>
                <option>Most viewed</option>
              </select>
            </div>
          </div>
        </header>
        <!-- card-header end// -->
        <div class="card-body">
          <div
            class="row gx-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 row-cols-xxl-5"
          >
            <template v-if="!isError && !isLoading">
              <!-- <template  v-for="category in data"> -->

              <div
                v-for="subcategory in data"
                :key="subcategory.Id"
                class="col"
              >
                <div class="card card-product-grid">
                  <div class="id">id : {{ subcategory.Id }}</div>
                  <div class="img-wrap">
                    <img :src="subcategory.ImageUrl" alt="Product" />
                  </div>
                  <div class="info-wrap">
                    <div class="title text-truncate">
                      {{ subcategory.Name }}
                    </div>
                    <div class="price mb-2">
                      Catrgory Id {{ subcategory.CategoryId }}
                    </div>

                    <div class="btn btn-sm font-sm rounded btn-brand">
                      <i class="material-icons md-edit"></i> Edit
                    </div>
                  </div>
                </div>
                <!-- card-product  end// -->
              </div>
              <!-- </template> -->
            </template>
          </div>
          <!-- row.// -->
        </div>
        <!-- card-body end// -->
      </div>
      <!-- card end// -->
      <div class="pagination-area mt-30 mb-50">
        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-start">
            <li class="page-item active">
              <a class="page-link" href="#">01</a>
            </li>
            <li class="page-item"><a class="page-link" href="#">02</a></li>
            <li class="page-item"><a class="page-link" href="#">03</a></li>
            <li class="page-item"><a class="page-link dot" href="#">...</a></li>
            <li class="page-item"><a class="page-link" href="#">16</a></li>
            <li class="page-item">
              <a class="page-link" href="#"
                ><i class="material-icons md-chevron_right"></i
              ></a>
            </li>
          </ul>
        </nav>
      </div>
      <a-modal
        :footer="null"
        v-model:open="addModalVisible"
        @afterClose="addModalVisible = false"
        title="Add category"
        centered
        style="padding: 20px 10px"
      >
        <form @submit.prevent="postForm" ref="post_Form">
          <div class="input-upload">
            <img src="@/assets/imgs/theme/upload.svg" alt="" />
            <input
              :class="{ error: v$.file.$errors[0] }"
              @change="
                (event) => {
                  formData.file = event.target.files[0];
                }
              "
              accept="image/*"
              class="form-control"
              type="file"
              name="file"
            />
            <span v-for="error in v$.file.$errors" :key="error" class="error">
              {{ error.$message }}
            </span>
          </div>
          <div class="mb-4">
            <label for="name" class="form-label">Catrgory name</label>
            <input
              v-model="formData.name"
              :class="{ error: v$.name.$errors[0] }"
              type="text"
              name="name"
              placeholder="Catrgory name"
              class="form-control"
            />
            <span v-for="error in v$.name.$errors" :key="error" class="error">
              {{ error.$message }}
            </span>
          </div>
          <div class="mb-4">
            <label for="categoryId" class="form-label">Catrgory Id</label>
            <input
              v-model="formData.categoryId"
              :class="{ error: v$.categoryId.$errors[0] }"
              type="text"
              name="categoryId"
              placeholder="Catrgory Id"
              class="form-control"
            />
            <span
              v-for="error in v$.categoryId.$errors"
              :key="error"
              class="error"
            >
              {{ error.$message }}
            </span>
          </div>
          <a-button
            @click="postForm"
            :loading="makingRequest"
            class="btn btn-md rounded font-sm hover-up"
            >Publish</a-button
          >
        </form>
      </a-modal>
    </section>
  </main>
</template>
<style scoped>
.card-product-grid {
  position: relative;
}
div.id {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 15px;
  font-weight: bold;
  z-index: 3;
  padding: 3px 15px;
  background: #3bb77e;
  border-top-left-radius: 4px;
  color: #fff;
}
</style>
