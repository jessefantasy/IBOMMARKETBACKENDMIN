<script setup>
import { useQuery } from "@tanstack/vue-query";
import agent from "@/app/agent.js";
import { useRouter } from "vue-router";
import { Store } from "@/store/AdminStore.js";
import { message as antMessage } from "ant-design-vue";
import { ref, reactive } from "vue";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import * as DummyJson from "@/store/dummy.json";
import AsideAdmin from "../../generic/AsideAdmin.vue";
import Header from "../../generic/Header.vue";

const AdminStore = Store();
const router = useRouter();

const formData = reactive({
  file: "",
  status: 2,
  advertViewPort: 3,
  name: "",
});
const rules = {
  file: { required: helpers.withMessage("Please select an image", required) },
  status: { required: helpers.withMessage("Select advert status", required) },
  name: { required: helpers.withMessage("Add a name for advert", required) },
  advertViewPort: {
    required: helpers.withMessage("Select advert Viewport", required),
  },
};

const v$ = useVuelidate(rules, formData);
const makingRequest = ref(false);

const fetchData = async () => {
  const res = await agent.Advert.get();
  return res;
};

const { isLoading, data, error, isError, refetch } = useQuery({
  queryKey: ["Adverts", makingRequest.value],
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
    // const uploadData = {}
    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("file", formData.file);
    try {
      const res = await agent.Advert.post(uploadData);
      fetchData();
      data.value.push(res);
      addModalVisible.value = false;
      antMessage.success("Advert added");
      v$.value.$reset();
      post_Form.value.reset();
      refetch();
    } catch (err) {
      console.log(err);
      makingRequest.value = false;
      antMessage.error("Request failed");
    } finally {
      makingRequest.value = false;
    }
  }
}

const deleteModal = ref(false);
const deleteAdvertId = ref(null);

async function deleteFunction() {
  console.log(deleteAdvertId);
  const res = await agent.Advert.delete(deleteAdvertId.value);
  refetch();
  deleteModal.value = false;
}
</script>

<template>
  <AsideAdmin />
  <main class="main-wrap">
    <div class="screen-overlay"></div>
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
          <h2 class="content-title card-title">Ibommarket banner Adverts</h2>
          <p>Manage ibommarket banners here.</p>
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
            class="row gx-3 row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-xl-2 row-cols-xxl-3"
          >
            <template v-if="!isError && !isLoading">
              <div v-for="advert in data" :key="advert._id" class="col">
                <div class="card card-product-grid">
                  <div class="id">id : {{ advert.Id }}</div>
                  <div class="img-wrap">
                    <img :src="advert.Url" :alt="advert._id" />
                  </div>
                  <div class="info-wrap">
                    <div class="title text-truncate">
                      Viewport : {{ advert.AdvertVeiewPort }}
                    </div>
                    <div class="title text-truncate">
                      Status : {{ advert.Status }}
                    </div>

                    <div class="btn btn-sm font-sm rounded btn-brand">
                      <i class="material-icons md-edit"></i> Edit
                    </div>
                    <div
                      @click="
                        () => {
                          deleteAdvertId = advert._id;
                          deleteModal = true;
                        }
                      "
                      class="btn btn-sm font-sm rounded badge-soft-danger"
                    >
                      <svg
                        color="#f46a6a"
                        height="20"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <!-- card-product  end// -->
              </div>
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
        title="Add advert..."
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
              name="files"
            />
            <span v-for="error in v$.file.$errors" :key="error" class="error">
              {{ error.$message }}
            </span>
          </div>

          <div class="mb-4">
            <label for="name" class="form-label">Name</label>
            <input
              :class="{ error: v$.name.$errors[0] }"
              name="status"
              v-model="formData.name"
              class="form-control"
            />
            <span v-for="error in v$.name.$errors" :key="error" class="error">
              {{ error.$message }}
            </span>
          </div>

          <div class="mb-4">
            <label for="name" class="form-label">Status</label>
            <select
              :class="{ error: v$.status.$errors[0] }"
              name="status"
              v-model="formData.status"
              class="form-select"
            >
              <option value="2">Active</option>
            </select>
            <span v-for="error in v$.status.$errors" :key="error" class="error">
              {{ error.$message }}
            </span>
          </div>
          <div class="mb-4">
            <label for="name" class="form-label">View port</label>
            <select
              :class="{ error: v$.advertViewPort.$errors[0] }"
              v-model="formData.advertViewPort"
              name="advertViewPort"
              class="form-select"
            >
              <option value="3">Both</option>
            </select>
            <span
              v-for="error in v$.advertViewPort.$errors"
              :key="error"
              class="error"
            >
              {{ error.$message }}
            </span>
          </div>
          <a-button
            type="submit"
            class="btn btn-md rounded font-sm hover-up"
            :loading="makingRequest"
            size="large"
            @click="postForm"
          >
            Publish
          </a-button>
        </form>
      </a-modal>
      <a-modal
        v-model:open="deleteModal"
        @afterClose="console.log('closed')"
        title="Delete Advert"
        centered
        style="padding: 20px 10px"
        @ok="deleteFunction"
      >
        Do you want to delete this advert?
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
