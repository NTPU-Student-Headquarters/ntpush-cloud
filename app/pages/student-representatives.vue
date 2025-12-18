<!-- app/pages/student-representatives.vue -->
<template>
  <div class="bg-body min-vh-100">
    <!-- 導覽列 -->
    <nav class="navbar navbar-expand-lg bg-body-tertiary sticky-top shadow-sm">
      <div class="container-fluid">
        <span class="navbar-brand mb-0 h1">
          <i class="bi bi-people-fill me-2"></i>NTPU 學生代表
        </span>
        <div class="d-flex align-items-center gap-2">
          <!-- 亮暗模式切換 -->
          <button
            type="button"
            class="btn btn-outline-secondary"
            :aria-label="colorModeBs5.value === 'dark' ? '切換至亮色模式' : '切換至暗色模式'"
            @click="toggleColorModeBs5"
          >
            <i :class="colorModeBs5.value === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
          </button>
          <!-- 離開按鈕 -->
          <a
            href="https://ntpusu.org"
            class="btn btn-outline-secondary"
            aria-label="返回學生自治會網站"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="bi bi-box-arrow-right"></i>
          </a>
        </div>
      </div>
    </nav>

    <!-- 主要內容 -->
    <main class="container my-5">
      <!-- 介紹區塊 -->
      <section class="mb-5">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <h1 class="display-5 fw-bold mb-4 text-center">學生代表名冊</h1>
            <p class="lead text-center mb-4">
              本頁面列出 國立臺北大學學生自治會 推派至各校級會議的學生代表名單。<br />
              這些同學負責代表全體學生參與學校決策，保障學生權益，並由學生議會監督。
            </p>
            <div class="text-center">
              <a
                href="https://ntpusu.org/about"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary btn-lg"
              >
                <i class="bi bi-chat-dots me-2"></i>意見反映
              </a>
              <p class="text-muted mt-3 small">
                如需向學生代表反映意見，請點擊上方按鈕，由學生會轉達
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 載入狀態 -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">載入中...</span>
        </div>
        <p class="mt-3 text-muted">正在載入資料...</p>
      </div>

      <!-- 錯誤狀態 -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle me-2"></i>
        載入資料時發生錯誤，請稍後再試。
      </div>

      <!-- 會議列表 -->
      <section v-else>
        <div v-if="getMeetingsWithReps.length === 0" class="alert alert-info" role="alert">
          <i class="bi bi-info-circle me-2"></i>
          目前尚無會議資料
        </div>
        <div v-else class="row g-4">
          <div
            v-for="meeting in getMeetingsWithReps"
            :key="meeting.id"
            class="col-md-6 col-lg-4"
          >
            <article
              class="card h-100 shadow-sm meeting-card"
              role="button"
              tabindex="0"
              :aria-label="`查看 ${meeting.name} 詳細資訊`"
              @click="openModal(meeting)"
              @keypress.enter="openModal(meeting)"
              @keypress.space.prevent="openModal(meeting)"
            >
              <div class="card-body d-flex flex-column">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <span class="badge bg-secondary">{{ meeting.id }}</span>
                  <span
                    v-if="meeting.assignedReps.length > 0"
                    class="badge bg-success"
                  >
                    現有 {{ meeting.assignedReps.length }} 席
                  </span>
                </div>
                <h5 class="card-title fw-bold mb-3">{{ meeting.name }}</h5>
                <div class="mt-auto">
                  <div v-if="meeting.totalSeats" class="text-muted small mb-2">
                    <i class="bi bi-person-badge me-1"></i>
                    本會法定名額 {{ meeting.totalSeats }} 席
                  </div>
                  <div class="text-primary small">
                    <i class="bi bi-arrow-right-circle me-1"></i>
                    查看代表名單
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- 最後更新時間 -->
        <div v-if="data?.lastUpdated" class="text-center mt-5 text-muted small">
          <i class="bi bi-clock me-1"></i>
          最後更新：{{ formatDate(data.lastUpdated) }}
        </div>
      </section>
    </main>

    <!-- 頁尾 -->
    <footer class="bg-body-tertiary py-4 mt-5">
      <div class="container text-center">
        <p class="mb-1">
          <strong>網頁維護：</strong>總會秘書處
        </p>
        <p class="mb-0">
          <a href="mailto:ntpusuwebsite@gmail.com" class="text-decoration-none">
            <i class="bi bi-envelope me-1"></i>寄送電子郵件
          </a>
        </p>
      </div>
    </footer>

    <!-- 會議詳情彈窗 -->
    <MeetingModal
      v-if="selectedMeeting"
      v-model="showModal"
      :meeting="selectedMeeting"
    />
  </div>
</template>

<script setup lang="ts">
import type { MeetingWithReps } from '~/composables/useStudentRepresentatives';

// 使用 repres 布局
definePageMeta({
  layout: 'repres'
});

// SEO
useHead({
  title: '學生代表 - 臺北大學學生會',
  meta: [
    {
      name: 'description',
      content: '國立臺北大學學生自治會推派至各項校務會議的學生代表名冊'
    }
  ]
});

// 色彩模式
const colorModeBs5 = useColorMode();

const toggleColorModeBs5 = () => {
  colorModeBs5.preference = colorModeBs5.value === 'dark' ? 'light' : 'dark';
};

// 學生代表資料
const { data, loading, error, fetchData, getMeetingsWithReps } = useStudentRepresentatives();

// 彈窗控制
const showModal = ref(false);
const selectedMeeting = ref<MeetingWithReps | null>(null);

const openModal = (meeting: MeetingWithReps) => {
  selectedMeeting.value = meeting;
  showModal.value = true;
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Taipei'
  });
};

// 載入資料
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.meeting-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.meeting-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.meeting-card:focus {
  outline: 2px solid var(--bs-primary);
  outline-offset: 2px;
}

.meeting-card:active {
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .meeting-card {
    transition: none;
  }
  
  .meeting-card:hover {
    transform: none;
  }
}
</style>