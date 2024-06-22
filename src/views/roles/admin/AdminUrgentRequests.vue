<script setup>
import { ref, reactive } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { message as antMessage } from "ant-design-vue";
import AsideAdmin from "../../generic/AsideAdmin.vue";
import Header from "../../generic/Header.vue";
import NoProfileImage from "../../../assets/imgs/people/no-profile.ico";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { required, helpers, email } from "@vuelidate/validators";
import { Store } from "../../../store/AdminStore.js";
import { UrgentRequests } from "../../../app/agent.js";

const AdminStore = Store();

const router = useRouter();
if (!localStorage.getItem("ibmManagementToken")) {
  router.push("/login");
}
const holdPrevUrgentRequests = ref([]);
const fetchData = async () => {
  try {
    const res = await UrgentRequests.get();
    console.log(res);
    holdPrevUrgentRequests.value = res;
    return res;
  } catch (err) {
    console.log(err);
    return [];
  }
};
const requestRejectReason = ref("");

const formData = reactive({
  title: "",
  description: "",
});
const rules = {
  title: { required: helpers.withMessage("Add the task title", required) },
  description: {
    required: helpers.withMessage("Add a task description ", required),
  },
};

const v$ = useVuelidate(rules, formData);

const userDateFilterValue = ref(null);

function handleDateChange() {
  console.log(userDateFilterValue.value);
}

const activeManagerId = ref(null);
const openedDetailsMenuIndex = ref(null);
const openDeleteModal = ref(false);
function handleMenuClicked(index, id) {
  activeManagerId.value = id;
  console.log(index);
  if (index !== openedDetailsMenuIndex.value) {
    openedDetailsMenuIndex.value = index;
  } else {
    openedDetailsMenuIndex.value = null;
  }
}
const addModalVisible = ref(false);

const makingNetworkRequest = ref(false);
const pageNumber = ref(1);

const { isLoading, data, error, isError } = useQuery({
  queryKey: ["UrgentRequests", makingNetworkRequest],
  queryFn: () => fetchData(),
  keepPreviousData: true,
});

// delete manager
const sendingDeleteRequest = ref(false);
const sendDeleteRequest = async () => {
  if (!requestRejectReason.value)
    return antMessage.error("Please add a reason for rejecting request");
  if (requestRejectReason.value.length < 10)
    return antMessage.error("Please make reason for rejection more detailed");
  sendingDeleteRequest.value = true;

  try {
    await UrgentRequests.delete(data.value[openedDetailsMenuIndex.value]._id, {
      reason: requestRejectReason.value,
    });
    antMessage.success("Request deleted");
    openDeleteModal.value = false;
  } catch (error) {
    console.log(error);
    antMessage.error("Manager not deleted");
  } finally {
    openDeleteModal.value = false;
    setTimeout(() => {
      sendingDeleteRequest.value = false;
      makingNetworkRequest.value = !makingNetworkRequest.value;
      activeManagerId.value = null;
      openedDetailsMenuIndex.value = null;
    }, 100);
  }
};

const pausingManager = ref(false);
const sendActivateRequest = async (id) => {
  try {
    await UrgentRequests.activate(id);
    antMessage.success("Request  activated");
    makingNetworkRequest.value = !makingNetworkRequest.value;
  } catch (error) {
    console.log(error);
    antMessage.error("Manager pause request failed");
  } finally {
    openedDetailsMenuIndex.value = null;
  }
};

const detailModalOpened = ref(false);
const detailsIndex = ref(false);
function openDetailsModal(argument, index) {
  detailsIndex.value = index;
  detailModalOpened.value = true;
  console.log(argument);
}

function linkify(text) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  return (
    "Description : " +
    text.replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
  );
}

