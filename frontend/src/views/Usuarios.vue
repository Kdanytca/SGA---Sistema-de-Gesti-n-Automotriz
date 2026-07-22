<template>
  <div class="page-container">
    <Navbar />

    <div class="page-content">
      <!-- Header -->
      <div class="header-card">
        <div class="header-left">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0 2c4 0 7 2 7 4.5V20H2v-2.5C2 15 5 13 9 13Zm8.2-.5A3.5 3.5 0 1 1 18 5.6a3.5 3.5 0 0 1-.8 6.9ZM17 13c3 0 5 1.5 5 3.6V20h-4v-2.5c0-1.7-.8-3.1-2.2-4.1.4-.25.8-.4 1.2-.4Z" />
            </svg>
          </div>
          <div>
            <h1>Gestión de Usuarios</h1>
            <p>Listado de todos los usuarios registrados en el sistema.</p>
          </div>
        </div>

        <button @click="showCreateModal = true" class="btn-primary">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
          </svg>
          Nuevo Usuario
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

      <!-- Tabla de Usuarios -->
      <div class="table-container">
        <div class="table-wrapper">
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id" class="table-row">
                <td data-label="ID" class="text-slate-400 font-mono text-xs">{{ user.id }}</td>
                <td data-label="Usuario" class="font-medium text-white">{{ user.nombre }}</td>
                <td data-label="Rol">
                  <span
                    class="role-badge"
                    :class="
                      user.rol === 'admin' ? 'role-admin' : 'role-mecanico'
                    "
                  >
                    {{ user.rol === "admin" ? "Administrador" : "Mecánico" }}
                  </span>
                </td>
                <td data-label="Estado">
                  <span
                    class="status-badge"
                    :class="user.activo ? 'status-active' : 'status-inactive'"
                  >
                    <i class="fa-solid fa-circle text-[6px]"></i>
                    {{ user.activo ? "Activo" : "Inactivo" }}
                  </span>
                </td>
                <td data-label="Acciones" class="text-right actions-cell">
                  <button @click="editUser(user)" class="btn-action btn-edit">
                    <i class="fa-solid fa-pen"></i> Editar
                  </button>

                  <button
                    v-if="user.id !== currentUserId"
                    @click="openStatusModal(user)"
                    class="btn-action btn-delete"
                  >
                    <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 0 0-6.32 12.9L16.9 5.68A7.96 7.96 0 0 0 12 4Zm0 16a8 8 0 0 0 6.32-12.9L7.1 18.32A7.96 7.96 0 0 0 12 20Z" />
                    </svg>
                    {{ user.activo ? "Deshabilitar" : "Habilitar" }}
                  </button>

                  <span v-else class="btn-action btn-current">
                    <i class="fa-solid fa-lock"></i> Cuenta actual
                  </span>
                </td>
              </tr>

              <tr v-if="users.length === 0">
                <td colspan="5" class="empty-state">
                  <i class="fa-solid fa-users-slash text-3xl"></i>
                  <span>No hay usuarios registrados en el sistema.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar Usuario -->
    <div
      v-if="showCreateModal || showEditModal"
      class="modal-overlay"
      @click.self="closeModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditModal ? "Editar Usuario" : "Nuevo Usuario" }}</h2>
          <button @click="closeModal" class="modal-close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form @submit.prevent="saveUser" class="modal-form">
          <div class="form-group">
            <label>Nombre de Usuario</label>
            <input
              v-model="form.nombre"
              type="text"
              required
              placeholder="Ingresa el nombre"
            />
          </div>

          <div class="form-group">
            <label>Correo Electrónico</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div class="form-group" v-if="!showEditModal">
            <label>Contraseña</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div class="form-group" v-else>
            <label>Nueva Contraseña (opcional)</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="Dejar vacío para no cambiar"
            />
          </div>

          <div class="form-group">
            <label>Rol</label>
            <select v-model="form.rol" required>
              <option value="mecanico">Mecánico</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div class="form-group" v-if="showEditModal">
            <label>Estado</label>
            <select v-model="form.activo">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-save">
              <i class="fa-solid fa-check"></i>
              {{ showEditModal ? "Actualizar" : "Crear" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal
      v-if="userToToggle"
      :title="`${userToToggle.activo ? 'Deshabilitar' : 'Habilitar'} usuario`"
      :message="`Esta accion ${userToToggle.activo ? 'deshabilitara' : 'habilitara'} al usuario ${userToToggle.nombre}.`"
      :confirm-text="userToToggle.activo ? 'Deshabilitar' : 'Habilitar'"
      cancel-text="Cancelar"
      @confirm="toggleUserStatus"
      @cancel="closeStatusModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "../store/auth";
import Navbar from "../components/Navbar.vue";
import ConfirmModal from "../components/ConfirmModal.vue";
import api from "../api";

const authStore = useAuthStore();
const users = ref([]);
const successMessage = ref("");
const errorMessage = ref("");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const userToToggle = ref(null);
const currentUserId = computed(() => authStore.user?.id);

const form = ref({
  id: null,
  nombre: "",
  email: "",
  password: "",
  rol: "mecanico",
  activo: true,
});

const loadUsers = async () => {
  try {
    const response = await api.get("/usuarios");
    users.value = response.data;
  } catch (error) {
    errorMessage.value = "Error al cargar usuarios";
  }
};

const saveUser = async () => {
  try {
    if (showEditModal.value) {
      const data = { ...form.value };
      if (!data.password) delete data.password;
      await api.put(`/usuarios/${form.value.id}`, data);
      successMessage.value = "Usuario actualizado exitosamente";
    } else {
      await api.post("/usuarios", form.value);
      successMessage.value = "Usuario creado exitosamente";
    }
    closeModal();
    loadUsers();

    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    errorMessage.value =
      error.response?.data?.error || "Error al guardar usuario";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const editUser = (user) => {
  form.value = {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    password: "",
    rol: user.rol,
    activo: user.activo,
  };
  showEditModal.value = true;
};

const openStatusModal = (user) => {
  userToToggle.value = user;
};

const closeStatusModal = () => {
  userToToggle.value = null;
};

const toggleUserStatus = async () => {
  const user = userToToggle.value;

  try {
    await api.put(`/usuarios/${user.id}`, {
      activo: !user.activo,
    });
    closeStatusModal();
    loadUsers();
    successMessage.value = `Usuario ${user.activo ? "deshabilitado" : "habilitado"} exitosamente`;
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (error) {
    closeStatusModal();
    errorMessage.value = "Error al cambiar estado del usuario";
    setTimeout(() => {
      errorMessage.value = "";
    }, 3000);
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  form.value = {
    id: null,
    nombre: "",
    email: "",
    password: "",
    rol: "mecanico",
    activo: true,
  };
};

onMounted(() => {
  loadUsers();
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

.users-table {
  width: 100%;
  text-align: left;
  font-size: 14px;
  border-collapse: collapse;
}

.users-table thead {
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid #1e293b;
}

.users-table thead th {
  padding: 14px 16px;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.users-table tbody td {
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

/* Badges */
.role-badge {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 20px;
  font-weight: 500;
  border: 1px solid transparent;
}

.role-admin {
  background: rgba(14, 165, 233, 0.1);
  color: #38bdf8;
  border-color: rgba(14, 165, 233, 0.2);
}

.role-mecanico {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.2);
}

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
}

.action-icon {
  width: 14px;
  height: 14px;
  fill: currentColor;
}

.btn-edit {
  color: #38bdf8;
}

.btn-edit:hover {
  background: rgba(14, 165, 233, 0.2);
  border-color: rgba(14, 165, 233, 0.3);
}

.btn-delete {
  color: #fb7185;
}

.btn-delete:hover {
  background: rgba(244, 63, 94, 0.2);
  border-color: rgba(244, 63, 94, 0.3);
}

.btn-current {
  color: #64748b;
  cursor: not-allowed;
  background: rgba(30, 41, 59, 0.4);
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

  .users-table,
  .users-table thead,
  .users-table tbody,
  .users-table tr,
  .users-table td {
    display: block;
    width: 100%;
  }

  .users-table thead {
    display: none;
  }

  .users-table tbody {
    display: grid;
    gap: 12px;
  }

  .users-table tbody tr.table-row {
    background: #1e293b;
    border: 1px solid rgba(30, 41, 59, 0.8);
    border-radius: 14px;
    padding: 12px;
  }

  .users-table tbody td {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(30, 41, 59, 0.55);
    text-align: right;
  }

  .users-table tbody td::before {
    content: attr(data-label);
    color: #94a3b8;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: left;
  }

  .users-table tbody td:last-child {
    border-bottom: none;
  }

  .actions-cell {
    justify-content: stretch;
  }

  .actions-cell::before {
    display: none;
  }

  .users-table tbody td.empty-state {
    display: block;
    text-align: center;
    border-bottom: none;
  }

  .users-table tbody td.empty-state::before {
    display: none;
  }

  .btn-action {
    flex: 1 1 100%;
    justify-content: center;
    padding: 8px 10px;
  }
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
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
  max-width: 500px;
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
  gap: 16px;
}

.modal-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.modal-form .form-group label {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.modal-form .form-group input,
.modal-form .form-group select {
  padding: 10px 14px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.modal-form .form-group input:focus,
.modal-form .form-group select:focus {
  border-color: #0ea5e9;
}

.modal-form .form-group input::placeholder {
  color: #475569;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
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
</style>
