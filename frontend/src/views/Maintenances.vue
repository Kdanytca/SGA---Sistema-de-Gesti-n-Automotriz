<template>
  <div class="page-container">
    <Navbar />

    <div class="page-content">
      <!-- Header -->
      <div class="header-card">
        <div class="header-left">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.1 5.6a5.9 5.9 0 0 1-7.4 7.4l-6.8 6.8a2.4 2.4 0 0 1-3.4-3.4l6.8-6.8A5.9 5.9 0 0 1 17.7 2.2l-3.1 3.1 4.4 4.4 3.1-3.1c-.2-.35-.55-.8-1-1Z" />
            </svg>
          </div>
          <div>
            <h1>Gestión de Mantenimientos</h1>
            <p>
              Listado de todos los mantenimientos registrados en el sistema.
            </p>
          </div>
        </div>

        <button @click="router.push('/maintenances/new')" class="btn-primary">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
          </svg>
          Nuevo Mantenimiento
        </button>
      </div>

      <!-- Alertas -->
      <div v-if="successMessage" class="alert-success">
        <i class="fa-solid fa-circle-check"></i>
        <span>{{ successMessage }}</span>
      </div>

      <div v-if="errorMessage" class="alert-error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Filtros -->
      <div class="filters-container">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Estado</label>
            <select v-model="filters.estado">
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Tipo</label>
            <select v-model="filters.tipo">
              <option value="">Todos</option>
              <option value="preventivo">Preventivo</option>
              <option value="correctivo">Correctivo</option>
              <option value="inspeccion">Inspección</option>
              <option value="general">General</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Vehículo</label>
            <select v-model="filters.vehicle_id">
              <option value="">Todos</option>
              <option v-for="v in vehicles" :key="v.id" :value="v.id">
                {{ v.placa }} - {{ v.marca }} {{ v.modelo }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label>&nbsp;</label>
            <button @click="applyFilters" class="btn-filter">Filtrar</button>
            <button @click="clearFilters" class="btn-filter-clear">
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de Mantenimientos -->
      <div class="table-container">
        <div class="table-wrapper">
          <table class="maintenances-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vehículo</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Fecha Programada</th>
                <th>Costo</th>
                <th>Estado</th>
                <th>Realizado Por</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="maintenance in filteredMaintenances"
                :key="maintenance.id"
                class="table-row"
              >
                <td data-label="ID" class="text-slate-400 font-mono text-xs">
                  {{ maintenance.id }}
                </td>
                <td data-label="Vehículo" class="font-medium text-white">
                  {{ maintenance.Vehicle?.placa }} -
                  {{ maintenance.Vehicle?.marca }}
                  {{ maintenance.Vehicle?.modelo }}
                </td>
                <td data-label="Tipo">
                  <span
                    class="type-badge"
                    :class="{
                      'type-preventivo': maintenance.tipo === 'preventivo',
                      'type-correctivo': maintenance.tipo === 'correctivo',
                      'type-inspeccion': maintenance.tipo === 'inspeccion',
                      'type-general': maintenance.tipo === 'general',
                    }"
                  >
                    {{
                      maintenance.tipo === "preventivo"
                        ? "Preventivo"
                        : maintenance.tipo === "correctivo"
                          ? "Correctivo"
                          : maintenance.tipo === "inspeccion"
                            ? "Inspección"
                            : "General"
                    }}
                  </span>
                </td>
                <td data-label="Descripción" class="description-cell">{{ maintenance.descripcion }}</td>
                <td data-label="Fecha Programada">{{ formatDate(maintenance.fecha_programada) }}</td>
                <td data-label="Costo">{{ maintenance.costo ? '$' + parseFloat(maintenance.costo).toFixed(2) : '-' }}</td>
                <td data-label="Estado">
                  <span
                    class="status-badge"
                    :class="{
                      'status-pendiente': maintenance.estado === 'pendiente',
                      'status-progreso': maintenance.estado === 'en_progreso',
                      'status-completado': maintenance.estado === 'completado',
                      'status-cancelado': maintenance.estado === 'cancelado',
                    }"
                  >
                    <i class="fa-solid fa-circle text-[6px]"></i>
                    {{
                      maintenance.estado === "pendiente"
                        ? "Pendiente"
                        : maintenance.estado === "en_progreso"
                          ? "En Progreso"
                          : maintenance.estado === "completado"
                            ? "Completado"
                            : "Cancelado"
                    }}
                  </span>
                </td>
                <td data-label="Realizado Por">{{ maintenance.User?.nombre || "-" }}</td>
                <td data-label="Acciones" class="text-right actions-cell">
                  <router-link
                    :to="`/maintenances/edit/${maintenance.id}`"
                    class="btn-action btn-edit"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 17.2V20h2.8L17.9 8.9 15.1 6.1 4 17.2ZM19.7 7.1a1 1 0 0 0 0-1.4l-1.4-1.4a1 1 0 0 0-1.4 0l-1.1 1.1 2.8 2.8 1.1-1.1Z" />
                    </svg>
                    Editar
                  </router-link>

                  <button
                    v-if="maintenance.estado !== 'completado' && maintenance.estado !== 'cancelado'"
                    @click="openFinishModal(maintenance)"
                    class="btn-action btn-finish"
                    title="Finalizar mantenimiento"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-1.2 13.2 6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4 3.6 3.6Z" />
                    </svg>
                    Finalizar
                  </button>

                  <button
                    v-if="authStore.isAdmin"
                    @click="openDeleteModal(maintenance.id)"
                    class="btn-action btn-delete"
                    title="Eliminar mantenimiento"
                  >
                    <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-.7 11.2A2 2 0 0 1 14.3 22H9.7a2 2 0 0 1-2-1.8L7 9Zm3 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z" />
                    </svg>
                  </button>
                </td>
              </tr>

              <tr v-if="filteredMaintenances.length === 0">
                <td colspan="9" class="empty-state">
                  <i class="fa-solid fa-wrench text-3xl"></i>
                  <span>No hay mantenimientos registrados en el sistema.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-if="maintenanceToDelete"
      title="Eliminar mantenimiento"
      message="Esta accion eliminara el mantenimiento seleccionado. No podras deshacer este cambio."
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      @confirm="deleteMaintenance"
      @cancel="closeDeleteModal"
    />

    <div v-if="maintenanceToFinish" class="finish-modal-overlay" @click.self="closeFinishModal">
      <form class="finish-modal-content" @submit.prevent="finishMaintenance(false)">
        <div class="finish-modal-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm-1.2 13.2 6-6-1.4-1.4-4.6 4.6-2.2-2.2-1.4 1.4 3.6 3.6Z" />
          </svg>
        </div>

        <h2>Finalizar mantenimiento</h2>
        <p>
          Se marcará como completado, se guardará la fecha actual como fecha de realización
          y el vehículo quedará disponible si no tiene otro mantenimiento en progreso.
        </p>

        <div class="finish-summary">
          <span>Vehículo</span>
          <strong>
            {{ maintenanceToFinish.Vehicle?.placa }} -
            {{ maintenanceToFinish.Vehicle?.marca }}
            {{ maintenanceToFinish.Vehicle?.modelo }}
          </strong>
        </div>

        <div class="finish-field">
          <label>Kilómetros al finalizar <span>Opcional</span></label>
          <input
            v-model="finishKm"
            type="number"
            min="0"
            placeholder="Dejar vacío si no se registrará km"
          />
        </div>

        <div class="finish-actions">
          <button type="button" class="btn-finish-cancel" @click="closeFinishModal">
            Cancelar
          </button>
          <button type="button" class="btn-finish-upload" @click="finishMaintenance(true)">
            Finalizar y subir factura
          </button>
          <button type="submit" class="btn-finish-confirm">
            Finalizar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import Navbar from "../components/Navbar.vue";
