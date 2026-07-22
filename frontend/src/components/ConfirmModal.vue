<template>
  <div class="modal-overlay" @click.self="$emit('cancel')">
    <div class="modal-content">
      <div class="modal-icon" :class="`modal-icon-${variant}`">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            v-if="variant === 'danger'"
            d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-.7 11.2A2 2 0 0 1 14.3 22H9.7a2 2 0 0 1-2-1.8L7 9Zm3 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z"
          />
          <path
            v-else
            d="M11 7h2v7h-2V7Zm0 9h2v2h-2v-2Zm1-14 10 18H2L12 2Z"
          />
        </svg>
      </div>

      <h2>{{ title }}</h2>
      <p>{{ message }}</p>

      <div class="modal-actions">
        <button type="button" class="btn-cancel" @click="$emit('cancel')">
          {{ cancelText }}
        </button>
        <button type="button" class="btn-confirm" :class="`btn-confirm-${variant}`" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "Confirmar accion",
  },
  message: {
    type: String,
    required: true,
  },
  confirmText: {
    type: String,
    default: "Confirmar",
  },
  cancelText: {
    type: String,
    default: "Cancelar",
  },
  variant: {
    type: String,
    default: "danger",
  },
});

defineEmits(["confirm", "cancel"]);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.82);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
}

.modal-content {
  width: 100%;
  max-width: 420px;
  background: #0f172a;
  border: 1px solid rgba(30, 41, 59, 0.9);
  border-radius: 16px;
  padding: 28px;
  color: #e2e8f0;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

.modal-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.modal-icon svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}

.modal-icon-danger {
  color: #fb7185;
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.24);
}

h2 {
  color: white;
  font-size: 20px;
  margin-bottom: 8px;
}

p {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.btn-cancel,
.btn-confirm {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  color: #cbd5e1;
  background: #1e293b;
}

.btn-cancel:hover {
  background: #334155;
}

.btn-confirm-danger {
  color: white;
  background: #e11d48;
}

.btn-confirm-danger:hover {
  background: #be123c;
}

@media (max-width: 480px) {
  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn-cancel,
  .btn-confirm {
    width: 100%;
  }
}
</style>
