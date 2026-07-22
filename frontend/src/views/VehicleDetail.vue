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
            <h1>Historial del Vehículo</h1>
            <p>Resumen de mantenimientos, kilometraje y facturas vinculadas.</p>
          </div>
        </div>

        <div class="header-actions">
          <router-link :to="`/maintenances/new?vehicle_id=${route.params.id}`" class="btn-primary">
            Nuevo mantenimiento
          </router-link>
          <button type="button" @click="router.back()" class="btn-secondary">
            Volver
          </button>
        </div>
      </div>

      <div v-if="errorMessage" class="alert-error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <template v-if="vehicle">
        <div class="detail-grid">
          <section class="vehicle-card main-card">
            <div class="vehicle-heading">
              <div>
                <span class="plate-label">Placa</span>
                <h2>{{ vehicle.placa }}</h2>
                <p>{{ vehicle.marca }} {{ vehicle.modelo }} · {{ vehicle.año }}</p>
              </div>
              <span class="status-badge" :class="`status-${vehicle.estado}`">
                {{ formatVehicleStatus(vehicle.estado) }}
              </span>
            </div>

            <div class="info-list">
              <div class="info-item">
                <span>Propietario</span>
                <router-link v-if="vehicle.Owner" :to="`/owners/${vehicle.Owner.id}`">
                  {{ vehicle.Owner.nombre }} {{ vehicle.Owner.apellido }}
                </router-link>
                <strong v-else>-</strong>
              </div>
              <div class="info-item">
                <span>Kilometraje actual</span>
                <strong>{{ vehicle.km_actual?.toLocaleString() || 0 }} km</strong>
              </div>
              <div class="info-item">
                <span>Color</span>
                <strong>{{ vehicle.color }}</strong>
              </div>
            </div>
          </section>

          <section class="summary-grid">
            <div class="summary-card">
              <span>Mantenimientos</span>
              <strong>{{ maintenances.length }}</strong>
            </div>
            <div class="summary-card">
              <span>Documentos</span>
              <strong>{{ documentsCount }}</strong>
            </div>
            <div class="summary-card">
              <span>Costo registrado</span>
              <strong>${{ totalCost.toFixed(2) }}</strong>
            </div>
          </section>
        </div>

        <section class="history-section">
          <div class="section-header">
            <h2>Mantenimientos</h2>
            <p>Historial ordenado por fecha programada.</p>
          </div>

          <div v-if="maintenances.length" class="maintenance-list">
            <article v-for="maintenance in maintenances" :key="maintenance.id" class="maintenance-card">
              <div class="maintenance-top">
                <div>
                  <span class="type-badge" :class="`type-${maintenance.tipo}`">
                    {{ formatMaintenanceType(maintenance.tipo) }}
                  </span>
                  <h3>{{ maintenance.descripcion }}</h3>
                </div>
                <span class="status-badge" :class="`status-${maintenance.estado}`">
                  {{ formatMaintenanceStatus(maintenance.estado) }}
                </span>
              </div>

              <div class="maintenance-meta">
                <span>Programado: {{ formatDate(maintenance.fecha_programada) }}</span>
                <span>Realizado: {{ formatDate(maintenance.fecha_realizacion) }}</span>
                <span>KM: {{ maintenance.km_en_mantenimiento?.toLocaleString() || '-' }}</span>
                <span>Costo: {{ maintenance.costo ? '$' + parseFloat(maintenance.costo).toFixed(2) : '-' }}</span>
                <span>Mecánico: {{ maintenance.User?.nombre || '-' }}</span>
              </div>

              <div class="maintenance-actions">
                <router-link :to="`/maintenances/edit/${maintenance.id}`" class="btn-action btn-edit">
                  Editar mantenimiento
                </router-link>
                <router-link :to="`/documents?maintenance_id=${maintenance.id}`" class="btn-action btn-upload-invoice">
                  Subir factura
                </router-link>
              </div>

              <div class="documents-block">
                <h4>Facturas / Documentos</h4>
                <div v-if="maintenance.documents?.length" class="documents-list">
                  <div v-for="doc in maintenance.documents" :key="doc.id" class="document-row">
                    <div>
                      <strong>{{ doc.nombre_original }}</strong>
                      <span>{{ doc.pieza_descripcion || 'Sin pieza/referencia' }}</span>
                      <span v-if="doc.garantia_hasta">Garantía hasta: {{ formatShortDate(doc.garantia_hasta) }}</span>
                    </div>
                    <div class="document-actions">
                      <button type="button" class="btn-action btn-view" @click="viewDocument(doc.id)">
                        Ver PDF
                      </button>
                      <button type="button" class="btn-action btn-download" @click="downloadDocument(doc.id)">
                        Descargar
                      </button>
                    </div>
                  </div>
                </div>
                <p v-else class="empty-documents">Sin documentos asociados.</p>
              </div>
            </article>
          </div>

          <div v-else class="empty-state">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.1 5.6a5.9 5.9 0 0 1-7.4 7.4l-6.8 6.8a2.4 2.4 0 0 1-3.4-3.4l6.8-6.8A5.9 5.9 0 0 1 17.7 2.2l-3.1 3.1 4.4 4.4 3.1-3.1c-.2-.35-.55-.8-1-1Z" />
            </svg>
            <span>No hay mantenimientos registrados para este vehículo.</span>
          </div>
        </section>
      </template>
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
const vehicle = ref(null);
const errorMessage = ref("");

