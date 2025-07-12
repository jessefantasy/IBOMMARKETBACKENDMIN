<script setup>
import { ref, reactive } from "vue";
import { UiComponentApiCalls } from "../../../app/agent";
import { useQuery } from "@tanstack/vue-query";
import { message as antMessage } from "ant-design-vue";
import * as DummyJson from "@/store/dummy.json";
import AsideAdmin from "../../generic/AsideAdmin.vue";
import Header from "../../generic/Header.vue";
import NoProfileImage from "../../../assets/imgs/people/no-profile.ico";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

const router = useRouter();
if (!localStorage.getItem("ibmManagementToken")) {
  router.push("/login");
}
const holdManagers = ref([]);
const fetchData = async () => {
  try {
    const res = await UiComponentApiCalls.getUiConfig();

    console.log(res);
    holdManagers.value = res;
    return res;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const addModalVisible = ref(false);
const formData = reactive({
  name: "",
  key: "",
  description: "",
});
const rules = {
  name: {
    required: helpers.withMessage("Add the UI's name", required),
  },
  key: {
    required: helpers.withMessage("Add the UI's key", required),
  },
  description: {
    required: helpers.withMessage("Add the UI's description", required),
  },
};

const v$ = useVuelidate(rules, formData);

const postUiConfigForm = async () => {
  const result = await v$.value.$validate();
  if (!result) {
    return antMessage.error("Input all required fields");
  }
  try {
    const res = await UiComponentApiCalls.addUiConfig(formData);
    addModalVisible.value = false;
    antMessage.success("UI config added");
  } catch (error) {
    antMessage.error("UI ocnfig not added");
  } finally {
    addingUIConfig.value = !addingUIConfig.value;
  }
};

const activeManagerId = ref(null);
const openedDetailsMenuIndex = ref(null);
const openDeleteModal = ref(false);
const detailModalOpened = ref(false);

const addingUIConfig = ref(false);

const { isLoading, data, error, isError } = useQuery({
  queryKey: ["UIConfigs", addingUIConfig],
  queryFn: () => fetchData(),
  keepPreviousData: true,
});

function handleMenuClicked(index, id) {
  activeManagerId.value = id;
  console.log(index);
  if (index !== openedDetailsMenuIndex.value) {
    openedDetailsMenuIndex.value = index;
  } else {
    openedDetailsMenuIndex.value = null;
  }
}

const detailsIndex = ref(null);
function openDetailsModal(argument, index) {
  detailsIndex.value = index;
  detailModalOpened.value = true;
  console.log(argument);
}
</script>

<template>
  <AsideAdmin />
  <main class="main-wrap">
    <div class="screen-overlay"></div>
    <Header />

    <section class="content-main">
      <div class="content-header">
        <div>
          <h2 class="content-title card-title">Ibommarket Managers</h2>
          <p>Manage ibommarket managers here.</p>
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
          <div class="row align-items-center">
            <!-- <div class="col col-check flex-grow-0">
                                <div class="form-check ms-2">
                                    <input class="form-check-input" type="checkbox" value="" />
                                </div>
                            </div> -->
            <div class="col-md-3 col-12 me-auto mb-md-0 mb-3">
              <form class="searchform">
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Search term"
                  />
                  <button
                    class="btn btn-light bg"
                    style="height: 41px"
                    type="button"
                  >
                    <i class="material-icons md-search"></i>
                  </button>
                </div>
              </form>
            </div>
            <!--   <div class="col-md-2 col-6">
              <input
                @change="handleDateChange"
                v-model="userDateFilterValue"
                type="date"
                value="02.05.2021"
                class="form-control"
              />
            </div> -->
            <div class="col-md-2 col-6">
              <select class="form-select">
                <option value="" selected>Status</option>
                <option value="0">Active</option>
                <option value="1">Pending</option>
                <option value="2">Rejected</option>
              </select>
            </div>
          </div>
        </header>
        <!-- card-header end// -->
        <div class="card-body">
          <article v-for="(card, index) in data" class="itemlist">
            <div class="row align-items-center">
              <div class="col-lg-4 col-sm-4 col-8 flex-grow-1 col-name">
                <div class="itemside">
                  <div class="left">
                    <img
                      style="width: 60px; height: 60px; object-fit: cover"
                      :src="NoProfileImage"
                      class="img-sm img-thumbnail"
                      alt="Item"
                    />
                  </div>
                  <div class="info">
                    <h6 class="mb-0">{{ card.name }}</h6>
                  </div>
                </div>
              </div>
              <div class="col-lg-2 col-sm-2 col-4 col-price">
                <span> {{}} </span>
              </div>
              <div class="col-lg-2 col-sm-2 col-4 col-status">
                <!-- badge badge-pill badge-soft-warning -->

                <span
                  v-if="card.status"
                  class="badge badge-pill badge-soft-success"
                  >{{ card.status }}</span
                >

                <span
                  v-if="card.status == 'rejected'"
                  class="badge badge-pill badge-soft-danger"
                  >{{ card.status }}</span
                >
              </div>
              <div class="col-lg-2 col-sm-3 col-4 col-date">
                <span> {{ new Date(card.createdAt).toLocaleString() }} </span>
              </div>
              <div class="col-lg-2 col-sm-3 col-4 col-date text-end">
                <div
                  class="btn btn-md rounded font-sm"
                  :class="{ show: openedDetailsMenuIndex == index }"
                  @click="openDetailsModal(true, index)"
                >
                  Detail
                </div>
                <div class="dropdown">
                  <div
                    @click="handleMenuClicked(index, card._id)"
                    data-bs-toggle="dropdown"
                    class="btn btn-light rounded btn-sm font-sm"
                  >
                    <i class="material-icons md-more_horiz"></i>
                  </div>
                  <div
                    :class="{ show: openedDetailsMenuIndex == index }"
                    class="dropdown-menu"
                  >
                    <div
                      @click="sendPauseResumeManagerRequest('active')"
                      v-if="card.status == 'paused'"
                      style="cursor: pointer"
                      class="dropdown-item"
                    >
                      Resume
                    </div>

                    <div
                      @click="sendPauseResumeManagerRequest('paused')"
                      v-if="card.status == 'active'"
                      style="cursor: pointer"
                      class="dropdown-item"
                    >
                      Pause
                    </div>
                    <div
                      style="cursor: pointer"
                      @click="openDeleteModal = true"
                      class="dropdown-item text-warn"
                    >
                      Delete
                    </div>
                  </div>
                </div>
                <!-- dropdown //end -->
              </div>
            </div>
            <!-- row .// -->
          </article>
          <!-- itemlist  .// -->
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
    </section>
  </main>

  <a-modal
    :footer="null"
    v-model:open="addModalVisible"
    @afterClose="addModalVisible = false"
    title="Add UI Config"
    centered
    style="padding: 20px 10px"
  >
    <form @submit.prevent="postUiConfigForm" ref="post_Form">
      <div class="mb-4">
        <label for="name" class="form-label">UI Name</label>
        <input
          :class="{ error: v$.name.$errors[0] }"
          name="name"
          v-model="formData.name"
          class="form-control"
        />
        <span v-for="error in v$.name.$errors" :key="error" class="error">
          {{ error.$message }}
        </span>
      </div>

      <div class="mb-4">
        <label for="key" class="form-label">UI key</label>
        <input
          :class="{ error: v$.key.$errors[0] }"
          name="key"
          v-model="formData.key"
          class="form-control"
        />
        <span v-for="error in v$.key.$errors" :key="error" class="error">
          {{ error.$message }}
        </span>
      </div>

      <div class="mb-4">
        <label for="description" class="form-label">Description</label>
        <textarea
          rows="3"
          :class="{ error: v$.description.$errors[0] }"
          name="description"
          v-model="formData.description"
          class="form-control"
          style="resize: none"
        />
        <span
          v-for="error in v$.description.$errors"
          :key="error"
          class="error"
        >
          {{ error.$message }}
        </span>
      </div>

      <a-button
        type="submit"
        class="btn btn-md rounded font-sm hover-up"
        :loading="addingUIConfig"
        size="large"
        @click="postUiConfigForm"
      >
        Add manager
      </a-button>
    </form>
  </a-modal>
  <a-modal
    :footer="null"
    v-model:open="openDeleteModal"
    @afterClose="openDeleteModal = false"
    title="Delete manager advert"
    centered
    style="padding: 20px 10px"
  >
    <h5>Do you want to remove this manager?</h5>
    <h5>full name : {{ data[openedDetailsMenuIndex]?.fullName }}</h5>
    <h5 style="margin-bottom: 20px">
      email : {{ data[openedDetailsMenuIndex]?.email }}
    </h5>
    <a-button
      type="primary"
      class="btn btn-md rounded font-sm hover-up"
      :loading="deletingManager"
      size="large"
      @click="sendDeleteManagerRequest"
    >
      Yes
    </a-button>
    <a-button
      type=""
      class="btn btn-md rounded font-sm hover-up"
      :loading="addingUIConfig"
      size="large"
      @click="
        openDeleteModal = false;
        openedDetailsMenuIndex = null;
      "
      style="margin-left: 10px; background: #00000040"
    >
      No
    </a-button>
  </a-modal>

  <a-modal
    :footer="null"
    v-model:open="detailModalOpened"
    width="1000px"
    title="UI Config Details"
  >
    <section class="content-main">
      <div class="content-header">
        <div>
          <h3 class="content-title card-title">
            Name : {{ data[detailsIndex].name }}
          </h3>

          <h3>Key : {{ data[detailsIndex].key }}</h3>
          <h3>Description : {{ data[detailsIndex].description }}</h3>
        </div>
      </div>
    </section>
  </a-modal>
</template>
<style lang="less">
.full-modal {
  .ant-modal {
    top: 30px;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: 90vh;
    overflow-y: scroll;
  }
  .ant-modal-body {
    flex: 1;
  }
}
.img-wrap img {
  display: none;
}
</style>
<style scoped>
.card-product-grid {
  max-height: 150px;
  min-height: 150px;
}
.grid-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px 0;
  margin: 25px 0;
}
.grid-details-item {
  display: flex;
  flex-direction: column;
}
.grid-details-item span.value {
  font-size: 15px;
  /*font-weight: bold;*/
}
.grid-details-item span.key {
  color: #6c8ea0;
  font-size: 12px;
  margin-bottom: 7px;
  text-transform: uppercase;
}
.dropdown-menu {
  left: -90px;
  min-width: 8rem;
}
.card-body {
  margin-bottom: 50px;
}
</style>