function formartRequestType(type) {
  if (type == 0) return "Urgent Buy";
  if (type == 1) return "Urgent Sell";
  if (type == 2) return "Employee";
  if (type == 3) return "Service";
  if (type == 4) return "Employer";
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
          <h2 class="content-title card-title">
            Ibommarket Manager Urgent Requests
          </h2>
          <p>Manage ibommarket urgent requests here.</p>
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
              <select class="form-select" v-model="statusFilterState">
                <option value="all" selected>All Status</option>
                <option value="true">Completed</option>
                <option value="false">Not completed</option>
              </select>
            </div>
          </div>
        </header>
        <!-- card-header end// -->
        <div class="card-body">
          <article
            v-for="(card, index) in data || holdPrevUrgentRequests"
            class="itemlist"
          >
            <div class="row align-items-center">
              <div class="col-lg-4 col-sm-4 col-8 flex-grow-1 col-name">
                <div class="itemside">
                  <div class="left"></div>
                  <div class="info">
                    <h6 class="mb-0">{{ card?.title }}</h6>
                  </div>
                </div>
              </div>
              <div class="col-lg-2 col-sm-2 col-4 col-price"></div>
              <div class="col-lg-2 col-sm-2 col-4 col-status">
                <!-- badge badge-pill badge-soft-warning -->

                <span
                  v-if="card.status == 'active'"
                  class="badge badge-pill badge-soft-success"
                >
                  {{ card.status }}</span
                >
                <span
                  v-else-if="card.status == 'rejected'"
                  class="badge badge-pill badge-soft-danger"
                  >{{ card.status }}</span
                >

                <span
                  v-if="card.status == 'pending'"
                  class="badge badge-pill badge-soft-warning"
                >
                  {{ card.status }}</span
                >
              </div>
              <div class="col-lg-2 col-sm-3 col-4 col-date">
                <span>
                  {{ new Date(card?.createdAt).toLocaleString() || "000" }}
                </span>
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
                      @click="sendActivateRequest(card._id)"
                      style="cursor: pointer"
                      class="dropdown-item"
                    >
                      Accept
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
    title="Add advert"
    centered
    style="padding: 20px 10px"
  >
    <form @submit.prevent="postAddManagerForm" ref="post_Form">
      <div class="mb-4">
        <label for="title" class="form-label">Title</label>
        <input
          :class="{ error: v$.title.$errors[0] }"
          name="title"
          v-model="formData.title"
          class="form-control"
        />
        <span v-for="error in v$.title.$errors" :key="error" class="error">
          {{ error.$message }}
        </span>
      </div>

      <div class="mb-4">
        <label for="description" class="form-label">Description</label>

        <textarea
          :class="{ error: v$.description.$errors[0] }"
          name="description"
          v-model="formData.description"
          class="form-control"
          style="resize: none"
        >
        </textarea>
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
        :loading="makingNetworkRequest"
        size="large"
        @click="postAddManagerForm"
      >
        Add Task
      </a-button>
    </form>
  </a-modal>
  <a-modal
    :footer="null"
    v-model:open="openDeleteModal"
    @afterClose="openDeleteModal = false"
    title="Delete urgent request"
    centered
    style="padding: 20px 10px"
  >
    <h5>Do you want to delete this request?</h5>
    <h5>Title : {{ data[openedDetailsMenuIndex]?.title }}</h5>
    <h5 style="margin-bottom: 20px">
      Description : {{ data[openedDetailsMenuIndex]?.shortDescription }}
    </h5>

    <a-textarea
      :resize="false"
      height="300px"
      placeholder="Enter reason for rejecting request"
      size="large"
      style="margin-bottom: 20px"
      v-model:value="requestRejectReason"
    />
    <a-button
      type="primary"
      class="btn btn-md rounded font-sm hover-up"
      :loading="sendingDeleteRequest"
      size="large"
      @click="sendDeleteRequest"
    >
      Yes
    </a-button>
    <a-button
      type=""
      class="btn btn-md rounded font-sm hover-up"
      :loading="makingNetworkRequest"
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
    title="Urgent requestt details"
  >
    <section class="content-main">
      <div class="content-header">
        <div>
          <h2 class="content-title card-title">
            Title : {{ data[detailsIndex].title }}
          </h2>
          <h3></h3>
          <h5
            class="content-title card-title"
            style="white-space: break-spaces"
            v-html="linkify(data[detailsIndex].shortDescription)"
          ></h5>
          <h3></h3>
          <h3></h3>
          <h5>
            {{ formartRequestType(data[detailsIndex].urgentRequestType) }}
          </h5>
          <h5>{{ data[detailsIndex].email }}</h5>
          <h5>{{ data[detailsIndex].phoneNumber }}</h5>
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