const maintenances = computed(() => {
  return [...(vehicle.value?.Maintenances || [])].sort((a, b) => {
    return new Date(b.fecha_programada) - new Date(a.fecha_programada);
  });
});
const documentsCount = computed(() => maintenances.value.reduce((total, item) => total + (item.documents?.length || 0), 0));
const totalCost = computed(() => maintenances.value.reduce((total, item) => total + (item.costo ? parseFloat(item.costo) : 0), 0));

const loadVehicle = async () => {
  try {
    const response = await api.get(`/vehicles/${route.params.id}`);
    vehicle.value = response.data;
  } catch (error) {
    errorMessage.value = error.response?.data?.error || "Error al cargar historial del vehículo";
  }
};

const formatVehicleStatus = (status) => {
  if (status === "activo") return "Activo";
  if (status === "mantenimiento") return "En mantenimiento";
  return "Inactivo";
};

const formatMaintenanceStatus = (status) => {
  if (status === "pendiente") return "Pendiente";
  if (status === "en_progreso") return "En progreso";
  if (status === "completado") return "Completado";
  return "Cancelado";
};

const formatMaintenanceType = (type) => {
  if (type === "preventivo") return "Preventivo";
  if (type === "correctivo") return "Correctivo";
  if (type === "inspeccion") return "Inspección";
  return "General";
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

const formatShortDate = (date) => {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const openBlob = (response) => {
  return window.URL.createObjectURL(new Blob([response.data], {
    type: response.headers["content-type"] || "application/pdf",
  }));
};

const viewDocument = async (id) => {
  try {
    const response = await api.get(`/documents/view/${id}`, { responseType: "blob" });
    const url = openBlob(response);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  } catch (error) {
    errorMessage.value = "Error al abrir documento";
  }
};

const downloadDocument = async (id) => {
  try {
    const response = await api.get(`/documents/download/${id}`, { responseType: "blob" });
    const url = openBlob(response);
    const link = document.createElement("a");
    const contentDisposition = response.headers["content-disposition"];
    let filename = "documento.pdf";

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
    }

    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    errorMessage.value = "Error al descargar documento";
  }
};

onMounted(() => {
  loadVehicle();
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

@media (min-width: 760px) {
  .header-card {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.header-left,
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
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

.btn-primary,
.btn-secondary,
.btn-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  padding: 10px 14px;
  background: #0ea5e9;
  border: none;
  color: #0f172a;
}

.btn-secondary {
  padding: 10px 14px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #cbd5e1;
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
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 18px;
  margin-bottom: 24px;
}

@media (max-width: 980px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.vehicle-card,
.summary-card,
.history-section,
.maintenance-card {
  background: #0f172a;
  border: 1px solid rgba(30, 41, 59, 0.75);
  border-radius: 14px;
  padding: 18px;
}

.vehicle-heading,
.maintenance-top {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
}

.plate-label {
  color: #94a3b8;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.vehicle-heading h2 {
  color: white;
  font-size: 36px;
  margin: 4px 0;
}

.vehicle-heading p {
  color: #94a3b8;
}

.info-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
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

.info-item span,
.summary-card span {
  display: block;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.info-item strong,
.info-item a {
  color: #e2e8f0;
  font-weight: 700;
  text-decoration: none;
}

.info-item a:hover {
  color: #38bdf8;
}

.summary-grid {
  display: grid;
  gap: 12px;
}

.summary-card strong {
  color: white;
  font-size: 28px;
}

.section-header {
  margin-bottom: 16px;
}

.maintenance-list {
  display: grid;
  gap: 14px;
}

.maintenance-card {
  background: #1e293b;
}

.maintenance-top h3 {
  color: white;
  margin-top: 8px;
  font-size: 16px;
}

.maintenance-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 8px;
  color: #cbd5e1;
  font-size: 13px;
  margin: 16px 0;
}

.maintenance-actions,
.document-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.documents-block {
  border-top: 1px solid rgba(51, 65, 85, 0.7);
  padding-top: 14px;
  margin-top: 14px;
}

.documents-block h4 {
  color: white;
  font-size: 14px;
  margin-bottom: 10px;
}

.documents-list {
  display: grid;
  gap: 8px;
}

.document-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(51, 65, 85, 0.55);
  border-radius: 10px;
  padding: 10px;
}

@media (max-width: 700px) {
  .document-row {
    flex-direction: column;
    align-items: flex-start;
  }
}

.document-row strong,
.document-row span {
  display: block;
}

.document-row strong {
  color: white;
  font-size: 13px;
}

.document-row span,
.empty-documents {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 3px;
}

.btn-action {
  padding: 7px 11px;
  border: 1px solid rgba(30, 41, 59, 0.6);
  background: #0f172a;
}

.btn-edit,
.btn-view {
  color: #38bdf8;
}

.btn-download {
  color: #34d399;
}

.btn-upload-invoice {
  color: #fbbf24;
}

.status-badge,
.type-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 800;
}

.status-activo,
.status-completado {
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.status-mantenimiento,
.status-pendiente {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-inactivo,
.status-cancelado {
  color: #fb7185;
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
}

.status-en_progreso,
.type-preventivo {
  color: #38bdf8;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
}

.type-correctivo {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.type-inspeccion {
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.type-general {
  color: #a78bfa;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
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
