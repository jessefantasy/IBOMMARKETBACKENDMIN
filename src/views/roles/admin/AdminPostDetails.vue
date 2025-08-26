<script setup>
// swiper

import axios from "axios";
import { ref, watch, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { Swiper, SwiperSlide, useSwiper } from "swiper/vue";
import { useSwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { message as antMessage } from "ant-design-vue";
import { AdminAndManager } from "../../../app/agent";
import { QueryClient, useQuery } from "@tanstack/vue-query";
import { Properties } from "../../../app/agent";
import AsideAdmin from "../../generic/AsideAdmin.vue";

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
topFunction();

function separatePascalCase(inputStr) {
  const words = inputStr.match(/[A-Z][a-z]*/g);
  return words.join(" ");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});
let cardsContainer = ref(null);
const SWIPER = ref(null);
const fetchingDetails = ref(true);
const previewModalOpened = ref(false);
const previewModalSrc = ref("");
const activeIndex = ref(1);
const router = useRouter();
const productDetails = ref(null);
const rejectModalVisible = ref(false);

const productId = router.currentRoute.value.params.postId;

const swiper = useSwiper();
const swiperSlide = useSwiperSlide();
const modalImage = ref("");

function onSwiper(swiper) {
  SWIPER.value = swiper;
}
function onSlideChange(swiper) {
  activeIndex.value = swiper.activeIndex + 1;
}
function changeSwiperSlide(index) {
  SWIPER.value.slideTo(index);
}
function toggleImageModalShow(url) {
  previewModalOpened.value = true;
  previewModalSrc.value = url;
}

function formartPrice(argument) {
  return argument?.toLocaleString();
}

let formattedData = {};
const open = ref(true);
const showModal = () => {
  open.value = true;
};
const handleOk = (e) => {
  open.value = false;
};

async function fetchPost() {
  try {
    fetchingDetails.value = true;
    const response = await Properties.getOne(productId);
    productDetails.value = response;

    formattedData = computed(() => {
      return Object.fromEntries(
        Object.entries(response).filter(
          ([key]) =>
            !key.startsWith("_") &&
            key !== "PostImages" &&
            key !== "CoverImageUrl" &&
            key !== "PropertyPhotos"
        )
      );
    });
  } catch (error) {
    console.log(error);
    router.push("/admin/posts");
  } finally {
    fetchingDetails.value = false;
  }
}

fetchPost();

// Filtered data to exclude internal keys

function formatKey(key) {
  // Convert camelCase or PascalCase to readable string
  return key.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function isImageUrl(value) {
  return (
    typeof value === "string" && value.match(/\.(jpeg|jpg|gif|png|webp)$/i)
  );
}

const rejectReasons = ref([]);
const rejectReasonsInput = ref("");
const rejectFieldInput = ref("");
const addRejectReason = function () {
  if (rejectReasonsInput.value && rejectFieldInput.value) {
    rejectReasons.value.push({
      message: rejectReasonsInput.value,
      key: rejectFieldInput.value,
    });
    rejectReasonsInput.value = "";
    rejectFieldInput.value = "";
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

const rejectPostBtnClicked = () => {
  if (rejectReasons.value.length !== 0) {
    sendPostEditRequest("reject", productId);
  } else {
    antMessage.error("Add at leas one reason for rejecting post!");
  }
};

const sendPostEditRequest = async function (type, postId) {
  try {
    if (type == "accept") {
      await AdminAndManager.eidtPost(
        { status: "active", postRejectReasons: [] },
        postId
      );
      antMessage.success("Post approved");
    } else if (type == "reject") {
      await AdminAndManager.eidtPost(
        { status: "rejected", postRejectReasons: rejectReasons.value },
        postId
      );
      antMessage.success("Post Rejected");
    }
    openedDetailsMenuIndex.value = null;
  } catch (error) {
    antMessage.error("Something went wrong");
  }

  rejectModalVisible.value = false;
};
</script>

<template>
  <AsideAdmin />
  <main v-if="!fetchingDetails" class="main-wrap">
    <div v-if="!fetchingDetails" class="grid-layout">
      <div class="left">
        <div class="slide-show-and-pagination">
          <div style="position: relative">
            <Swiper
              style="
                padding: 0;
                height: 55vh;
                max-height: 380px;
                position: relative;
              "
              @swiper="onSwiper"
              @slideChange="onSlideChange"
              :modules="[Navigation]"
              :pagination="{ clickable: true }"
              :navigation="
                productDetails?.PropertyPhotos?.length > 1 ? true : false
              "
            >
              <template v-for="image in productDetails?.PropertyPhotos">
                <SwiperSlide class="slide-image product">
                  <img
                    @click="toggleImageModalShow(image.Url)"
                    style="object-fit: cover; height: 190px"
                    :src="image.Url"
                  />
                </SwiperSlide>
              </template>
            </Swiper>
            <div
              v-if="productDetails?.PropertyPhotos?.length > 1"
              class="slide-count-indicator"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-6 h-6"
              >
                <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                <path
                  fill-rule="evenodd"
                  d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clip-rule="evenodd"
                />
              </svg>

              <span
                >{{ activeIndex }}/
                {{ productDetails?.PropertyPhotos.length }}</span
              >
            </div>
          </div>

          <div
            v-if="productDetails?.PropertyPhotos?.length > 1"
            class="navigation"
            style="display: flex"
          >
            <template v-for="(image, index) in productDetails?.PropertyPhotos">
              <img
                v-if="index < 5"
                class="pagination-buttons"
                :src="image.Url"
                @click="changeSwiperSlide(index)"
              />
            </template>
            <div
              v-if="productDetails?.PropertyPhotos?.length > 5"
              class="pagination-buttons"
              :style="{
                'background-image':
                  'url(' +
                  productDetails.PropertyPhotos[
                    productDetails.PropertyPhotos.length - 1
                  ].Url +
                  ')',
              }"
            >
              <span class="bg"> </span>
              <span class="count"
                >+{{ productDetails?.PropertyPhotos?.length - 5 }}</span
              >
            </div>
          </div>
        </div>
        <div class="core-details">
          <div style="position: relative">
            <span class="title"> {{ productDetails?.Title }} </span>
            <span class="price">
              ₦ {{ formartPrice(productDetails?.Price) }}
            </span>
          </div>
          <div class="location">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                fill-rule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
            <span> {{ productDetails?.Location }} </span>
          </div>

          <ol class="product-details-visual-details">
            <li
              v-if="typeof productDetails?.Others?.NumberOfBedroom === 'number'"
            >
              <img
                width="30"
                height="30"
                src="https://img.icons8.com/ios-glyphs/30/bed.png"
                alt="bed"
              />
              <span> {{ productDetails?.Others?.NumberOfBedroom }} </span>
            </li>
            <li
              v-if="
                typeof productDetails?.Others?.NumberOfBathroom === 'number'
              "
            >
              <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios-filled/50/shower-and-tub.png"
                alt="shower-and-tub"
              />
              <span>
                {{ productDetails?.Others?.NumberOfBathroom }}
              </span>
            </li>
            <li v-if="typeof productDetails?.Others?.SquareMeters === 'number'">
              <img
                width="50"
                height="50"
                src="https://img.icons8.com/ios-filled/50/surface.png"
                alt="surface"
              />
              <span> {{ productDetails?.Others?.SquareMeters }} sqm </span>
            </li>
          </ol>

          <div class="grid-details">
            <template v-for="(unique, key) in productDetails?.Others">
              <div
                v-if="
                  (Array.isArray(productDetails?.Others[key]) ||
                    typeof productDetails?.Others[key] != 'object') &&
                  typeof productDetails?.Others[key].length !== 0
                "
                class="grid-details-item unique-block"
              >
                <span class="key">
                  {{ separatePascalCase(key) }}
                </span>

                <!-- values -->
                <span
                  v-if="typeof productDetails?.Others[key] == 'object'"
                  class="value"
                >
                  <template
                    v-for="(item, index, parent) in productDetails?.Others[key]"
                  >
                    <span v-if="index !== parent?.length - 1">
                      {{ item + ", " }}
                    </span>
                    <span v-else>
                      {{ item + "." }}
                    </span>
                  </template>
                </span>
                <span
                  v-if="typeof productDetails?.Others[key] == 'string'"
                  class="value"
                >
                  {{ productDetails?.Others[key] }}
                </span>
                <span
                  v-if="typeof productDetails?.Others[key] == 'boolean'"
                  class="value"
                >
                  {{ productDetails?.Others[key] == true ? "Yes" : "No" }}
                </span>
                <span v-if="key == 'SecuredParking'" class="value"> Yes </span>

                <span
                  v-if="typeof productDetails?.Others[key] == 'number'"
                  class="value"
                >
                  <span v-if="key == 'PropertySize'">
                    {{ productDetails?.Others[key] }} sqm
                  </span>
                  <span v-else-if="key == 'ServiceCharge'">
                    ₦ {{ formartPrice(productDetails?.Others[key]) }}
                  </span>
                  <span v-else>
                    {{ productDetails?.Others[key] }}
                  </span>
                </span>
              </div>
            </template>
          </div>

          <span class="description"> {{ productDetails?.Description }} </span>
        </div>

        <div class="data-display">
          <div
            v-for="(value, key) in formattedData"
            :key="key"
            class="data-item"
          >
            <strong>{{ formatKey(key) }}:</strong>
            <div v-if="isImageUrl(value)">
              <img
                :src="value"
                alt="Image"
                style="max-width: 200px; margin: 5px 0"
              />
            </div>
            <div v-else-if="Array.isArray(value)">
              <ul>
                <li v-for="(item, index) in value" :key="index">
                  <span v-if="typeof item === 'string'">{{ item }}</span>
                  <span v-else-if="typeof item === 'object'">{{
                    JSON.stringify(item)
                  }}</span>
                </li>
              </ul>
            </div>
            <div v-else-if="typeof value === 'object' && value !== null">
              <pre>{{ JSON.stringify(value, null, 2) }}</pre>
            </div>
            <div v-else>
              {{ value }}
            </div>
          </div>
        </div>
      </div>

      <div class="other-details">
        <div class="left">
          <div class="big-price">
            <span class="price">
              ₦ {{ formartPrice(productDetails?.Price) }}
            </span>
          </div>
        </div>
        <div class="right">
          <div class="accept-reject-container">
            <button
              @click="sendPostEditRequest('accept', productId)"
              class="accept-button"
            >
              Accept Ad
            </button>
            <button @click="rejectModalVisible = true" class="reject-button">
              Reject Ad
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
  <div v-if="fetchingDetails" class="ibm-loading-container">
    <div>Loading details...</div>
  </div>

  <template>
    <a-button type="primary" @click="showModal">Open Modal</a-button>
    <a-modal
      v-model:open="previewModalOpened"
      width="100%"
      wrap-class-name="full-modal"
      @ok="handleOk"
      :footer="null"
      @cancel="previewModalOpened = false"
      class="details-preview-modal"
    >
      <img :src="previewModalSrc" />
    </a-modal>
  </template>

  <!-- reject modal -->

  <a-modal
    :footer="null"
    v-model:open="rejectModalVisible"
    @afterClose="rejectModalVisible = false"
    title="Add Reject Reason"
    centered
    style="padding: 20px 10px"
  >
    <div>
      <form @submit.prevent="addRejectReason">
        <div style="display: flex" class="">
          <input
            type="text"
            v-model="rejectReasonsInput"
            placeholder="Add reason..."
            class="form-control"
          />

          <div class="input-group" style="margin-left: 5px">
            <input
              v-model="rejectFieldInput"
              list="reject-reason-keys"
              type="text"
              class="form-control"
              placeholder="Select field with issue"
            />
          </div>
          <datalist id="reject-reason-keys">
            <option value="title">Title</option>
            <option value="postImages">Post Images</option>
            <option value="description">Description</option>
            <option value="address">Address</option>
            <option value="price">Price</option>
          </datalist>
          <svg
            @click="addRejectReason"
            style="margin-left: 10px; color: gray; cursor: pointer"
            height="40"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </form>
      <div style="margin-top: 15px" class="col-name">
        <div style="display: flex; justify-content: space-between"></div>
        <div
          v-for="(reason, index) in rejectReasons"
          style="
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
          "
        >
          <h6 class="mb-0" style="margin-bottom: 15px">
            <b>
              {{ reason }}
            </b>
          </h6>

          <svg
            @click="removeRejectReason(index)"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            style="color: red; cursor: pointer"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-6 h-6"
          >
            <path
              fill-rule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
      <div style="margin-top: 15px" class="col-name">
        <a-button @click="rejectPostBtnClicked" type="primary" :loading="false"
          >Reject Post</a-button
        >
      </div>
    </div>
  </a-modal>

  <div
    class="status-indicator"
    style="position: fixed; bottom: 10px; right: 10px; background-color: white"
  >
    <span
      v-if="productDetails?.Status === 'active'"
      class="badge badge-pill badge-soft-success"
      style="font-size: large"
      >This ad is Active</span
    >
    <span
      v-if="productDetails?.Status === 'pending'"
      class="badge badge-pill badge-soft-warning"
      style="font-size: large"
      >This ad is Pending</span
    >
    <span
      v-if="productDetails?.Status === 'rejected'"
      class="badge badge-pill badge-soft-danger"
      style="font-size: large"
      >This ad is Rejected</span
    >
  </div>
</template>

<style lang="less">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
    background: #00000060;
  }
  .ant-modal-body {
    background: red;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: unset;
  }
  .ant-modal-close-x {
    background: white;
    border-radius: 4px;
  }
}
</style>

<style scoped>
.product-details-visual-details {
  display: flex;
  width: 100%;
  padding: 0 20px;
  gap: 20px;
}
.product-details-visual-details li {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 5px;
}
.product-details-visual-details li span {
  font-size: 16px;
  color: #5b5959;
  font-weight: 600;
}
.product-details-visual-details li img {
  width: 30px;
  height: 30px;
  object-fit: cover;
  opacity: 0.6;
}

.grid-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px 0;
  margin-bottom: 25px;
}
.grid-details-item {
  display: flex;
  flex-direction: column;
}

