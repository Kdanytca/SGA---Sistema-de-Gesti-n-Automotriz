<template>
  <div class="page-container">
    <Navbar />

    <div class="page-content">
      <!-- Header -->
      <div class="header-card">
        <div class="header-left">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.2 6.5A3 3 0 0 1 9 4.5h6a3 3 0 0 1 2.8 2l1.05 3H20a2 2 0 0 1 2 2v5h-2.1a3 3 0 0 1-5.8 0H9.9a3 3 0 0 1-5.8 0H2v-5a2 2 0 0 1 2-2h1.15l1.05-3Zm1.9 3h7.8l-.75-2.15A1.25 1.25 0 0 0 14 6.5H10a1.25 1.25 0 0 0-1.15.85L8.1 9.5ZM7 17.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
          </div>
          <div>
            <h1>Gestión de Vehículos</h1>
            <p>Listado de todos los vehículos registrados en el sistema.</p>
          </div>
        </div>

        <button @click="router.push('/vehicles/new')" class="btn-primary">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
          </svg>
          Nuevo Vehículo
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

      <!-- Tabla de Vehículos -->
      <div class="table-container">
        <div class="table-wrapper">
          <table class="vehicles-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Placa</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Propietario</th>
                <th>Año</th>
                <th>Color</th>
                <th>KM</th>
                <th>Estado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="vehicle in vehicles"
                :key="vehicle.id"
                class="table-row"
              >
                <td data-label="ID" class="text-slate-400 font-mono text-xs">
                  {{ vehicle.id }}
                </td>
                <td data-label="Placa" class="font-medium text-white">{{ vehicle.placa }}</td>
                <td data-label="Marca">{{ vehicle.marca }}</td>
                <td data-label="Modelo">{{ vehicle.modelo }}</td>
                <td data-label="Propietario">
                  <router-link
                    v-if="vehicle.Owner"
                    :to="`/owners/${vehicle.Owner.id}`"
                    class="owner-link"
                  >
                    {{ vehicle.Owner.nombre }} {{ vehicle.Owner.apellido }}
                  </router-link>
                  <span v-else>-</span>
                </td>
                <td data-label="Año">{{ vehicle.año }}</td>
                <td data-label="Color">
                  <span
                    class="color-dot"
                    :style="{ backgroundColor: vehicle.color }"
                  ></span>
                  {{ vehicle.color }}
                </td>
                <td data-label="KM">{{ vehicle.km_actual?.toLocaleString() }}</td>
                <td data-label="Estado">
                  <span
                    class="status-badge"
                    :class="{
                      'status-active': vehicle.estado === 'activo',
                      'status-maintenance': vehicle.estado === 'mantenimiento',
                      'status-inactive': vehicle.estado === 'inactivo',
                    }"
                  >
                    <i class="fa-solid fa-circle text-[6px]"></i>
                    {{
                      vehicle.estado === "activo"
                        ? "Activo"
                        : vehicle.estado === "mantenimiento"
                          ? "En Mantenimiento"
                          : "Inactivo"
                    }}
                  </span>
                </td>
                <td data-label="Acciones" class="text-right actions-cell">
                  <router-link
                    :to="`/vehicles/edit/${vehicle.id}`"
                    class="btn-action btn-edit"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 17.2V20h2.8L17.9 8.9 15.1 6.1 4 17.2ZM19.7 7.1a1 1 0 0 0 0-1.4l-1.4-1.4a1 1 0 0 0-1.4 0l-1.1 1.1 2.8 2.8 1.1-1.1Z" />
                    </svg>
                    Editar
                  </router-link>

                  <router-link
                    :to="`/vehicles/${vehicle.id}`"
                    class="btn-action btn-history"
                  >
                    Historial
                  </router-link>

                  <router-link
                    :to="{ path: '/maintenances', query: { vehicle_id: vehicle.id } }"
                    class="btn-action btn-maintenance"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M21.1 5.6a5.9 5.9 0 0 1-7.4 7.4l-6.8 6.8a2.4 2.4 0 0 1-3.4-3.4l6.8-6.8A5.9 5.9 0 0 1 17.7 2.2l-3.1 3.1 4.4 4.4 3.1-3.1c-.2-.35-.55-.8-1-1Z" />
                    </svg>
                    Mantenimientos
                  </router-link>

                  <button
                    v-if="authStore.isAdmin"
                    @click="openDeleteModal(vehicle.id)"
                    class="btn-action btn-delete"
                    title="Eliminar vehiculo"
                  >
                    <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-.7 11.2A2 2 0 0 1 14.3 22H9.7a2 2 0 0 1-2-1.8L7 9Zm3 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z" />
                    </svg>
                  </button>
                </td>
              </tr>

              <tr v-if="vehicles.length === 0">
                <td colspan="10" class="empty-state">
                  <i class="fa-solid fa-car-side text-3xl"></i>
                  <span>No hay vehículos registrados en el sistema.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ConfirmModal
      v-if="vehicleToDelete"
      title="Eliminar vehiculo"
      message="Esta accion eliminara el vehiculo seleccionado. No podras deshacer este cambio."
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      @confirm="deleteVehicle"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";
import Navbar from "../components/Navbar.vue";
import ConfirmModal from "../components/ConfirmModal.vue";
import api from "../api";

