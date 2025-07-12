<script setup>
import { ref } from "vue";
import agent from "@/app/agent.js";
import { useQuery } from "@tanstack/vue-query";
import { message as antMessage } from "ant-design-vue";
import * as DummyJson from "@/store/dummy.json";
import { Store } from "@/store/AdminStore.js";
import AsideAdmin from "../../generic/AsideAdmin.vue";
import Header from "../../generic/Header.vue";
import { useRouter } from "vue-router";

const AdminStore = Store();
const router = useRouter();

if (!localStorage.getItem("ibmManagementToken")) {
  router.push("/login");
}
const fetchData = async () => {
  return DummyJson.Posts;
  try {
    const res = await agent.Properties.get();
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
    return [];
  }
};
const pageNumber = ref(1);
const { isLoading, data, error, isError } = useQuery({
  queryKey: ["Posts", pageNumber.value],
  queryFn: () => fetchData(),
  keepPreviousData: true,
});
function formartPrice(price) {
  return "₦  " + price.toLocaleString();
}
const detailModalOpened = ref(false);
const showModal = () => {
  open.value = true;
};
const handleOk = (e) => {
  console.log(e);
  open.value = false;
};
const detailsIndex = ref(null);

function openDetailsModal(argument, index) {
  detailsIndex.value = index;
  detailModalOpened.value = true;
  console.log(argument);
}
const userDateFilterValue = ref(null);

function handleDateChange() {
  console.log(userDateFilterValue.value);
}
function separatePascalCase(inputStr) {
  const words = inputStr.match(/[A-Z][a-z]*/g);
  return words.join(" ");
}
const openedDetailsMenuIndex = ref(null);
function handleMenuClicked(index) {
  console.log(index);
  if (index !== openedDetailsMenuIndex.value) {
    openedDetailsMenuIndex.value = index;
  } else {
    openedDetailsMenuIndex.value = null;
  }
}
const rejectModalVisible = ref(false);
const rejectReasons = ref([]);
const rejectReasonsInput = ref("");
const addRejectReason = function () {
  if (rejectReasonsInput.value) {
    rejectReasons.value.push(rejectReasonsInput.value);
    rejectReasonsInput.value = "";
  }
};
const removeRejectReason = function (index) {
  console.log(index);
  const newRejects = [];
  rejectReasons.value.forEach((value, place) => {
    console.log(value);
    if (place != index) {
      return newRejects.push(value);
    }
  });
  rejectReasons.value = newRejects;
};
const sendRejectRequest = function () {
  rejectModalVisible.value = false;
  antMessage.success("Post rejected");
};
const openRejectModal = function () {
  rejectModalVisible.value = true;
};
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
          <h2 class="content-title card-title">
            Welcome {{ AdminStore.Admin?.Username }}
          </h2>
          <p>Manage Ibommarket here</p>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-3">
          <div class="card card-body mb-4">
            <article class="icontext">
              <div class="text">
                <RouterLink class="main" to="/admin/managers">
                  <span> Ibommarket Managers </span>
                </RouterLink>
              </div>
            </article>
          </div>
        </div>
        <!-- //// -->
        <div class="col-lg-3">
          <div class="card card-body mb-4">
            <article class="icontext">
              <div class="text">
                <RouterLink class="main" to="/admin/adverts">
                  <span> Banner Adverts </span>
                </RouterLink>
              </div>
            </article>
          </div>
        </div>
        <!-- //// -->
        <div class="col-lg-3">
          <div class="card card-body mb-4">
            <article class="icontext">
              <div class="text">
                <RouterLink class="main" to="/admin/posts">
                  <span>Ibommarket Posts </span>
                </RouterLink>
              </div>
            </article>
          </div>
        </div>
        <!-- //// -->
        <div class="col-lg-3">
          <div class="card card-body mb-4">
            <article class="icontext">
              <div class="text">
                <RouterLink class="main" to="/admin/uiconfig">
                  <span>Ibommarket UI Config </span>
                </RouterLink>
              </div>
            </article>
          </div>
        </div>
        <!-- //// -->
        <div class="col-lg-3">
          <div class="card card-body mb-4">
            <article class="icontext">
              <div class="text">
                <RouterLink class="main" to="/admin/urgent-requests">
                  <span> Urgent Requests </span>
                </RouterLink>
              </div>
            </article>
          </div>
        </div>
      </div>
      <!-- 
       -->
    </section>
  </main>
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
</style>
