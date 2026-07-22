<template>
  <div class="page-container">
    <Navbar />

    <div class="page-content">
      <div class="header-card">
        <div class="header-left">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.1 5.6a5.9 5.9 0 0 1-7.4 7.4l-6.8 6.8a2.4 2.4 0 0 1-3.4-3.4l6.8-6.8A5.9 5.9 0 0 1 17.7 2.2l-3.1 3.1 4.4 4.4 3.1-3.1c-.2-.35-.55-.8-1-1Z" />
            </svg>
          </div>
          <div>
            <h1>
              {{ isEdit ? "Editar Mantenimiento" : "Nuevo Mantenimiento" }}
            </h1>
            <p>
              {{
                isEdit
                  ? "Modifica los datos del mantenimiento"
                  : "Registra un nuevo mantenimiento en el sistema"
              }}
            </p>
          </div>
        </div>
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

      <!-- Formulario -->
      <div class="form-container">
        <form @submit.prevent="saveMaintenance" class="maintenance-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Vehículo <span class="required">*</span></label>
              <select v-model="maintenance.vehicle_id" required>
                <option value="">Seleccionar vehículo</option>
                <option v-for="v in vehicles" :key="v.id" :value="v.id">
                  {{ formatVehicleOption(v) }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Tipo <span class="required">*</span></label>
              <select v-model="maintenance.tipo" required>
                <option value="preventivo">Preventivo</option>
                <option value="correctivo">Correctivo</option>
                <option value="inspeccion">Inspección</option>
                <option value="general">General</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Descripción <span class="required">*</span></label>
              <textarea
                v-model="maintenance.descripcion"
                rows="3"
                placeholder="Describe el mantenimiento a realizar..."
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label>Fecha Programada <span class="required">*</span></label>
              <div class="date-picker-row">
                <input
                  ref="scheduledDateInput"
                  v-model="maintenance.fecha_programada"
                  type="datetime-local"
                  required
                />
                <button type="button" class="btn-date-picker" @click="openDatePicker(scheduledDateInput)">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 2h2v3h6V2h2v3h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10ZM4 8h16V7H4v1Zm3 4h3v3H7v-3Zm5 0h3v3h-3v-3Z" />
                  </svg>
                  Seleccionar fecha
                </button>
              </div>
              <span class="input-hint">Puedes escribir la fecha o usar el botón para abrir el calendario.</span>
            </div>

            <div class="form-group">
              <label>Fecha Realización</label>
              <div class="date-picker-row">
                <input
                  ref="realizationDateInput"
                  v-model="maintenance.fecha_realizacion"
                  type="datetime-local"
                />
                <button type="button" class="btn-date-picker" @click="openDatePicker(realizationDateInput)">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 2h2v3h6V2h2v3h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10ZM4 8h16V7H4v1Zm3 4h3v3H7v-3Zm5 0h3v3h-3v-3Z" />
                  </svg>
                  Seleccionar fecha
                </button>
              </div>
              <span class="input-hint">Puedes escribir la fecha o usar el botón para abrir el calendario.</span>
            </div>

            <div class="form-group">
              <label>Costo</label>
              <input
                v-model.number="maintenance.costo"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div class="form-group">
              <label>Estado</label>
              <select v-model="maintenance.estado">
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completado">Completado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>

            <div class="form-group">
              <label>Kilómetros en Mantenimiento</label>
              <input
                v-model.number="maintenance.km_en_mantenimiento"
                type="number"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" @click="router.back()" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-save">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9.2 16.2-4-4L3.8 13.6l5.4 5.4L20.6 7.6 19.2 6.2 9.2 16.2Z" />
              </svg>
              {{ isEdit ? "Actualizar" : "Guardar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import api from "../api";

const route = useRoute();
const router = useRouter();
const isEdit = ref(route.params.id ? true : false);
const successMessage = ref("");
const errorMessage = ref("");
const scheduledDateInput = ref(null);
const realizationDateInput = ref(null);

const vehicles = ref([]);
const maintenance = ref({
  vehicle_id: "",
  tipo: "preventivo",
  descripcion: "",
  fecha_programada: "",
  fecha_realizacion: "",
  costo: null,
  estado: "pendiente",
  km_en_mantenimiento: null,
});

const formatDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
};

const formatVehicleOption = (vehicle) => {
  const owner = vehicle.Owner || vehicle.owner;
  const ownerName = [owner?.nombre, owner?.apellido].filter(Boolean).join(" ");
  const vehicleName = `${vehicle.placa} - ${vehicle.marca} ${vehicle.modelo}`;

  return ownerName ? `${vehicleName} (${ownerName})` : vehicleName;
};

const openDatePicker = (input) => {
  const dateInput = input?.value instanceof HTMLElement ? input.value : input;

  if (!dateInput) return;

  if (typeof dateInput.showPicker === "function") {
    dateInput.showPicker();
    return;
  }

  dateInput.focus();
  dateInput.click();
};

const loadVehicles = async () => {
  try {
    const response = await api.get("/vehicles");
    vehicles.value = response.data;

    if (!isEdit.value && route.query.vehicle_id) {
      maintenance.value.vehicle_id = parseInt(route.query.vehicle_id);
    }
  } catch (error) {
    errorMessage.value = "Error al cargar vehículos";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const loadMaintenance = async () => {
  try {
    const response = await api.get(`/maintenances/${route.params.id}`);
    maintenance.value = {
      vehicle_id: response.data.vehicle_id,
      tipo: response.data.tipo,
      descripcion: response.data.descripcion,
      fecha_programada: formatDateTimeLocal(response.data.fecha_programada),
      fecha_realizacion: formatDateTimeLocal(response.data.fecha_realizacion),
      costo: response.data.costo ? parseFloat(response.data.costo) : null,
      estado: response.data.estado,
      km_en_mantenimiento: response.data.km_en_mantenimiento,
    };
  } catch (error) {
    errorMessage.value = "Error al cargar mantenimiento";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const saveMaintenance = async () => {
  try {
    errorMessage.value = "";

    if (!maintenance.value.vehicle_id) {
      errorMessage.value = "Debes seleccionar un vehículo";
      setTimeout(() => {
        errorMessage.value = "";
      }, 3000);
      return;
    }

    // Convertir fechas a ISO con zona horaria
    const fechaProgramada = maintenance.value.fecha_programada
      ? new Date(maintenance.value.fecha_programada).toISOString()
      : null;

    const fechaRealizacion = maintenance.value.fecha_realizacion
      ? new Date(maintenance.value.fecha_realizacion).toISOString()
      : null;

    const data = {
      vehicle_id: parseInt(maintenance.value.vehicle_id),
      tipo: maintenance.value.tipo,
      descripcion: maintenance.value.descripcion,
      fecha_programada: fechaProgramada,
      fecha_realizacion: fechaRealizacion,
      costo: maintenance.value.costo
        ? parseFloat(maintenance.value.costo)
        : null,
      estado: maintenance.value.estado,
      km_en_mantenimiento: maintenance.value.km_en_mantenimiento
        ? parseInt(maintenance.value.km_en_mantenimiento)
        : null,
    };

    if (isEdit.value) {
      await api.put(`/maintenances/${route.params.id}`, data);
      successMessage.value = "Mantenimiento actualizado exitosamente";

      setTimeout(() => {
        successMessage.value = "";
        router.push("/maintenances");
      }, 1500);
    } else {
      await api.post("/maintenances", data);
      successMessage.value = "Mantenimiento creado exitosamente";

      setTimeout(() => {
        successMessage.value = "";
        router.push("/maintenances");
      }, 1500);
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error || "Error al guardar mantenimiento";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

onMounted(async () => {
  await loadVehicles();
  if (isEdit.value) {
    await loadMaintenance();
  }
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
.btn-save svg {
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

/* Formulario */
.form-container {
  background: #1e293b;
  border-radius: 12px;
  border: 1px solid #1e293b;
  padding: 32px;
}

.maintenance-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-group label .required {
  color: #fb7185;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px 14px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #0ea5e9;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #475569;
}

.date-picker-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}

.btn-date-picker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 14px;
  border: 1px solid rgba(14, 165, 233, 0.35);
  background: rgba(14, 165, 233, 0.12);
  color: #38bdf8;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-date-picker svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.btn-date-picker:hover {
  background: rgba(14, 165, 233, 0.2);
  border-color: rgba(14, 165, 233, 0.65);
  transform: translateY(-1px);
}

.input-hint {
  color: #64748b;
  font-size: 11px;
}

@media (max-width: 560px) {
  .date-picker-row {
    grid-template-columns: 1fr;
  }

  .btn-date-picker {
    width: 100%;
  }
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

/* Acciones */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #1e293b;
}

.btn-cancel {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: rgba(30, 41, 59, 0.5);
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #0ea5e9;
  border: none;
  border-radius: 8px;
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-save:hover {
  background: #0284c7;
  transform: scale(0.98);
}

@media (max-width: 640px) {
  .page-content {
    padding: 16px 12px;
  }

  .header-card,
  .form-container {
    padding: 14px;
  }

  .header-left {
    align-items: flex-start;
  }

  .header-left h1 {
    font-size: 18px;
  }

  .maintenance-form {
    gap: 18px;
  }

  .form-grid {
    gap: 14px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea,
  .btn-date-picker,
  .btn-cancel,
  .btn-save {
    min-height: 44px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }

  .input-hint {
    line-height: 1.4;
  }
}
</style>
