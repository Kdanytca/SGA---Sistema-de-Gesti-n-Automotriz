<template>
  <div class="page-container">
    <Navbar />

    <div class="page-content">
      <div class="header-card">
        <div class="header-left">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.2 6.5A3 3 0 0 1 9 4.5h6a3 3 0 0 1 2.8 2l1.05 3H20a2 2 0 0 1 2 2v5h-2.1a3 3 0 0 1-5.8 0H9.9a3 3 0 0 1-5.8 0H2v-5a2 2 0 0 1 2-2h1.15l1.05-3Zm1.9 3h7.8l-.75-2.15A1.25 1.25 0 0 0 14 6.5H10a1.25 1.25 0 0 0-1.15.85L8.1 9.5ZM7 17.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
          </div>
          <div>
            <h1>{{ isEdit ? "Editar Vehículo" : "Nuevo Vehículo" }}</h1>
            <p>
              {{
                isEdit
                  ? "Modifica los datos del vehículo"
                  : "Registra un nuevo vehículo en el sistema"
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
        <form @submit.prevent="saveVehicle" class="vehicle-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Placa <span class="required">*</span></label>
              <input
                v-model="vehicle.placa"
                type="text"
                placeholder="ABC-123"
                required
              />
            </div>

            <div class="form-group">
              <label>Marca <span class="required">*</span></label>
              <input
                v-model="vehicle.marca"
                type="text"
                placeholder="Toyota"
                required
              />
            </div>

            <div class="form-group">
              <label>Modelo <span class="required">*</span></label>
              <input
                v-model="vehicle.modelo"
                type="text"
                placeholder="Corolla"
                required
              />
            </div>

            <div class="form-group">
              <label>Año <span class="required">*</span></label>
              <input
                v-model.number="vehicle.año"
                type="number"
                placeholder="2024"
                min="1900"
                required
              />
            </div>

            <div class="form-group">
              <label>Color <span class="required">*</span></label>
              <div class="color-input-group">
                <input
                  v-model="vehicle.color"
                  type="text"
                  placeholder="Rojo"
                  required
                />
                <input
                  v-model="vehicle.color"
                  type="color"
                  class="color-picker"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Kilómetros Actuales</label>
              <input
                v-model.number="vehicle.km_actual"
                type="number"
                placeholder="0"
                min="0"
              />
            </div>

            <!-- Propietario -->
            <div class="form-group full-width">
              <label>Propietario <span class="required">*</span></label>
              <div class="owner-select-group">
                <select v-model="vehicle.owner_id" required>
                  <option value="">Seleccionar propietario</option>
                  <option
                    v-for="owner in owners"
                    :key="owner.id"
                    :value="owner.id"
                  >
                    {{ owner.nombre }} {{ owner.apellido }} -
                    {{ owner.documento }}
                  </option>
                </select>
                <button
                  type="button"
                  @click="showOwnerModal = true"
                  class="btn-add-owner"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
                  </svg>
                  Nuevo
                </button>
              </div>
            </div>

            <div class="form-group full-width" v-if="isEdit">
              <label>Estado</label>
              <select v-model="vehicle.estado">
                <option value="activo">Activo</option>
                <option value="mantenimiento">En Mantenimiento</option>
                <option value="inactivo">Inactivo</option>
              </select>
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

    <!-- Modal de Propietario -->
    <div
      v-if="showOwnerModal"
      class="modal-overlay"
      @click.self="closeOwnerModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fa-solid fa-user"></i> Nuevo Propietario</h2>
          <button @click="closeOwnerModal" class="modal-close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form @submit.prevent="saveOwner" class="modal-form">
          <div class="form-grid-modal">
            <div class="form-group">
              <label>Nombre <span class="required">*</span></label>
              <input
                v-model="newOwner.nombre"
                type="text"
                required
                placeholder="Nombre"
              />
            </div>

            <div class="form-group">
              <label>Apellido <span class="required">*</span></label>
              <input
                v-model="newOwner.apellido"
                type="text"
                required
                placeholder="Apellido"
              />
            </div>

            <div class="form-group">
              <label>Documento <span class="required">*</span></label>
              <input
                v-model="newOwner.documento"
                type="text"
                required
                placeholder="DNI, NIT, etc."
              />
            </div>

            <div class="form-group">
              <label>Teléfono</label>
              <input
                v-model="newOwner.telefono"
                type="text"
                placeholder="123456789"
              />
            </div>

            <div class="form-group full-width">
              <label>Email</label>
              <input
                v-model="newOwner.email"
                type="email"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div class="form-group full-width">
              <label>Dirección</label>
              <input
                v-model="newOwner.direccion"
                type="text"
                placeholder="Dirección completa"
              />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeOwnerModal" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-save">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m9.2 16.2-4-4L3.8 13.6l5.4 5.4L20.6 7.6 19.2 6.2 9.2 16.2Z" />
              </svg>
              Guardar Propietario
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
const showOwnerModal = ref(false);

const owners = ref([]);
const vehicle = ref({
  placa: "",
  marca: "",
  modelo: "",
  año: new Date().getFullYear(),
  color: "",
  km_actual: 0,
  estado: "activo",
  owner_id: "",
});

const newOwner = ref({
  nombre: "",
  apellido: "",
  documento: "",
  telefono: "",
  email: "",
  direccion: "",
});

const loadOwners = async () => {
  try {
    const response = await api.get("/owners");
    owners.value = response.data;
  } catch (error) {
    errorMessage.value = "Error al cargar propietarios";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const loadVehicle = async () => {
  try {
    const response = await api.get(`/vehicles/${route.params.id}`);
    vehicle.value = response.data;
  } catch (error) {
    errorMessage.value = "Error al cargar vehículo";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const saveVehicle = async () => {
  try {
    errorMessage.value = "";

    if (!vehicle.value.owner_id) {
      errorMessage.value = "Debes seleccionar un propietario";
      setTimeout(() => {
        errorMessage.value = "";
      }, 3000);
      return;
    }

    if (isEdit.value) {
      await api.put(`/vehicles/${route.params.id}`, vehicle.value);
      successMessage.value = "Vehículo actualizado exitosamente";

      setTimeout(() => {
        successMessage.value = "";
        router.push("/vehicles"); // 👈 Redireccionar después de editar
      }, 1500);
    } else {
      await api.post("/vehicles", vehicle.value);
      successMessage.value = "Vehículo creado exitosamente";

      setTimeout(() => {
        successMessage.value = "";
        router.push("/vehicles"); // 👈 Redireccionar después de crear
      }, 1500);
    }
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error || "Error al guardar vehículo";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const saveOwner = async () => {
  try {
    errorMessage.value = "";

    const response = await api.post("/owners", newOwner.value);

    // Recargar lista de propietarios
    await loadOwners();

    // Seleccionar automáticamente el nuevo propietario
    vehicle.value.owner_id = response.data.owner.id;

    successMessage.value = "Propietario creado exitosamente";
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);

    closeOwnerModal();
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error || "Error al guardar propietario";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const closeOwnerModal = () => {
  showOwnerModal.value = false;
  newOwner.value = {
    nombre: "",
    apellido: "",
    documento: "",
    telefono: "",
    email: "",
    direccion: "",
  };
};

onMounted(async () => {
  await loadOwners();
  if (isEdit.value) {
    await loadVehicle();
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
.btn-add-owner svg,
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

.vehicle-form {
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
.form-group select {
  padding: 10px 14px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #0ea5e9;
}

.form-group input::placeholder {
  color: #475569;
}

/* Color */
.color-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.color-input-group input[type="text"] {
  flex: 1;
}

.color-picker {
  width: 48px;
  height: 48px;
  padding: 2px;
  border: 1px solid #1e293b;
  border-radius: 8px;
  cursor: pointer;
  background: #0f172a;
}

/* Propietario */
.owner-select-group {
  display: flex;
  gap: 12px;
}

.owner-select-group select {
  flex: 1;
}

.btn-add-owner {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 8px;
  color: #34d399;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-add-owner:hover {
  background: rgba(16, 185, 129, 0.25);
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

/* ===== MODAL PROPIETARIO ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  padding: 32px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header h2 i {
  color: #38bdf8;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 8px;
  color: #94a3b8;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  background: rgba(244, 63, 94, 0.2);
  color: #fb7185;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-grid-modal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 640px) {
  .form-grid-modal {
    grid-template-columns: 1fr;
  }
}

.form-grid-modal .form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-grid-modal .form-group.full-width {
  grid-column: 1 / -1;
}

.form-grid-modal .form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-grid-modal .form-group label .required {
  color: #fb7185;
}

.form-grid-modal .form-group input {
  padding: 10px 14px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.form-grid-modal .form-group input:focus {
  border-color: #0ea5e9;
}

.form-grid-modal .form-group input::placeholder {
  color: #475569;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 16px;
  border-top: 1px solid #1e293b;
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

  .vehicle-form {
    gap: 18px;
  }

  .form-grid {
    gap: 14px;
  }

  .form-group input,
  .form-group select,
  .btn-add-owner,
  .btn-cancel,
  .btn-save {
    min-height: 44px;
  }

  .owner-select-group,
  .form-actions,
  .modal-actions {
    flex-direction: column;
  }

  .btn-add-owner,
  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }

  .color-input-group {
    align-items: stretch;
  }

  .color-picker {
    width: 54px;
    height: auto;
    min-height: 44px;
  }

  .modal-overlay {
    align-items: flex-end;
    padding: 10px;
  }

  .modal-content {
    max-height: 88vh;
    padding: 18px;
    border-radius: 16px 16px 10px 10px;
  }

  .modal-header h2 {
    font-size: 18px;
  }
}
</style>
