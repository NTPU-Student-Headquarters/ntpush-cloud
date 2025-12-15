<!-- components/MeetingModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal fade show"
        style="display: block"
        tabindex="-1"
        role="dialog"
        aria-labelledby="meetingModalLabel"
        aria-modal="true"
        @click.self="closeModal"
      >
        <div class="modal-dialog modal-dialog-scrollable modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 id="meetingModalLabel" class="modal-title">{{ meeting.name }}</h5>
              <button
                type="button"
                class="btn-close"
                aria-label="關閉"
                @click="closeModal"
              ></button>
            </div>
            <div class="modal-body">
              <!-- 基本資訊 -->
              <section class="mb-4">
                <h5 class="fw-bold mb-3">基本資訊</h5>
                <div class="row g-2">
                  <div v-if="meeting.department" class="col-sm-6">
                    <strong>承辦單位：</strong>
                    <a
                      v-if="meeting.departmentLink"
                      :href="meeting.departmentLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="ms-1"
                    >
                      {{ meeting.department }}
                      <i class="bi bi-box-arrow-up-right ms-1"></i>
                    </a>
                    <span v-else class="ms-1">{{ meeting.department }}</span>
                  </div>
                  <div v-if="meeting.totalSeats" class="col-sm-6">
                    <strong>本會法定可推派席次：</strong>
                    <span class="ms-1">{{ meeting.totalSeats }}</span>
                  </div>
                  <div v-if="meeting.link" class="col-12">
                    <strong>會議資料：</strong>
                    <a
                      v-if="meeting.link !== 'non-public'"
                      :href="meeting.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="ms-1"
                    >
                      查看會議資料
                      <i class="bi bi-box-arrow-up-right ms-1"></i>
                    </a>
                    <span v-else class="ms-1 text-muted">非公開</span>
                  </div>
                </div>
              </section>

              <!-- 推派方式 -->
              <section v-if="hasNominationInfo" class="mb-4">
                <h5 class="fw-bold mb-3">推派方式</h5>
                <div class="row g-2">
                  <div v-if="meeting.regulationArticle" class="col-12">
                    <strong>依據：</strong>
                    <span class="ms-1">本會學代推派辦法{{ meeting.regulationArticle }}</span>
                  </div>
                  <div v-if="meeting.seatDistribution" class="col-12">
                    <strong>席次分配：</strong>
                    <span class="ms-1">{{ meeting.seatDistribution }}</span>
                  </div>
                  <div v-if="meeting.sanxiaRegulation || meeting.sanxiaMethod" class="col-sm-6">
                    <strong>三峽校區：</strong>
                    <div class="ms-3">
                      <div v-if="meeting.sanxiaRegulation" class="small">
                        依據：三峽學代推派條例{{ meeting.sanxiaRegulation }}
                      </div>
                      <div v-if="meeting.sanxiaMethod" class="small">
                        推派方式：{{ meeting.sanxiaMethod }}
                      </div>
                    </div>
                  </div>
                  <div v-if="meeting.taipeiRegulation || meeting.taipeiMethod" class="col-sm-6">
                    <strong>臺北校區：</strong>
                    <div class="ms-3">
                      <div v-if="meeting.taipeiRegulation" class="small">
                        依據：臺北學代推派條例{{ meeting.taipeiRegulation }}
                      </div>
                      <div v-if="meeting.taipeiMethod" class="small">
                        推派方式：{{ meeting.taipeiMethod }}
                      </div>
                    </div>
                  </div>
                  <div v-if="meeting.otherMethod" class="col-12">
                    <strong>其他推派方式：</strong>
                    <span class="ms-1">{{ meeting.otherMethod }}</span>
                  </div>
                </div>
              </section>

              <!-- 學生代表名冊 -->
              <section class="mb-4">
                <h5 class="fw-bold mb-3">學生代表</h5>
                <div v-if="meeting.assignedReps.length > 0" class="table-responsive">
                  <table class="table table-hover table-bordered">
                    <thead class="table-light">
                      <tr>
                        <th scope="col">姓名</th>
                        <th scope="col">職稱</th>
                        <th scope="col">系級</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="rep in meeting.assignedReps" :key="rep.id">
                        <td>{{ rep.name }}</td>
                        <td>{{ rep.title || '-' }}</td>
                        <td>{{ rep.department || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div v-else class="text-muted">
                  <i class="bi bi-info-circle me-2"></i>目前尚無學生代表資料
                </div>
              </section>

              <!-- 備註 -->
              <section v-if="meeting.note" class="mb-2">
                <h6 class="fw-bold mb-3">備註</h6>
                <p class="mb-0" style="white-space: pre-wrap">{{ meeting.note }}</p>
              </section>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                關閉
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
    <Transition name="backdrop">
      <div
        v-if="modelValue"
        class="modal-backdrop fade show"
        @click="closeModal"
      ></div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { MeetingWithReps } from '~/composables/useStudentRepresentatives';

const props = defineProps<{
  modelValue: boolean;
  meeting: MeetingWithReps;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const hasNominationInfo = computed(() => {
  return !!(
    props.meeting.regulationArticle ||
    props.meeting.seatDistribution ||
    props.meeting.sanxiaRegulation ||
    props.meeting.sanxiaMethod ||
    props.meeting.taipeiRegulation ||
    props.meeting.taipeiMethod ||
    props.meeting.otherMethod
  );
});

const closeModal = () => {
  emit('update:modelValue', false);
};

// 處理 ESC 鍵關閉
onMounted(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.modelValue) {
      closeModal();
    }
  };
  window.addEventListener('keydown', handleEscape);
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
  });
});

// 防止背景滾動
watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.15s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}
</style>