const router = useRouter();
const authStore = useAuthStore();
const vehicles = ref([]);
const successMessage = ref("");
const errorMessage = ref("");
const vehicleToDelete = ref(null);

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
  vehicleToDelete.value = id;
};

const closeDeleteModal = () => {
  vehicleToDelete.value = null;
};

const deleteVehicle = async () => {
  try {
    await api.delete(`/vehicles/${vehicleToDelete.value}`);
    successMessage.value = "Vehículo eliminado exitosamente";
    closeDeleteModal();
    loadVehicles();

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    closeDeleteModal();
    errorMessage.value =
      error.response?.data?.error || "Error al eliminar vehículo";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

onMounted(() => {
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

.vehicles-table {
  width: 100%;
  text-align: left;
  font-size: 14px;
  border-collapse: collapse;
}

.vehicles-table thead {
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid #1e293b;
}

.vehicles-table thead th {
  padding: 14px 16px;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.vehicles-table tbody td {
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

.owner-link {
  color: #38bdf8;
  font-weight: 600;
  text-decoration: none;
}

.owner-link:hover {
  text-decoration: underline;
}

/* Color dot */
.color-dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  vertical-align: middle;
  margin-right: 6px;
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

.status-active {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.2);
}

.status-maintenance {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  border-color: rgba(245, 158, 11, 0.2);
}

.status-inactive {
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

.btn-action svg {
  width: 14px;
  height: 14px;
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

.btn-history {
  color: #a78bfa;
}

.btn-history:hover {
  background: rgba(139, 92, 246, 0.2);
  border-color: rgba(139, 92, 246, 0.3);
}

.btn-maintenance {
  color: #fbbf24;
}

.btn-maintenance:hover {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.3);
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

@media (max-width: 640px) {
  .page-content {
    padding: 16px 12px;
  }

  .header-card {
    padding: 14px;
  }

  .header-left {
    align-items: flex-start;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
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

  .vehicles-table,
  .vehicles-table thead,
  .vehicles-table tbody,
  .vehicles-table tr,
  .vehicles-table td {
    display: block;
    width: 100%;
  }

  .vehicles-table thead {
    display: none;
  }

  .vehicles-table tbody {
    display: grid;
    gap: 12px;
  }

  .vehicles-table tbody tr.table-row {
    background: #1e293b;
    border: 1px solid rgba(30, 41, 59, 0.8);
    border-radius: 14px;
    padding: 12px;
  }

  .vehicles-table tbody td {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(30, 41, 59, 0.55);
    text-align: right;
  }

  .vehicles-table tbody td::before {
    content: attr(data-label);
    color: #94a3b8;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: left;
  }

  .vehicles-table tbody td:last-child {
    border-bottom: none;
  }

  .actions-cell {
    justify-content: stretch;
  }

  .actions-cell::before {
    display: none;
  }

  .vehicles-table tbody td.empty-state {
    display: block;
    text-align: center;
    border-bottom: none;
  }

  .vehicles-table tbody td.empty-state::before {
    display: none;
  }

  .btn-action {
    flex: 1 1 100%;
    justify-content: center;
    padding: 8px 10px;
  }
}
</style>
