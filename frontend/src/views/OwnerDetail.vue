<template>
  <div class="page-container">
    <Navbar />

    <div class="page-content">
      <div class="header-card">
        <div class="header-left">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.4 0-8 2.4-8 5.3V22h16v-2.7c0-2.9-3.6-5.3-8-5.3Z" />
            </svg>
          </div>
          <div>
            <h1>Ficha de Propietario</h1>
            <p>Información del cliente y vehículos registrados en el taller.</p>
          </div>
        </div>

        <button type="button" @click="router.back()" class="btn-secondary">
          Volver
        </button>
      </div>

      <div v-if="errorMessage" class="alert-error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <div v-if="owner" class="detail-grid">
        <section class="owner-card">
          <div class="owner-heading">
            <div class="owner-avatar">
              {{ ownerInitials }}
            </div>
            <div>
              <h2>{{ owner.nombre }} {{ owner.apellido }}</h2>
              <span class="owner-status" :class="owner.activo ? 'status-active' : 'status-inactive'">
                {{ owner.activo ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>

          <div class="info-list">
            <div class="info-item">
              <span>Documento</span>
              <strong>{{ owner.documento }}</strong>
            </div>
            <div class="info-item">
              <span>Teléfono</span>
              <strong>{{ owner.telefono || '-' }}</strong>
            </div>
            <div class="info-item">
              <span>Email</span>
              <strong>{{ owner.email || '-' }}</strong>
            </div>
            <div class="info-item full-width">
              <span>Dirección</span>
              <strong>{{ owner.direccion || '-' }}</strong>
            </div>
          </div>
        </section>

        <section class="summary-card">
          <span class="summary-label">Vehículos asociados</span>
          <strong>{{ vehicles.length }}</strong>
          <p>Unidades registradas a nombre de este propietario.</p>
        </section>
      </div>

      <div v-if="owner" class="vehicles-section">
        <div class="section-header">
          <h2>Vehículos del propietario</h2>
          <p>Accesos rápidos al historial de mantenimientos o edición del vehículo.</p>
        </div>

        <div v-if="vehicles.length" class="vehicles-grid">
          <article v-for="vehicle in vehicles" :key="vehicle.id" class="vehicle-card">
            <div class="vehicle-top">
              <div>
                <h3>{{ vehicle.placa }}</h3>
                <p>{{ vehicle.marca }} {{ vehicle.modelo }} · {{ vehicle.año }}</p>
              </div>
              <span class="status-badge" :class="`status-${vehicle.estado}`">
                {{ formatVehicleStatus(vehicle.estado) }}
              </span>
            </div>

            <div class="vehicle-meta">
              <span>Color: {{ vehicle.color }}</span>
              <span>KM: {{ vehicle.km_actual?.toLocaleString() || 0 }}</span>
            </div>

            <div class="vehicle-actions">
              <router-link :to="`/vehicles/${vehicle.id}`" class="btn-action btn-history">
                Ver historial
              </router-link>
              <router-link :to="`/vehicles/edit/${vehicle.id}`" class="btn-action btn-edit">
                Editar vehículo
              </router-link>
              <router-link :to="{ path: '/maintenances', query: { vehicle_id: vehicle.id } }" class="btn-action btn-maintenance">
                Mantenimientos
              </router-link>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 11 6.7 6.7A3 3 0 0 1 9.5 4.8h5a3 3 0 0 1 2.8 1.9L19 11h1a2 2 0 0 1 2 2v4h-2a2.5 2.5 0 0 1-5 0H9a2.5 2.5 0 0 1-5 0H2v-4a2 2 0 0 1 2-2h1Zm2.2 0h9.6l-1.15-3.05a1.25 1.25 0 0 0-1.15-.8h-5a1.25 1.25 0 0 0-1.15.8L7.2 11ZM6.5 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm11 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
          </svg>
          <span>Este propietario no tiene vehículos asociados.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Navbar from "../components/Navbar.vue";
import api from "../api";

const route = useRoute();
const router = useRouter();
const owner = ref(null);
const errorMessage = ref("");

const vehicles = computed(() => owner.value?.Vehicles || []);

const ownerInitials = computed(() => {
  if (!owner.value) return "--";
  return `${owner.value.nombre?.[0] || ""}${owner.value.apellido?.[0] || ""}`.toUpperCase();
});

const formatVehicleStatus = (status) => {
  if (status === "activo") return "Activo";
  if (status === "mantenimiento") return "En mantenimiento";
  return "Inactivo";
};

const loadOwner = async () => {
  try {
    const response = await api.get(`/owners/${route.params.id}`);
    owner.value = response.data;
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Error al cargar propietario";
  }
};

onMounted(() => {
  loadOwner();
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
.empty-state svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.header-left h1,
.section-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.header-left p,
.section-header p {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.btn-secondary {
  padding: 10px 16px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #cbd5e1;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #334155;
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

.detail-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 18px;
  margin-bottom: 24px;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.owner-card,
.summary-card,
.vehicles-section {
  background: #0f172a;
  border: 1px solid rgba(30, 41, 59, 0.75);
  border-radius: 14px;
  padding: 20px;
}

.owner-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
}

.owner-avatar {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  background: #38bdf8;
  font-weight: 900;
}

.owner-heading h2 {
  font-size: 24px;
  color: white;
  margin-bottom: 6px;
}

.owner-status,
.status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 700;
}

.status-active,
.status-activo {
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-maintenance,
.status-mantenimiento {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-inactive,
.status-inactivo {
  color: #fb7185;
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
}

.info-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 760px) {
  .info-list {
    grid-template-columns: 1fr;
  }
}

.info-item {
  background: rgba(30, 41, 59, 0.45);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 10px;
  padding: 12px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-item span,
.summary-label {
  display: block;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.info-item strong {
  color: #e2e8f0;
  font-size: 14px;
}

.summary-card strong {
  display: block;
  color: white;
  font-size: 42px;
  margin: 6px 0;
}

.summary-card p {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
}

.section-header {
  margin-bottom: 16px;
}

.vehicles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.vehicle-card {
  background: #1e293b;
  border: 1px solid rgba(51, 65, 85, 0.65);
  border-radius: 12px;
  padding: 16px;
}

.vehicle-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.vehicle-top h3 {
  color: white;
  font-size: 20px;
  margin-bottom: 4px;
}

.vehicle-top p,
.vehicle-meta {
  color: #94a3b8;
  font-size: 13px;
}

.vehicle-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 14px 0;
}

.vehicle-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid rgba(30, 41, 59, 0.6);
  background: #0f172a;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-edit {
  color: #38bdf8;
}

.btn-edit:hover {
  background: rgba(14, 165, 233, 0.2);
}

.btn-history {
  color: #a78bfa;
}

.btn-history:hover {
  background: rgba(139, 92, 246, 0.2);
}

.btn-maintenance {
  color: #fbbf24;
}

.btn-maintenance:hover {
  background: rgba(245, 158, 11, 0.2);
}

.empty-state {
  padding: 42px 16px;
  text-align: center;
  color: #64748b;
}

.empty-state svg {
  display: block;
  margin-bottom: 12px;
  color: #334155;
  width: 32px;
  height: 32px;
  margin-left: auto;
  margin-right: auto;
}
</style>