.grid-details-item span.key {
  color: #6c8ea0;
  font-size: 12px;
  margin-bottom: 7px;
  text-transform: uppercase;
}
#fake-wrap-container {
  overflow: unset;
}
.grid-layout {
  width: 100%;
  overflow: hidden;
  background: #fff;
}
.help-when-big {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
}
.wrapper {
  width: 100%;
  position: relative;
  top: 2px;
  height: 80vw;
  overflow: unset !important;
  margin-bottom: 80px;
  max-height: 400px;
}
.swiper-backface-hidden .swiper-slide {
  width: 100% !important;
}
.slides-container {
  height: 81vw;
  position: relative;
  display: flex;
  transition: 900ms cubic-bezier(0.48, 0.15, 0.18, 1);
}

.slide-image.product img {
  width: 100%;
  height: 100% !important;
  object-fit: cover;
}
.next-btn,
.prev-btn {
  pointer-events: unset !important;
  cursor: pointer;
  z-index: 2;
  filter: brightness(0.4);
  width: 20px !important ;
}

.similar-adverts-block {
  width: 95%;
  margin: 10px auto;
  display: flex;
  padding: 10px 0;
  flex-direction: column;
}

.similar-adverts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}
.save-container-beside-title {
  display: none;
  position: absolute;
  right: 10px;
  top: 50%;
}
@media only screen and (max-width: 300px) {
  div.featuresandspec ol:nth-of-type(1),
  div.onelinefands ol {
    padding: 1px 2px;
  }
  div.featuresandspec ol li:nth-of-type(odd) {
    font-size: 12px;
  }
  div.featuresandspec ol li {
    font-size: 9px;
  }
  .name-and-add-info .name,
  .name-and-add-info ol {
    font-size: 11px;
  }
  .no-of-years span {
    font-size: 11px;
  }
}
@media only screen and (max-width: 450px) {
  .help-when-big {
    width: 100vw;
  }

  .similar-adverts {
    width: 100%;
  }
  .grid-layout {
    align-items: center;
    justify-content: center;
    width: 100%;
    background: #fff;
    padding: 0 0 30px;
    overflow: hidden;
  }
}
@media only screen and (min-width: 450px) {
  .save-container-beside-title {
    display: flex;
  }
}
@media only screen and (min-width: 500px) {
  div.imageContainer {
    width: 100% !important;
  }
}
@media only screen and (max-width: 700px) {
  .second-part.preview {
    flex-direction: column;
  }
  .second-part.preview .s-tips-to-palt {
    width: 100%;
  }
}
@media only screen and (min-width: 700px) {
  .second-part.preview .second-part-one {
    width: 40%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .second-part.preview .s-tips-to-palt {
    width: 40%;
  }
}
@media only screen and (min-width: 768px) {
  .help-when-big {
    width: 75%;
    margin-left: 3%;
  }
  div.imageContainer {
    width: 100%;
  }
  div.imageContainer div.nameAndPrice {
    font-size: 25px;
    margin-left: 15px;
    font-weight: 700;
    color: #413b3bce;
    display: flex;
    flex-wrap: wrap;
    line-height: 1.5em;
    margin-top: 10px;
  }
  div.imageContainer div.nameAndPrice span:nth-of-type(1) {
    margin-right: 20px;
  }
  div.imageContainer div.nameAndPrice span:nth-of-type(2) {
    margin-right: 20px;
    display: none;
  }
  div.imageContainer div.promotion {
    margin-left: 15px;
    color: #99b2bf;
    font-size: 12.5px;
    margin-top: 25px;
    display: flex;
    margin-bottom: 1px;
    padding-bottom: 7px;
  }
  div.imageContainer div.requestAndShow {
    display: none;
  }
  div.imageContainer .wrapper {
    height: 480px;
  }
  div.imageContainer .slides-container {
    height: 480px;
  }
  .navigation-dots {
    height: 95px;
  }
  div#imageModal {
    position: fixed;
    width: 100vw;
    left: 0;
    top: 0;
    height: 103vh;
  }
  #modalImage {
    width: 85%;
    height: 80%;
    object-fit: contain;
  }
  div.featuresandspec {
    width: 100%;
  }
  div.onelinefands {
    width: 95%;
  }
  div.maosc.preview {
    width: 100%;
  }

  div.maosc {
    margin: 0;
    width: 68.1vw;
    padding: 20px 0;
    display: flex;
    align-items: center;
  }

  div.maosc label:nth-of-type(1) {
    display: none;
  }

  div.maosc label:nth-of-type(2) {
    width: 12vw;
    background-color: #3db83a;
    padding: 10px 1;
    white-space: nowrap;
    font-size: 14px;
    margin-left: 20px;
    border-radius: 2px;
  }

  .social-media-links {
    display: none;
    align-items: center;
    justify-content: start;
    position: relative;
    align-self: flex-start;
    background-color: #fff;
    width: 85.8%;
    padding: 20px 18px;
  }

  .social-media-links img {
    display: flex;
    align-items: center;
    justify-content: start;
    height: 25px;
    width: 25px;
    margin: 2px 7px;
  }
  div.mao-block {
    width: 99.2%;
    padding-bottom: 10px;
    align-self: baseline;
    display: flex;
  }

  .last-make-an-offer {
    display: flex;
    background-color: #fff;
    display: none;
    outline: none;
    border: 1px solid #45ab44;
    width: 279px;
    padding: 10px 15px;
    font-weight: bold;
    font-size: 15px;
    position: relative;
    left: -1px;
    color: #45ab44;
    border-radius: 5px;
    margin-left: 10px;
  }
  .last-make-an-offer.preview {
    width: 250px;
    left: 10px;
  }
  .second-part-one {
    width: unset;
  }
  .second-part-one {
    width: 45%;
  }
  .price-and-rcb {
    display: flex;
    flex-direction: column;
    background-color: #fff;
    margin-bottom: 20px;
    margin-right: 0;
    width: 108%;
    padding: 0px;
  }
  .desktop-mode-price {
    font-size: 30px;
    color: #262a2bc0;
    font-weight: bolder;
    margin: 5px 0px 10px;
    padding: 20px 15px;
  }
  .desktop-mode-price.preview {
    font-size: 25px;
  }

  .desktop-mode-rcb {
    padding: 10px 15px;
  }

  .desktop-mode-rcb button {
    width: 100%;
    color: #37a534;
    border: 1px solid #37a534;
    background-color: #fff;
    border-radius: 3px;
    font-weight: bolder;
    font-size: 15px;
    padding: 10px 3px;
    height: 40px;
    transition: 0.3s;
    cursor: pointer;
  }
  .desktop-mode-rcb button:active {
    background-color: #38a5346a;
    font-size: 16px;
  }

  .desktop-mode-rcb button:hover {
    background-color: #38a53423;
  }
  .request-callback-modal {
    padding: 0px;
  }

  .name-show {
    width: 110%;
    overflow: hidden;
  }

  .name-show.preview {
    width: 100%;
  }
  .sellers-info {
    width: 85%;
  }
  .name-and-add-info {
    width: 100%;
  }
  .no-of-years {
    font-size: 9px;
  }

  .scsc {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding-bottom: 20px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    width: 88%;
    padding: 1px 15px;
    padding-bottom: 20px;
  }

  .scsc label {
    font-size: 15px;
    width: 210px;
    padding: 8px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
  }
  .scsc label:active {
    font-size: 16px;
  }
  .scsc label a {
    height: 100%;
    color: #fff;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scsc label img {
    width: 20px;
    margin-right: 5px;
  }

  .scsc label:nth-of-type(1) {
    background-color: #37a534;
    color: #fff;
    font-weight: bold;
    margin: 5px 10px;
  }

  .scsc label:nth-of-type(2) {
    border: 1px solid #37a534;
    color: #37a534;
    font-weight: bold;
    display: none !important;
  }
  .s-tips-to-palt {
    width: 45%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    justify-content: flex-start;
    background-color: #fff;
    margin-right: 15px;
    height: fit-content;
    overflow: hidden;
  }
  .safety-tips {
    background-color: #fff;
    width: 84%;
  }

  .safety-tips ul {
    font-size: 13px;
  }

  .unavailable-and-report {
    width: 95%;
  }

  .unavailable-and-report button {
    width: 190px;
    height: 40px;
    font-size: 13px;
    font-weight: unset;
    display: flex;
  }
  .post-ad-like-this {
    width: 80%;
    position: relative;
    left: 0px;
    border-radius: 5px;
  }
  label.chat-on-whatsapp {
    display: flex !important;
    position: relative;
    top: 0;
    height: 15px;
    margin: 0 0 0 5px !important;
    width: fit-content !important;
    border-radius: 2px !important;
    background: #3db83a;
  }
  .similar-adverts-block {
    width: 85%;
  }
  .similar-adverts {
    grid-template-columns: repeat(3, 1fr);
  }
  .grid-layout {
    width: 85%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background: unset;
  }
  .grid-layout .left {
    background: #fff;
  }
}
@media only screen and (min-width: 1024px) {
  .help-when-big {
    margin-left: 0;
    width: 910px;
  }
  .grid-layout {
    flex-direction: row;
    justify-content: start;
    align-items: flex-start;
    margin: 1px auto;
    margin-left: 7%;
    width: 85%;
  }
  .product-card-container {
    width: 66%;
  }
}
@media only screen and (min-width: 1200px) {
  .help-when-big {
    width: 820px;
  }
  .navigation-dots {
    margin: 0;
    height: 158px;
    top: 0;
  }
  #modalImage {
    width: unset;
    height: 85%;
  }
  .last-make-an-offer {
    background-color: #fff;
    display: none;
    outline: none;
    border: 1px solid #45ab44;
    width: 270px;
    padding: 10px 15px;
    font-weight: bold;
    font-size: 15px;
    color: #45ab44;
    border-radius: 5px;
    margin-left: 10px;
  }
  .price-and-rcb {
    display: flex;
    width: 340px;
  }
  .name-show {
    width: 340px;
  }
  .sellers-info {
    width: 328px;
  }
  .name-and-add-info ol {
    display: none;
  }
  .no-of-years {
    flex-direction: column;
  }

  .no-of-years span {
    width: fit-content;
  }

  .scsc {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    padding-bottom: 20px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    width: 340px;
    padding: 0;
  }

  .scsc label {
    width: 280px;
    padding: 8px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    cursor: pointer;
  }

  .scsc label img {
    width: 25px;
    margin-right: 5px;
  }

  .scsc label:nth-of-type(1) {
    background-color: #37a534;
    color: #fff;
    font-weight: bold;
    margin: 5px 10px;
  }

  .scsc label:nth-of-type(2) {
    border: 1px solid #37a534;
    color: #37a534;
    font-weight: bold;
  }
  .s-tips-to-palt {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 340px;
  }
  .safety-tips {
    background-color: #fff;
    width: 310px;
    margin-top: 15px;
    font-size: 13px;
    position: relative;
  }
  .unavailable-and-report {
    width: 100%;
    position: relative;
    padding: 0;
  }

  .unavailable-and-report button {
    font-size: 12px;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 5px !important;
  }
  .unavailable-and-report button:nth-of-type(2) {
    margin: 0 5px;
  }
  .post-ad-like-this {
    background-color: #fff;
    outline: 10px solid #fff;
    border-radius: 0px;
    width: 93%;
    justify-self: start;
    margin-top: 20px;
    position: relative;
    cursor: pointer;
    margin: 20px auto;
    align-self: center;
    padding: 10px 0;
  }
  .similar-adverts {
    width: 70%;
  }
  .similar-adverts ol {
    width: 255px;
  }
  .grid-layout {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-left: 0px;
    width: 100%;
  }
}

