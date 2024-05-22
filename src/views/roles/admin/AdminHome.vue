<script setup>
import { ref } from "vue";
import agent from "@/app/agent.js";
import { useQuery } from "@tanstack/vue-query";
import { message as antMessage } from "ant-design-vue";
import * as DummyJson from "@/store/dummy.json";
import {Store} from "@/store/AdminStore.js";
import AsideAdmin from "../../generic/AsideAdmin.vue";
import Header from "../../generic/Header.vue";
import {useRouter} from "vue-router"


const AdminStore = Store()
const router = useRouter()


if(!localStorage.getItem("ibmManagementToken")) { 
  router.push("/login")
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
          <h2 class="content-title card-title">Welcome {{ AdminStore.Admin?.Username }}</h2>
          <p>Manage Ibommarket here</p>
        </div>
        <div>
          <a href="#" class="btn btn-primary"
            ><i class="text-muted material-icons md-post_add"></i>Create
            report</a
          >
        </div>
        
      </div>
      <div class="row">
        <div class="col-lg-3">
          <div class="card card-body mb-4">
            <article class="icontext">
              <span class="icon icon-sm rounded-circle bg-primary-light"
                ><i class="text-primary material-icons md-monetization_on"></i
              ></span>
              <div class="text">
                <h6 class="mb-1 card-title">
                  <RouterLink class="main" to="/admin/managers">
                    Managers
                  </RouterLink>
                </h6>
                <span> 5 </span>
              </div>
            </article>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="card card-body mb-4">
            <article class="icontext">
              <span class="icon icon-sm rounded-circle bg-primary-light"
                ><i class="text-primary material-icons md-monetization_on"></i
              ></span>
              <div class="text">
                <h6 class="mb-1 card-title">
                  <RouterLink class="main" to="/admin/users">
                    Marketers
                  </RouterLink>
                </h6>
                <span> 5 </span>
              </div>
            </article>
          </div>
        </div> 
        <div class="col-lg-3">
          <div class="card card-body mb-4">
            <article class="icontext">
              <span class="icon icon-sm rounded-circle bg-primary-light"
                ><i class="text-primary material-icons md-monetization_on"></i
              ></span>
              <div class="text">
                <h6 class="mb-1 card-title">
                  <RouterLink class="main" to="/admin/posts">
                    Posts
                  </RouterLink>
                </h6>
                <span> 5 </span>
              </div>
            </article>
          </div>
        </div>
      </div>
      <!-- 
       -->
      <div class="row">
        <div class="col-xl-8 col-lg-12">
          <div class="card mb-4">
            <article class="card-body">
              <h5 class="card-title">Sale statistics</h5>
              <canvas id="myChart" height="120px"></canvas>
            </article>
          </div>
          <div class="row">
            <div class="col-lg-5">
              <div class="card mb-4">
                <article class="card-body">
                  <h5 class="card-title">New Members</h5>
                  <div class="new-member-list">
                    <div
                      class="d-flex align-items-center justify-content-between mb-4"
                    >
                      <div class="d-flex align-items-center">
                        <img
                          src="@/assets/imgs/people/avatar-4.png"
                          alt=""
                          class="avatar"
                        />
                        <div>
                          <h6>Patric Adams</h6>
                          <p class="text-muted font-xs">Sanfrancisco</p>
                        </div>
                      </div>
                      <a href="#" class="btn btn-xs"
                        ><i class="material-icons md-add"></i> Add</a
                      >
                    </div>
                    <div
                      class="d-flex align-items-center justify-content-between mb-4"
                    >
                      <div class="d-flex align-items-center">
                        <img
                          src="@/assets/imgs/people/avatar-2.png"
                          alt=""
                          class="avatar"
                        />
                        <div>
                          <h6>Dilan Specter</h6>
                          <p class="text-muted font-xs">Sanfrancisco</p>
                        </div>
                      </div>
                      <a href="#" class="btn btn-xs"
                        ><i class="material-icons md-add"></i> Add</a
                      >
                    </div>
                    <div
                      class="d-flex align-items-center justify-content-between mb-4"
                    >
                      <div class="d-flex align-items-center">
                        <img
                          src="@/assets/imgs/people/avatar-3.png"
                          alt=""
                          class="avatar"
                        />
                        <div>
                          <h6>Tomas Baker</h6>
                          <p class="text-muted font-xs">Sanfrancisco</p>
                        </div>
                      </div>
                      <a href="#" class="btn btn-xs"
                        ><i class="material-icons md-add"></i> Add</a
                      >
                    </div>
                  </div>
                </article>
              </div>
            </div>
            <div class="col-lg-7">
              <div class="card mb-4">
                <article class="card-body">
                  <h5 class="card-title">Recent activities</h5>
                  <ul class="verti-timeline list-unstyled font-sm">
                    <li class="event-list">
                      <div class="event-timeline-dot">
                        <i
                          class="material-icons md-play_circle_outline font-xxl"
                        ></i>
                      </div>
                      <div class="media">
                        <div class="me-3">
                          <h6>
                            <span>Today</span>
                            <i
                              class="material-icons md-trending_flat text-brand ml-15 d-inline-block"
                            ></i>
                          </h6>
                        </div>
                        <div class="media-body">
                          <div>Lorem ipsum dolor sit amet consectetur</div>
                        </div>
                      </div>
                    </li>
                    <li class="event-list active">
                      <div class="event-timeline-dot">
                        <i
                          class="material-icons md-play_circle_outline font-xxl animation-fade-right"
                        ></i>
                      </div>
                      <div class="media">
                        <div class="me-3">
                          <h6>
                            <span>17 May</span>
                            <i
                              class="material-icons md-trending_flat text-brand ml-15 d-inline-block"
                            ></i>
                          </h6>
                        </div>
                        <div class="media-body">
                          <div>
                            Debitis nesciunt voluptatum dicta reprehenderit
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="event-list">
                      <div class="event-timeline-dot">
                        <i
                          class="material-icons md-play_circle_outline font-xxl"
                        ></i>
                      </div>
                      <div class="media">
                        <div class="me-3">
                          <h6>
                            <span>13 May</span>
                            <i
                              class="material-icons md-trending_flat text-brand ml-15 d-inline-block"
                            ></i>
                          </h6>
                        </div>
                        <div class="media-body">
                          <div>Accusamus voluptatibus voluptas.</div>
                        </div>
                      </div>
                    </li>
                    <li class="event-list">
                      <div class="event-timeline-dot">
                        <i
                          class="material-icons md-play_circle_outline font-xxl"
                        ></i>
                      </div>
                      <div class="media">
                        <div class="me-3">
                          <h6>
                            <span>05 April</span>
                            <i
                              class="material-icons md-trending_flat text-brand ml-15 d-inline-block"
                            ></i>
                          </h6>
                        </div>
                        <div class="media-body">
                          <div>
                            At vero eos et accusamus et iusto odio dignissi
                          </div>
                        </div>
                      </div>
                    </li>
                    <li class="event-list">
                      <div class="event-timeline-dot">
                        <i
                          class="material-icons md-play_circle_outline font-xxl"
                        ></i>
                      </div>
                      <div class="media">
                        <div class="me-3">
                          <h6>
                            <span>26 Mar</span>
                            <i
                              class="material-icons md-trending_flat text-brand ml-15 d-inline-block"
                            ></i>
                          </h6>
                        </div>
                        <div class="media-body">
                          <div>Responded to need “Volunteer Activities</div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-4 col-lg-12">
          <div class="card mb-4">
            <article class="card-body">
              <h5 class="card-title">Revenue Base on Area</h5>
              <canvas id="myChart2" height="217"></canvas>
            </article>
          </div>
          <div class="card mb-4">
            <article class="card-body">
              <h5 class="card-title">Marketing Chanel</h5>
              <span class="text-muted font-xs">Facebook</span>
              <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: 15%">
                  15%
                </div>
              </div>
              <span class="text-muted font-xs">Instagram</span>
              <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: 65%">
                  65%
                </div>
              </div>
              <span class="text-muted font-xs">Google</span>
              <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: 51%">
                  51%
                </div>
              </div>
              <span class="text-muted font-xs">Twitter</span>
              <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: 80%">
                  80%
                </div>
              </div>
              <span class="text-muted font-xs">Other</span>
              <div class="progress mb-3">
                <div class="progress-bar" role="progressbar" style="width: 80%">
                  80%
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <header class="card-header">
          <h4 class="card-title">Latest orders</h4>
          <div class="row align-items-center">
            <div class="col-md-3 col-12 me-auto mb-md-0 mb-3">
              <div class="custom_select">
                <select class="form-select select-nice">
                  <option selected>All Categories</option>
                  <option>Women's Clothing</option>
                  <option>Men's Clothing</option>
                  <option>Cellphones</option>
                  <option>Computer & Office</option>
                  <option>Consumer Electronics</option>
                  <option>Jewelry & Accessories</option>
                  <option>Home & Garden</option>
                  <option>Luggage & Bags</option>
                  <option>Shoes</option>
                  <option>Mother & Kids</option>
                </select>
              </div>
            </div>
            <div class="col-md-2 col-6">
              <input type="date" value="02.05.2021" class="form-control" />
            </div>
            <div class="col-md-2 col-6">
              <div class="custom_select">
                <select class="form-select select-nice">
                  <option selected>Status</option>
                  <option>All</option>
                  <option>Paid</option>
                  <option>Chargeback</option>
                  <option>Refund</option>
                </select>
              </div>
            </div>
          </div>
        </header>
        <div class="card-body">
          <div class="table-responsive">
            <div class="table-responsive">
              <table class="table align-middle table-nowrap mb-0">
                <thead class="table-light">
                  <tr>
                    <th scope="col" class="text-center">
                      <div class="form-check align-middle">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="transactionCheck01"
                        />
                        <label
                          class="form-check-label"
                          for="transactionCheck01"
                        ></label>
                      </div>
                    </th>
                    <th class="align-middle" scope="col">Order ID</th>
                    <th class="align-middle" scope="col">Billing Name</th>
                    <th class="align-middle" scope="col">Date</th>
                    <th class="align-middle" scope="col">Total</th>
                    <th class="align-middle" scope="col">Payment Status</th>
                    <th class="align-middle" scope="col">Payment Method</th>
                    <th class="align-middle" scope="col">View Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="transactionCheck02"
                        />
                        <label
                          class="form-check-label"
                          for="transactionCheck02"
                        ></label>
                      </div>
                    </td>
                    <td><a href="#" class="fw-bold">#SK2540</a></td>
                    <td>Neal Matthews</td>
                    <td>07 Oct, 2021</td>
                    <td>$400</td>
                    <td>
                      <span class="badge badge-pill badge-soft-success"
                        >Paid</span
                      >
                    </td>
                    <td>
                      <i
                        class="material-icons md-payment font-xxl text-muted mr-5"
                      ></i>
                      Mastercard
                    </td>
                    <td>
                      <a href="#" class="btn btn-xs"> View details</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="transactionCheck03"
                        />
                        <label
                          class="form-check-label"
                          for="transactionCheck03"
                        ></label>
                      </div>
                    </td>
                    <td><a href="#" class="fw-bold">#SK2541</a></td>
                    <td>Jamal Burnett</td>
                    <td>07 Oct, 2021</td>
                    <td>$380</td>
                    <td>
                      <span class="badge badge-pill badge-soft-danger"
                        >Chargeback</span
                      >
                    </td>
                    <td>
                      <i
                        class="material-icons md-payment font-xxl text-muted mr-5"
                      ></i>
                      Visa
                    </td>
                    <td>
                      <a href="#" class="btn btn-xs"> View details</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="transactionCheck04"
                        />
                        <label
                          class="form-check-label"
                          for="transactionCheck04"
                        ></label>
                      </div>
                    </td>
                    <td><a href="#" class="fw-bold">#SK2542</a></td>
                    <td>Juan Mitchell</td>
                    <td>06 Oct, 2021</td>
                    <td>$384</td>
                    <td>
                      <span class="badge badge-pill badge-soft-success"
                        >Paid</span
                      >
                    </td>
                    <td>
                      <i
                        class="material-icons md-payment font-xxl text-muted mr-5"
                      ></i>
                      Paypal
                    </td>
                    <td>
                      <a href="#" class="btn btn-xs"> View details</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="transactionCheck05"
                        />
                        <label
                          class="form-check-label"
                          for="transactionCheck05"
                        ></label>
                      </div>
                    </td>
                    <td><a href="#" class="fw-bold">#SK2543</a></td>
                    <td>Barry Dick</td>
                    <td>05 Oct, 2021</td>
                    <td>$412</td>
                    <td>
                      <span class="badge badge-pill badge-soft-success"
                        >Paid</span
                      >
                    </td>
                    <td>
                      <i
                        class="material-icons md-payment font-xxl text-muted mr-5"
                      ></i>
                      Mastercard
                    </td>
                    <td>
                      <a href="#" class="btn btn-xs"> View details</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="transactionCheck06"
                        />
                        <label
                          class="form-check-label"
                          for="transactionCheck06"
                        ></label>
                      </div>
                    </td>
                    <td><a href="#" class="fw-bold">#SK2544</a></td>
                    <td>Ronald Taylor</td>
                    <td>04 Oct, 2021</td>
                    <td>$404</td>
                    <td>
                      <span class="badge badge-pill badge-soft-warning"
                        >Refund</span
                      >
                    </td>
                    <td>
                      <i
                        class="material-icons md-payment font-xxl text-muted mr-5"
                      ></i>
                      Visa
                    </td>
                    <td>
                      <a href="#" class="btn btn-xs"> View details</a>
                    </td>
                  </tr>
                  <tr>
                    <td class="text-center">
                      <div class="form-check">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="transactionCheck07"
                        />
                        <label
                          class="form-check-label"
                          for="transactionCheck07"
                        ></label>
                      </div>
                    </td>
                    <td><a href="#" class="fw-bold">#SK2545</a></td>
                    <td>Jacob Hunter</td>
                    <td>04 Oct, 2021</td>
                    <td>$392</td>
                    <td>
                      <span class="badge badge-pill badge-soft-success"
                        >Paid</span
                      >
                    </td>
                    <td>
                      <i
                        class="material-icons md-payment font-xxl text-muted mr-5"
                      ></i>
                      Paypal
                    </td>
                    <td>
                      <a href="#" class="btn btn-xs"> View details</a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- table-responsive end// -->
        </div>
      </div>
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