import ConfirmModal from "../components/ConfirmModal.vue";
import api from "../api";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const maintenances = ref([]);
const vehicles = ref([]);
const successMessage = ref("");
const errorMessage = ref("");
const maintenanceToDelete = ref(null);
const maintenanceToFinish = ref(null);
const finishKm = ref("");

const filters = ref({
  estado: "",
  tipo: "",
  vehicle_id: "",
});

const filteredMaintenances = computed(() => {
  let result = maintenances.value;

  if (filters.value.estado) {
    result = result.filter((m) => m.estado === filters.value.estado);
  }
  if (filters.value.tipo) {
    result = result.filter((m) => m.tipo === filters.value.tipo);
  }
  if (filters.value.vehicle_id) {
    result = result.filter(
      (m) => m.vehicle_id === parseInt(filters.value.vehicle_id),
    );
  }

  return result;
});

const loadMaintenances = async () => {
  try {
    const response = await api.get("/maintenances");
    maintenances.value = response.data;
  } catch (error) {
    errorMessage.value = "Error al cargar mantenimientos";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const loadVehicles = async () => {
  try {
    const response = await api.get("/vehicles");
    vehicles.value = response.data;
  } catch (error) {
    errorMessage.value = "Error al cargar vehículos";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const openDeleteModal = (id) => {
  maintenanceToDelete.value = id;
};

const closeDeleteModal = () => {
  maintenanceToDelete.value = null;
};

const openFinishModal = (maintenance) => {
  maintenanceToFinish.value = maintenance;
  finishKm.value = maintenance.km_en_mantenimiento ?? "";
};

const closeFinishModal = () => {
  maintenanceToFinish.value = null;
  finishKm.value = "";
};

const deleteMaintenance = async () => {
  try {
    await api.delete(`/maintenances/${maintenanceToDelete.value}`);
    successMessage.value = "Mantenimiento eliminado exitosamente";
    closeDeleteModal();
    loadMaintenances();

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    closeDeleteModal();
    errorMessage.value =
      error.response?.data?.error || "Error al eliminar mantenimiento";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const finishMaintenance = async (uploadAfterFinish) => {
  if (!maintenanceToFinish.value) return;

  try {
    const maintenance = maintenanceToFinish.value;
    const kmValue = finishKm.value === "" || finishKm.value === null
      ? null
      : parseInt(finishKm.value);

    if (kmValue !== null && Number.isNaN(kmValue)) {
      errorMessage.value = "Los kilómetros deben ser un número válido";
      setTimeout(() => {
        errorMessage.value = "";
      }, 3000);
      return;
    }

    await api.put(`/maintenances/${maintenance.id}`, {
      vehicle_id: maintenance.vehicle_id,
      tipo: maintenance.tipo,
      descripcion: maintenance.descripcion,
      fecha_programada: maintenance.fecha_programada,
      fecha_realizacion: new Date().toISOString(),
      costo: maintenance.costo ? parseFloat(maintenance.costo) : null,
      estado: "completado",
      km_en_mantenimiento: kmValue,
    });

    closeFinishModal();
    successMessage.value = "Mantenimiento finalizado. El vehículo queda disponible si no tiene otro mantenimiento en progreso.";

    if (uploadAfterFinish) {
      router.push({ path: "/documents", query: { maintenance_id: maintenance.id } });
      return;
    }

    await loadMaintenances();

    setTimeout(() => {
      successMessage.value = "";
    }, 4000);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error || "Error al finalizar mantenimiento";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const applyFilters = () => {
  // Los filtros se aplican automáticamente por el computed
};

const clearFilters = () => {
  filters.value = {
    estado: "",
    tipo: "",
    vehicle_id: "",
  };
};

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  if (route.query.vehicle_id) {
    filters.value.vehicle_id = String(route.query.vehicle_id);
  }

  loadMaintenances();
  loadVehicles();
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #020617;
}

.page-content {
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
  color: white;
}

/* Header */
.header-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #0f172a;
  border: 1px solid rgba(30, 41, 59, 0.6);
  padding: 16px 20px;
  border-radius: 12px;
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
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38bdf8;
}

.header-icon svg,
.btn-primary svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
  flex: 0 0 auto;
}

.header-left h1 {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.header-left p {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #0ea5e9;
  color: #0f172a;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
  white-space: nowrap;
}

.btn-primary:hover {
  background: #0284c7;
  transform: scale(0.98);
}

/* Alertas */
.alert-success,
.alert-error {
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  margin-bottom: 16px;
}

.alert-success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.alert-error {
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: #fb7185;
}

/* Filtros */
.filters-container {
  background: #0f172a;
  border: 1px solid rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-group label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-group select {
  padding: 8px 12px;
  background: #1e293b;
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.filter-group select:focus {
  border-color: #0ea5e9;
}

.filter-group .btn-filter,
.filter-group .btn-filter-clear {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-filter {
  background: #0ea5e9;
  color: #0f172a;
}

.btn-filter:hover {
  background: #0284c7;
  transform: scale(0.98);
}

.btn-filter-clear {
  background: transparent;
  border: 1px solid #334155 !important;
  color: #94a3b8;
  margin-left: 8px;
}

.btn-filter-clear:hover {
  background: rgba(30, 41, 59, 0.5);
}

/* Tabla */
.table-container {
  background: #1e293b;
  border-radius: 12px;
  border: 1px solid #1e293b;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.maintenances-table {
  width: 100%;
  text-align: left;
  font-size: 14px;
  border-collapse: collapse;
}

.maintenances-table thead {
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid #1e293b;
}

.maintenances-table thead th {
  padding: 14px 16px;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.maintenances-table tbody td {
  padding: 14px 16px;
  color: #cbd5e1;
}

.table-row {
  border-bottom: 1px solid rgba(30, 41, 59, 0.6);
  transition: background 0.2s;
}

.table-row:hover {
  background: rgba(30, 41, 59, 0.3);
}

.text-right {
  text-align: right;
}

.description-cell {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Type Badges */
.type-badge {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 500;
  border: 1px solid transparent;
}

.type-preventivo {
  background: rgba(14, 165, 233, 0.1);
  color: #38bdf8;
  border-color: rgba(14, 165, 233, 0.2);
}

.type-correctivo {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.2);
}

.type-inspeccion {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.2);
}

.type-general {
  background: rgba(139, 92, 246, 0.1);
  color: #a78bfa;
  border-color: rgba(139, 92, 246, 0.2);
}

/* Status Badges */
.status-badge {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 500;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-pendiente {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.2);
}

.status-progreso {
  background: rgba(14, 165, 233, 0.1);
  color: #38bdf8;
  border-color: rgba(14, 165, 233, 0.2);
}

.status-completado {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.2);
}

.status-cancelado {
  background: rgba(244, 63, 94, 0.1);
  color: #fb7185;
  border-color: rgba(244, 63, 94, 0.2);
}

/* Acciones */
.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  flex-wrap: wrap;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(30, 41, 59, 0.6);
  background: #0f172a;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: inherit;
}

.action-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.btn-action svg,
.finish-modal-icon svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
  flex: 0 0 auto;
}

.btn-edit {
  color: #38bdf8;
}

.btn-edit:hover {
  background: rgba(14, 165, 233, 0.2);
  border-color: rgba(14, 165, 233, 0.3);
}

.btn-finish {
  color: #34d399;
}

.btn-finish:hover {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.3);
}

.btn-delete {
  color: #fb7185;
}

.btn-delete:hover {
  background: rgba(244, 63, 94, 0.2);
  border-color: rgba(244, 63, 94, 0.3);
}

/* Empty State */
.empty-state {
  padding: 48px 16px !important;
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

.finish-modal-overlay {
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

.finish-modal-content {
  width: 100%;
  max-width: 520px;
  background: #0f172a;
  border: 1px solid rgba(30, 41, 59, 0.9);
  border-radius: 16px;
  padding: 28px;
  color: #e2e8f0;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

.finish-modal-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.24);
}

.finish-modal-content h2 {
  color: white;
  font-size: 20px;
  margin-bottom: 8px;
}

.finish-modal-content p {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
}

.finish-summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  margin: 18px 0;
  background: rgba(30, 41, 59, 0.55);
  border: 1px solid rgba(51, 65, 85, 0.8);
  border-radius: 12px;
}

.finish-summary span,
.finish-field label {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.finish-summary strong {
  color: white;
  font-size: 14px;
}

.finish-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.finish-field label {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.finish-field label span {
  color: #38bdf8;
  font-size: 10px;
}

.finish-field input {
  padding: 10px 14px;
  background: #020617;
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.finish-field input:focus {
  border-color: #0ea5e9;
}

.finish-field input::placeholder {
  color: #475569;
}

.finish-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.btn-finish-cancel,
.btn-finish-upload,
.btn-finish-confirm {
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-finish-cancel {
  color: #cbd5e1;
  background: #1e293b;
}

.btn-finish-upload {
  color: #38bdf8;
  background: rgba(14, 165, 233, 0.12);
  border: 1px solid rgba(14, 165, 233, 0.35);
}

.btn-finish-confirm {
  color: #052e1a;
  background: #34d399;
}

.btn-finish-cancel:hover {
  background: #334155;
}

.btn-finish-upload:hover {
  background: rgba(14, 165, 233, 0.22);
}

.btn-finish-confirm:hover {
  background: #10b981;
}

@media (max-width: 560px) {
  .finish-actions {
    flex-direction: column-reverse;
  }

  .btn-finish-cancel,
  .btn-finish-upload,
  .btn-finish-confirm {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .page-content {
    padding: 16px 12px;
  }

  .header-card,
  .filters-container {
    padding: 14px;
  }

  .header-left {
    align-items: flex-start;
  }

  .btn-primary,
  .filter-group .btn-filter,
  .filter-group .btn-filter-clear {
    width: 100%;
    justify-content: center;
    margin-left: 0;
  }
}

@media (max-width: 760px) {
  .table-container {
    background: transparent;
    border: none;
    overflow: visible;
  }

  .table-wrapper {
    overflow: visible;
  }

  .maintenances-table,
  .maintenances-table thead,
  .maintenances-table tbody,
  .maintenances-table tr,
  .maintenances-table td {
    display: block;
    width: 100%;
  }

  .maintenances-table thead {
    display: none;
  }

  .maintenances-table tbody {
    display: grid;
    gap: 12px;
  }

  .maintenances-table tbody tr.table-row {
    background: #1e293b;
    border: 1px solid rgba(30, 41, 59, 0.8);
    border-radius: 14px;
    padding: 12px;
  }

  .maintenances-table tbody td {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(30, 41, 59, 0.55);
    text-align: right;
  }

  .maintenances-table tbody td::before {
    content: attr(data-label);
    color: #94a3b8;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: left;
  }

  .maintenances-table tbody td:last-child {
    border-bottom: none;
  }

  .description-cell {
    max-width: none;
    white-space: normal;
    overflow: visible;
  }

  .actions-cell {
    justify-content: stretch;
  }

  .actions-cell::before {
    display: none;
  }

  .maintenances-table tbody td.empty-state {
    display: block;
    text-align: center;
    border-bottom: none;
  }

  .maintenances-table tbody td.empty-state::before {
    display: none;
  }

  .btn-action {
    flex: 1 1 100%;
    justify-content: center;
    padding: 8px 10px;
  }
}
</style>
