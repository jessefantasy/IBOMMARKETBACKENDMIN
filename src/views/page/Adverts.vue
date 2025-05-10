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

// if (!localStorage.ibmToken) {
//     // antMessage.info("Please login to continue")
//     setTimeout(function() {
//         router.push("/login")
//     }, 100);
// }
const AdminStore = Store();
const router = useRouter();

const formData = reactive({
  file: "",
  status: 2,
  advertViewPort: 3,
});
const rules = {
  file: { required: helpers.withMessage("Please select an image", required) },
  status: { required: helpers.withMessage("Select advert status", required) },
  advertViewPort: {
    required: helpers.withMessage("Select advert Viewport", required),
  },
};

const v$ = useVuelidate(rules, formData);
const makingRequest = ref(false);

const fetchData = async () => {
  return DummyJson.Adverts;
  const res = await agent.Advert.get();
  console.log(res);
  return res;
};

const { isLoading, data, error, isError } = useQuery({
  queryKey: ["Adverts"],
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
      const res = await agent.Advert.post(formData);
      fetchData();
      data.value.push(res);
      addModalVisible.value = false;
      antMessage.success("category added");
      // categories.value.push(res)
    } catch (err) {
      console.log(err);
      makingRequest.value = false;
      antMessage.error("Request failed");
    }
  }
}

const deleteModal = ref(false);
const deleteAdvertId = ref(null);

async function deleteFunction() {
  console.log(deleteAdvertId);
  const res = await agent.Advert.delete(deleteAdvertId.value);
  fetchData();
  deleteModal.value = false;
}
</script>

<template>
  <section class="content-main">
    <div class="content-header">
      <div>
        <h2 class="content-title card-title">Ibommarket Homepage Adverts</h2>
        <p>Manage ibommarket adverts here.</p>
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
            <div v-for="advert in data" :key="advert.Id" class="col">
              <div class="card card-product-grid">
                <div class="id">id : {{ advert.Id }}</div>
                <div class="img-wrap">
                  <img :src="advert.Url" :alt="advert.Id" />
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
                    class="btn btn-sm font-sm btn-light rounded"
                    @click="
                      deleteAdvertId = advert.Id;
                      deleteModal = true;
                    "
                  >
                    <i class="material-icons md-delete_forever"></i> Delete
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
          <li class="page-item active"><a class="page-link" href="#">01</a></li>
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
      title="Add advert"
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
      @afterClose="deleteModal = false"
      title="Delete category"
      centered
      @ok="deleteFunction"
      style="padding: 20px 10px"
    >
      <span>Are you sure you want to delete this category?</span>
    </a-modal>
  </section>
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
