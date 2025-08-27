<template>
  <div class="pagination-area mt-30 mb-50">
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-start">
        <!-- Prev Button -->
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(currentPage - 1)"
          >
            <i class="material-icons md-chevron_left"></i>
          </a>
        </li>

        <!-- Page Numbers -->
        <li
          v-for="page in visiblePages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page, disabled: page === '...' }"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="typeof page === 'number' && changePage(page)"
          >
            {{ page }}
          </a>
        </li>

        <!-- Next Button -->
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(currentPage + 1)"
          >
            <i class="material-icons md-chevron_right"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
});

const emit = defineEmits(["page-changed"]);

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit("page-changed", page);
  }
};

// Generate a visible pagination range (with ellipses)
const visiblePages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const delta = 2;
  const pages = [];

  for (
    let i = Math.max(1, current - delta);
    i <= Math.min(total, current + delta);
    i++
  ) {
    pages.push(i);
  }

  if (pages[0] > 2) {
    pages.unshift("...");
  }
  if (pages[0] !== 1) {
    pages.unshift(1);
  }

  if (pages[pages.length - 1] < total - 1) {
    pages.push("...");
  }
  if (pages[pages.length - 1] !== total) {
    pages.push(total);
  }

  return pages;
});
</script>

<style scoped>
.page-item.disabled .page-link {
  pointer-events: none;
  opacity: 0.5;
}
.page-item.active .page-link {
  background-color: #007bff;
  color: #fff;
}
</style>
