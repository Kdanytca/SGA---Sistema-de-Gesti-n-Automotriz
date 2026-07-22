<template>
  <div class="page-container">
    <Navbar />

    <div class="page-content">
      <div class="header-card">
        <div class="header-left">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3a9 9 0 1 1-8.2 5.3L2 8.2V3h5.2L5.3 4.9A7 7 0 1 0 12 5v4l3.2 3.2-1.4 1.4L10 9.8V3h2Z" />
            </svg>
          </div>
          <div>
            <h1>Auditoría</h1>
            <p>Historial administrativo de movimientos recientes del sistema.</p>
          </div>
        </div>

        <button type="button" class="btn-primary" @click="loadAudit">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.7 6.3A8 8 0 1 0 20 12h-2a6 6 0 1 1-1.75-4.25L13 11h8V3l-3.3 3.3Z" />
          </svg>
          Actualizar
        </button>
      </div>

      <div v-if="errorMessage" class="alert-error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <section class="audit-panel">
        <div class="panel-header">
          <div>
            <h2>Actividad reciente</h2>
            <p>Eventos derivados de vehículos, mantenimientos y documentos registrados.</p>
          </div>
          <span class="event-count">{{ events.length }} eventos</span>
        </div>

        <div v-if="loading" class="empty-state">
          <i class="fa-solid fa-spinner fa-spin text-3xl"></i>
          <span>Cargando auditoría...</span>
        </div>

        <div v-else-if="events.length" class="audit-list">
          <article v-for="event in events" :key="event.id" class="audit-item">
            <div class="event-icon" :class="`event-${event.tipo}`">
              <svg v-if="event.tipo === 'vehiculo'" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 11 6.7 6.7A3 3 0 0 1 9.5 4.8h5a3 3 0 0 1 2.8 1.9L19 11h1a2 2 0 0 1 2 2v4h-2a2.5 2.5 0 0 1-5 0H9a2.5 2.5 0 0 1-5 0H2v-4a2 2 0 0 1 2-2h1Zm2.2 0h9.6l-1.15-3.05a1.25 1.25 0 0 0-1.15-.8h-5a1.25 1.25 0 0 0-1.15.8L7.2 11ZM6.5 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm11 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
              </svg>
              <svg v-else-if="event.tipo === 'mantenimiento'" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21.1 5.6a5.9 5.9 0 0 1-7.4 7.4l-6.8 6.8a2.4 2.4 0 0 1-3.4-3.4l6.8-6.8A5.9 5.9 0 0 1 17.7 2.2l-3.1 3.1 4.4 4.4 3.1-3.1c-.2-.35-.55-.8-1-1Z" />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.8V8h4.2L13 3.8ZM7 13h2.2a2 2 0 0 1 0 4H8v2H7v-6Zm1 1v2h1.2a1 1 0 0 0 0-2H8Zm4 0h1.2a2.8 2.8 0 0 1 0 5H12v-5Zm1 1v3h.2a1.8 1.8 0 0 0 0-3H13Zm4 0v1h2v1h-2v2h-1v-5h3v1h-2Z" />
              </svg>
            </div>

            <div class="event-body">
              <div class="event-main">
                <strong>{{ event.accion }}</strong>
                <span>{{ event.detalle }}</span>
              </div>
              <div class="event-meta">
                <span>{{ formatDate(event.fecha) }}</span>
                <span>{{ event.usuario }}</span>
                <span>{{ formatType(event.tipo) }}</span>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <i class="fa-solid fa-clipboard-list text-3xl"></i>
          <span>No hay movimientos recientes para mostrar.</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Navbar from "../components/Navbar.vue";
import api from "../api";

const events = ref([]);
const loading = ref(false);
const errorMessage = ref("");

const loadAudit = async () => {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await api.get("/audit");
    events.value = response.data;
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Error al cargar auditoría";
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatType = (type) => {
  if (type === "vehiculo") return "Vehículo";
  if (type === "mantenimiento") return "Mantenimiento";
  return "Documento";
};

onMounted(() => {
  loadAudit();
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #020617;
}

.page-content {
  padding: 24px 32px;
  max-width: 1200px;
  margin: 0 auto;
  color: white;
}

.header-card,
.audit-panel {
  background: #0f172a;
  border: 1px solid rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.header-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

@media (min-width: 640px) {
  .header-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 40px;
  height: 40px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
}

.header-icon svg,
.btn-primary svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
  flex: 0 0 auto;
}

.header-left h1,
.panel-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.header-left p,
.panel-header p {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f59e0b;
  color: #0f172a;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #fbbf24;
}

.alert-error {
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  margin-bottom: 16px;
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: #fb7185;
}

.audit-panel {
  overflow: hidden;
}

.panel-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(30, 41, 59, 0.6);
}

@media (min-width: 640px) {
  .panel-header {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.event-count {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  font-size: 12px;
  font-weight: 700;
}

.audit-list {
  display: flex;
  flex-direction: column;
}

.audit-item {
  display: flex;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid rgba(30, 41, 59, 0.55);
}

.audit-item:last-child {
  border-bottom: none;
}

.event-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.event-icon svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.event-vehiculo {
  background: rgba(14, 165, 233, 0.1);
  color: #38bdf8;
}

.event-mantenimiento {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
}

.event-documento {
  background: rgba(244, 63, 94, 0.1);
  color: #fb7185;
}

.event-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.event-main strong,
.event-main span {
  display: block;
}

.event-main strong {
  color: #f8fafc;
  font-size: 14px;
}

.event-main span {
  color: #cbd5e1;
  font-size: 13px;
  margin-top: 2px;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.event-meta span {
  color: #94a3b8;
  font-size: 12px;
}

.empty-state {
  padding: 48px 16px;
  text-align: center;
  color: #64748b;
}

.empty-state i {
  display: block;
  margin-bottom: 12px;
  color: #334155;
}

.empty-state span {
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 640px) {
  .page-content {
    padding: 16px 12px;
  }

  .header-card,
  .panel-header,
  .audit-item {
    padding: 14px;
  }

  .btn-primary {
    width: 100%;
  }

  .audit-item {
    align-items: flex-start;
  }

  .event-meta {
    flex-direction: column;
    gap: 2px;
  }
}
</style>