/*  */

/*for html page*/

@media only screen and (min-width: 765px) {
  .second-part {
    width: 76.8%;
    overflow: hidden;
    margin-left: 4.7%;
    justify-content: space-between;
    display: flex;
    margin-top: 15px;
  }

  .second-part-one {
    width: 45%;
  }
}

@media only screen and (min-width: 1024px) {
  .second-part {
    flex-direction: column;
    width: 460px;
    margin: 0 0 0 15px;
  }

  .second-part-one {
    width: unset;
  }
}

@media only screen and (min-width: 1200px) {
  .second-part {
    width: 350px;
  }
}

/* slide*/
.image-slide-wrapper {
  margin-bottom: 400px;
}
.swiper-pagination {
  display: flex;
  align-items: center;
  position: unset !important;
}

.swiper-pagination div {
  display: none;
  width: 20%;
  height: 70px;
  margin: 0 !important;
  border-radius: 0;
  opacity: 1;
  object-fit: cover;
  border: 1px solid #fff;
}
.swiper-pagination div.more-images {
  height: 100%;
  background: #00000090;
  width: 20%;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  position: absolute;
  right: 0;
}

.swiper-pagination img {
  height: 70px;
  width: 100%;
  margin: 0 !important;
  border-radius: 0;
  opacity: 1;
  object-fit: cover;
  border: 1px solid #fff;
}
.swiper-pagination div:nth-of-type(1),
.swiper-pagination div:nth-of-type(2),
.swiper-pagination div:nth-of-type(3),
.swiper-pagination div:nth-of-type(4),
.swiper-pagination div:nth-of-type(5) {
  display: unset;
}

.image-preview-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #000000d6;
  z-index: 3000;
  width: 100%;
}
.image-preview-modal.show {
  display: flex;
}
.image-preview-modal img {
  width: 100%;
  max-height: 80vh;
  object-fit: cover;
  max-width: 800px;
}
.image-preview-modal svg {
  display: block;
  color: #fff;
  cursor: pointer;
  z-index: 3;
  position: absolute;
  filter: invert(1);
  top: 20px;
  right: 20px;
  height: 20px;
}
.core-details {
  padding: 5px;
}
.core-details .title {
  font-size: 28px;
  font-weight: bold;
  color: #2e363b;
  font-family: sans-serif;
  margin: 0 0 5px;
  display: block;
}
.core-details .price {
  font-size: 28px;
  font-weight: bold;
  color: #32935d;
  font-family: sans-serif;
  margin: 0 0 5px;
  display: block;
}
.core-details .location {
  display: flex;
  align-items: center;
}
.core-details .location {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.core-details .location svg {
  height: 20px;
  margin-right: 10px;
  width: 20px;
  color: #6c8ea0;
}
.core-details .location span {
  color: #6c8ea0;
  font-size: 14px;
}
.core-details .request-callback-show-contact {
  display: flex;
  justify-content: space-between;
  margin: 5px 0 20px;
  border-bottom: 20px solid #ebf2f7;
  padding-bottom: 15px;
}
.core-details .request-callback-show-contact button {
  padding: 10px 15px;
  width: 48%;
  border-radius: 5px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background: #fff;
  border: 2px solid #32935d;
  color: #32935d;
  cursor: pointer;
}
.core-details .request-callback-show-contact button a {
  font-size: 16px;
  color: #32935d;
}
.core-details .request-callback-show-contact button:nth-of-type(2) {
  background: #32935d;
  color: #fff;
}
.core-details .request-callback-show-contact button:nth-of-type(2) a {
  color: #fff;
}
.core-details .description {
  color: #464b4f;
  font-size: 14px;
  line-height: 20px;
  padding: 0px 10px;
  display: block;
  white-space: break-spaces;
}
.other-details .left .big-price {
  display: none;
}
.other-details .left .owner a {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.other-details .left .owner a .dp {
  position: relative;
  margin-right: 15px;
}
.other-details .left .owner a .dp svg,
.other-details .left .owner a .dp img {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  color: #777;
  object-fit: cover;
}
.other-details .left .owner a .dp .active {
  height: 7px;
  width: 7px;
  position: absolute;
  border-radius: 50%;
  bottom: 7px;
  right: 0;
  background: #4ea54c;
}
.other-details .left .owner a .details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
}
.other-details .left .owner a .details .name-ad-count {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 5px;
  text-decoration: gray underline;
}
.other-details .left .owner a .details .name-ad-count span {
  font-size: 18px;
  font-weight: bold;
  margin-right: 15px;
}
.other-details .left .owner a .details .name-ad-count span.count {
  color: #4ea54c;
}
.other-details .left .owner a .details .name-ad-count svg {
  height: 30px;
  position: absolute;
  right: 10px;
}
.other-details .left .owner-contact button {
  height: 40px;
  width: 95%;
  margin: 10px auto 15px;
  background: #32935d;
  border-color: transparent;
  color: #fff;
  border-radius: 4px;
  font-size: 15px;
  display: none;
}
.other-details .left .owner-contact button a {
  font-size: 15px;
  color: #fff;
}
.other-details .left .big-price span {
  font-size: 30px;
  margin-bottom: 5px;
  font-weight: bold;
}

.other-details .right .safety-tips {
  background: #eef2f4;
  padding: 10px 15px;
  margin: 20px 0 20px;
}
.other-details .right .safety-tips span {
  font-size: 16px;
  font-weight: bold;
  margin: 30px auto 10px;
  margin-bottom: 15px;
  display: block;
  width: 100%;
  text-align: center;
}
.other-details .right .safety-tips ul {
  padding: 0px 15px;
}
.other-details .right .safety-tips ul li {
  padding: 3px 0;
  list-style-type: disc;
}
.other-details .right .action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}
.other-details .right .action-buttons button {
  width: 95%;
  height: 40px;
  margin: 0 10px;
  background: unset;
  border: 2px solid #eef2f4;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.other-details .right .action-buttons button.u {
  color: #0aa7eb;
}
.other-details .right .action-buttons button.r {
  color: #f00;
}
.other-details .right .ad-like-this {
  background: #eef2f4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
  margin-top: 30px;
}
.other-details .right .ad-like-this button {
  height: 40px;
  width: 100%;
  font-size: 18px;
  border-radius: 4px;
  border: 2px solid #4ea54c;
  color: #4ea54c;
}
.other-details .right .ad-like-this button a {
  color: inherit;
  width: 1000%;
  height: 100%;
}
.request-callbacl-modal {
  display: flex;
  position: fixed;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #00000040;
  top: 0;
  z-index: 3000;
}
.request-callbacl-modal form {
  height: 70%;
  max-height: 250px;
  border-radius: 10px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 15px;
  position: relative;
}
.request-callbacl-modal form input {
  height: 40px;
  width: 100%;
  text-indent: 15px;
  margin-bottom: 8px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #32935d;
}
.request-callbacl-modal form button {
  width: 100%;
}

.request-callbacl-modal form input.error {
  border: 1px solid red;
}
@media only screen and (min-width: 768px) {
  .core-details {
    background: #fff;
    padding: 15px 30px;
  }
  .core-details .request-callback-show-contact {
    border-color: #fff;
  }
  .other-details {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  .other-details .left {
    margin: 15px 0 15px;
    background: unset;
    border-radius: 5px;
    width: 49%;
  }
  .other-details .right {
    width: 49%;
  }
  .other-details .left .owner-contact {
    background: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .other-details .left .owner {
    padding: 15px;
    width: 100%;
  }
  .other-details .left .owner a .dp {
    margin-right: 10px;
  }
  .other-details .left .owner a .details .name-ad-count span {
    font-size: 12px;
  }
  .other-details .left .owner a .details .name-ad-count svg {
    display: none;
  }
  .other-details .left .owner-contact button {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .other-details .right .safety-tips {
    width: 100%;
    margin: 15px 0;
    background: #fff;
  }
  .other-details .right .safety-tips span {
    margin-top: 15px;
    text-align: unset;
    width: 40%;
  }
  .other-details .right .safety-tips ul {
    padding: 0px 15px;
    margin-bottom: 15px;
  }
  .other-details .right .action-buttons {
    padding: 20px 15px;
    background: #fff;
  }
  .other-details .right .ad-like-this {
    margin-top: 15px;
    background: #fff;
  }
  .other-details .right .ad-like-this button {
    background: #fff;
  }
  .other-details .left .big-price {
    display: flex;
    padding: 20px;
    display: flex;
    flex-direction: column;
    background: #fff;
  }
}
@media only screen and (min-width: 1024px) {
  .slide-show-and-pagination {
    overflow: hidden;
  }
  .slide-show-and-pagination {
    overflow: hidden;
  }
  .grid-layout {
    justify-content: space-between;
    margin: 9px auto 30px;
    max-width: 1200px;
  }
  .grid-layout .left {
    width: 66%;
  }
  .other-details {
    flex-direction: column;
    width: 33%;
  }
  .other-details .left {
    width: 100%;
    margin-top: 0;
  }
  .other-details .right {
    width: 100%;
  }
}
/*here*/

@media only screen and (min-width: 1024px) {
  .similar-adverts-block {
    margin: 30px auto 20px;
    width: 96%;
    max-width: 1210px;
  }
}
.pagination-buttons {
  height: 80px;
  width: 20%;
  margin: 0px;
  object-fit: cover;
  display: block;
  cursor: pointer;
}
div.pagination-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #00000050;
  color: #fff;
  font-size: 20px;
  background-size: cover;
  position: relative;
}
.pagination-buttons span.bg {
  background-color: #00000091;
  opacity: 0.6;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.pagination-buttons span.count {
  font-size: 20px;
  position: absolute;
}
.slide-count-indicator {
  position: absolute;
  bottom: 10px;
  background: #00000060;
  z-index: 1;
  left: 10px;
  padding: 5px 10px;
  color: #fff;
  display: flex;
  align-items: center;
  border-radius: 5px;
}
.slide-count-indicator svg {
  height: 20px;
  margin-right: 8px;
}
.slide-count-indicator span {
  font-size: 15px;
}
.details-preview-modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background: #00000090;
  z-index: 3000;
}

.details-preview-modal img {
  height: 100%;
  width: 100%;
  max-height: 90vh;
  max-width: 90vw;
  width: unset;
  object-fit: cover;
  user-select: none;
}
div.smalltop {
  padding: 0;
}
div.smalltop div.fpart {
  margin-left: 0;
}

.ibm-loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.ibm-loading-spinner {
  width: 80px;
  height: 80px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #32935d; /* IBM Blue */
  border-radius: 50%;
  animation: ibm-spin 1s linear infinite;
}

.ibm-loading-text {
  margin-top: 20px;
  font-family: "IBM Plex Sans", Arial, sans-serif;
  color: #161616;
  font-size: 18px;
}

.ibm-loading-progress {
  width: 200px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-top: 15px;
  overflow: hidden;
}

.ibm-loading-progress-bar {
  width: 0%;
  height: 100%;
  background: #0f62fe;
  animation: ibm-progress 2s ease-in-out infinite;
}

@keyframes ibm-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes ibm-progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
.feedbacks {
  display: flex;
  align-items: center;
  background-color: #fff;
  margin: 20px 10px;
  border: 1px solid #fea03c;
  padding: 10px;
  border-radius: 10px;
}
.feedbacks span {
  font-size: 16px;
  font-weight: bold;
  color: #fea03c;
}
.feedbacks svg {
  height: 30px;
  width: 30px;
  margin-right: 10px;
}
.feedbacks div {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.feedbacks div svg {
  height: 20px;
  width: 20px;
  margin-right: 0px;
}
.feedbacks div span {
  font-size: 12px;
}
@media only screen and (min-width: 765px) {
  .feedbacks {
    margin: 20px 0;
  }
}
@media only screen and (min-width: 1024px) {
  .feedbacks {
    margin: 0px 0;
  }
}

.accept-reject-container {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  padding: 0 10px;
}
.accept-reject-container button {
  width: 48%;
  height: 40px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  outline: none;
}
.accept-reject-container button.accept-button {
  background-color: #4caf50;
  color: white;
}
.accept-reject-container button.reject-button {
  background-color: #f44336;
  color: white;
}

.data-display {
  max-width: 800px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
  padding: 0px 20px;
}

.data-item {
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}
</style>
