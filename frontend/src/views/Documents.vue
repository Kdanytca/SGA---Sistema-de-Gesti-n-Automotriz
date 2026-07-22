<template>
  <div class="page-container">
    <Navbar />

    <div class="page-content">
      <!-- Header -->
      <div class="header-card">
        <div class="header-left">
          <div class="header-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.8V8h4.2L13 3.8ZM7 13h2.2a2 2 0 0 1 0 4H8v2H7v-6Zm1 1v2h1.2a1 1 0 0 0 0-2H8Zm4 0h1.2a2.8 2.8 0 0 1 0 5H12v-5Zm1 1v3h.2a1.8 1.8 0 0 0 0-3H13Zm4 0v1h2v1h-2v2h-1v-5h3v1h-2Z" />
            </svg>
          </div>
          <div>
            <h1>Facturas / Documentos</h1>
            <p>Consulta facturas y documentos vinculados a los mantenimientos de cada vehículo.</p>
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

      <!-- Filtros -->
      <div class="filters-container">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Propietario</label>
            <div class="owner-search field-with-clear">
              <input
                v-model="ownerSearch"
                type="text"
                placeholder="Nombre, apellido o documento"
                @focus="showOwnerResults = true"
                @input="onOwnerSearchInput"
              />
              <button
                v-if="selectedOwnerId"
                type="button"
                class="btn-clear-field"
                title="Limpiar propietario"
                @click="clearOwnerSelection"
              >
                ×
              </button>
              <div v-if="showOwnerResults" class="owner-results">
                <button
                  v-for="owner in filteredOwnerOptions"
                  :key="owner.id"
                  type="button"
                  class="owner-option"
                  @click="selectOwner(owner)"
                >
                  <strong>{{ owner.nombre }} {{ owner.apellido }}</strong>
                  <span>{{ owner.documento }}</span>
                </button>
                <div v-if="filteredOwnerOptions.length === 0" class="owner-empty">
                  No se encontraron propietarios
                </div>
              </div>
            </div>
          </div>

          <div class="filter-group">
            <label>Vehículo</label>
            <div class="field-with-clear">
              <select v-model="selectedVehicleId" :disabled="!selectedOwnerId" @change="onVehicleChange">
                <option value="">Seleccionar vehículo</option>
                <option v-for="v in filteredVehicles" :key="v.id" :value="v.id">
                  {{ v.placa }} - {{ v.marca }} {{ v.modelo }}
                </option>
              </select>
              <button
                v-if="selectedVehicleId"
                type="button"
                class="btn-clear-field"
                title="Limpiar vehículo"
                @click="clearVehicleSelection"
              >
                ×
              </button>
            </div>
          </div>
          <div class="filter-group">
            <label>Mantenimiento</label>
            <div class="field-with-clear">
              <select v-model="selectedMaintenanceId" :disabled="!selectedVehicleId" @change="loadDocuments">
                <option value="">Seleccionar mantenimiento</option>
                <option v-for="m in maintenances" :key="m.id" :value="m.id">
                  #{{ m.id }} - {{ m.tipo }} - {{ formatDate(m.fecha_programada) }}
                </option>
              </select>
              <button
                v-if="selectedMaintenanceId"
                type="button"
                class="btn-clear-field"
                title="Limpiar mantenimiento"
                @click="clearMaintenanceSelection"
              >
                ×
              </button>
            </div>
          </div>
          <div class="filter-group">
            <label>Buscar</label>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Placa, marca, modelo, pieza o documento"
              :disabled="!selectedMaintenanceId"
            />
          </div>
          <div class="filter-group" style="justify-content: flex-end;">
            <button
              @click="openUploadModal"
              class="btn-upload"
              :disabled="!selectedMaintenanceId"
              :class="{ 'btn-upload-disabled': !selectedMaintenanceId }"
            >
              <i class="fa-solid fa-upload"></i> Subir Documento
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla de Documentos -->
      <div class="table-container">
        <div class="table-wrapper">
          <table class="documents-table">
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Mantenimiento</th>
                <th>Nombre del Archivo</th>
                <th>Pieza / Referencia</th>
                <th>Garantía hasta</th>
                <th>Subido por</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="doc in filteredDocuments" :key="doc.id" class="table-row">
                <td data-label="Vehículo">{{ selectedVehicleLabel }}</td>
                <td data-label="Mantenimiento">{{ selectedMaintenanceLabel }}</td>
                <td data-label="Archivo" class="font-medium text-white">
                  <i class="fa-solid fa-file-pdf text-rose-400 mr-2"></i>
                  {{ doc.nombre_original }}
                  <span class="file-meta">{{ formatFileSize(doc.tamaño) }}</span>
                </td>
                <td data-label="Pieza / Referencia">
                  <span>{{ doc.pieza_descripcion || '-' }}</span>
                </td>
                <td data-label="Garantía hasta">
                  <span v-if="doc.garantia_hasta" class="warranty-badge">
                    {{ formatShortDate(doc.garantia_hasta) }}
                  </span>
                  <span v-else>-</span>
                </td>
                <td data-label="Subido por">{{ doc.user?.nombre || '-' }}</td>
                <td data-label="Acciones" class="text-right actions-cell">
                  <button @click="viewDocument(doc.id)" class="btn-action btn-view">
                    Ver PDF
                  </button>
                  <button @click="downloadDocument(doc.id)" class="btn-action btn-download">
                    Descargar
                  </button>
                  <button v-if="authStore.isAdmin" @click="openDeleteModal(doc.id)" class="btn-action btn-delete" title="Eliminar documento">
                    <svg class="action-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-.7 11.2A2 2 0 0 1 14.3 22H9.7a2 2 0 0 1-2-1.8L7 9Zm3 2v8h2v-8h-2Zm4 0v8h2v-8h-2Z" />
                    </svg>
                  </button>
                </td>
              </tr>

              <tr v-if="filteredDocuments.length === 0 && selectedMaintenanceId">
                <td colspan="7" class="empty-state">
                  <i class="fa-solid fa-file-circle-plus text-3xl"></i>
                  <span>No hay documentos que coincidan con la consulta.</span>
                  <span class="empty-hint">Haz clic en "Subir Documento" para agregar uno.</span>
                </td>
              </tr>

              <tr v-if="!selectedMaintenanceId">
                <td colspan="7" class="empty-state">
                  <i class="fa-solid fa-hand-pointer text-3xl"></i>
                  <span>Selecciona propietario, vehículo y mantenimiento para ver sus documentos.</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Subir Documento -->
    <div v-if="showUploadModal" class="modal-overlay" @click.self="closeUploadModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2><i class="fa-solid fa-upload"></i> Subir Documento</h2>
          <button @click="closeUploadModal" class="modal-close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <form @submit.prevent="uploadDocument" class="modal-form">
          <div class="form-group">
            <label>Mantenimiento</label>
            <input
              type="text"
              :value="`#${selectedMaintenanceId} - ${getMaintenanceInfo()}`"
              disabled
              class="input-disabled"
            />
          </div>

          <div class="form-group">
            <label>Archivo <span class="required">*</span></label>
            <div class="file-upload-area" @dragover.prevent @drop.prevent="handleDrop">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileSelect"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                class="file-input"
              />
              <div v-if="!selectedFile" class="file-placeholder">
                <i class="fa-solid fa-cloud-upload-alt"></i>
                <p>Arrastra un archivo o haz clic para seleccionar</p>
                <span class="file-hint">PDF, JPG, PNG, DOC (máx. 10MB)</span>
              </div>
              <div v-else class="file-selected">
                <i class="fa-solid fa-file-pdf text-rose-400"></i>
                <span>{{ selectedFile.name }}</span>
                <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
                <button type="button" @click="removeFile" class="file-remove">
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="optional-actions">
            <button
              v-if="!showPieceField"
              type="button"
              class="btn-optional"
              @click="showPieceField = true"
            >
              Agregar nombre pieza/referencia
            </button>

            <button
              v-if="!showDateField"
              type="button"
              class="btn-optional"
              @click="showDateField = true"
            >
              Agregar fecha
            </button>
          </div>

          <div v-if="showPieceField" class="form-group">
            <label>Pieza / Referencia</label>
            <input v-model="uploadForm.pieza_descripcion" type="text" placeholder="Ej: Batería, alternador, pastillas" />
          </div>

          <div v-if="showDateField" class="form-group">
            <label>Garantía hasta</label>
            <div class="date-picker-row">
              <input
                ref="warrantyDateInput"
                v-model="uploadForm.garantia_hasta"
                type="date"
              />
              <button type="button" class="btn-date-picker" @click="openWarrantyDatePicker">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 2h2v3h6V2h2v3h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10ZM4 8h16V7H4v1Zm3 4h3v3H7v-3Zm5 0h3v3h-3v-3Z" />
                </svg>
                Seleccionar fecha
              </button>
            </div>
            <span class="input-hint">Puedes escribir la fecha o usar el botón para abrir el calendario.</span>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeUploadModal" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-save" :disabled="!selectedFile">
              <i class="fa-solid fa-check"></i> Subir Documento
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal
      v-if="documentToDelete"
      title="Eliminar documento"
      message="Esta accion eliminara el documento seleccionado y su archivo asociado si existe. No podras deshacer este cambio."
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      @confirm="deleteDocument"
      @cancel="closeDeleteModal"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth'
import Navbar from '../components/Navbar.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import api from '../api'

const route = useRoute()
const authStore = useAuthStore()

const vehicles = ref([])
const maintenances = ref([])
const documents = ref([])
const selectedOwnerId = ref('')
const selectedVehicleId = ref('')
const selectedMaintenanceId = ref('')
const ownerSearch = ref('')
const showOwnerResults = ref(false)
const searchTerm = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const documentToDelete = ref(null)

// Upload
const showUploadModal = ref(false)
const showPieceField = ref(false)
const showDateField = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)
const warrantyDateInput = ref(null)
const uploadForm = ref({
  pieza_descripcion: '',
  garantia_hasta: ''
})

const selectedVehicleLabel = computed(() => {
  const vehicle = selectedVehicle.value
  if (!vehicle) return '-'
  return `${vehicle.placa} - ${vehicle.marca} ${vehicle.modelo}`
})

const ownerOptions = computed(() => {
  const ownersById = new Map()

  vehicles.value.forEach((vehicle) => {
    if (vehicle.Owner && !ownersById.has(vehicle.Owner.id)) {
      ownersById.set(vehicle.Owner.id, vehicle.Owner)
    }
  })

  return [...ownersById.values()].sort((a, b) => {
    return `${a.nombre} ${a.apellido}`.localeCompare(`${b.nombre} ${b.apellido}`)
  })
})

const filteredOwnerOptions = computed(() => {
  const term = ownerSearch.value.trim().toLowerCase()
  if (!term) return ownerOptions.value

  return ownerOptions.value.filter((owner) => {
    return [
      owner.nombre,
      owner.apellido,
      owner.documento,
      `${owner.nombre} ${owner.apellido}`,
    ].some((value) => value?.toLowerCase().includes(term))
  })
})

const filteredVehicles = computed(() => {
  if (!selectedOwnerId.value) return []
  return vehicles.value.filter((vehicle) => vehicle.owner_id === parseInt(selectedOwnerId.value))
})

const selectedMaintenanceLabel = computed(() => {
  const maintenance = selectedMaintenance.value
  if (!maintenance) return '-'
  return `#${maintenance.id} - ${maintenance.tipo}`
})

const selectedVehicle = computed(() => {
  return vehicles.value.find((v) => v.id === parseInt(selectedVehicleId.value))
})

const selectedMaintenance = computed(() => {
  return maintenances.value.find((m) => m.id === parseInt(selectedMaintenanceId.value))
})

const filteredDocuments = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return documents.value

  return documents.value.filter((doc) => {
    const vehicle = selectedVehicle.value
    const maintenance = selectedMaintenance.value

    return [
      doc.nombre_original,
      doc.pieza_descripcion,
      vehicle?.placa,
      vehicle?.marca,
      vehicle?.modelo,
      selectedVehicleLabel.value,
      maintenance?.tipo,
      maintenance?.descripcion,
      selectedMaintenanceLabel.value,
    ].some((value) => value?.toLowerCase().includes(term))
  })
})

// Cargar vehículos
const loadVehicles = async () => {
  try {
    const response = await api.get('/vehicles')
    vehicles.value = response.data

    if (route.query.maintenance_id) {
      await selectContextByMaintenance(parseInt(route.query.maintenance_id))
    }
  } catch (error) {
    errorMessage.value = 'Error al cargar vehículos'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

const selectContextByMaintenance = async (maintenanceId) => {
  try {
    const response = await api.get(`/maintenances/${maintenanceId}`)
    const maintenance = response.data
    const vehicle = vehicles.value.find((item) => item.id === maintenance.vehicle_id)

    if (!vehicle) return

    selectOwner(vehicle.Owner)
    selectedVehicleId.value = vehicle.id
    await loadMaintenances(vehicle.id)
    selectedMaintenanceId.value = maintenance.id
    await loadDocuments()
    openUploadModal()
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error al preparar subida de factura'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

const selectOwner = (owner) => {
  selectedOwnerId.value = owner.id
  ownerSearch.value = `${owner.nombre} ${owner.apellido} - ${owner.documento}`
  showOwnerResults.value = false
  clearVehicleSelection()
}

const clearOwnerSelection = () => {
  selectedOwnerId.value = ''
  ownerSearch.value = ''
  showOwnerResults.value = false
  clearVehicleSelection()
}

const clearVehicleSelection = () => {
  selectedVehicleId.value = ''
  clearMaintenanceSelection()
  maintenances.value = []
}

const clearMaintenanceSelection = () => {
  selectedMaintenanceId.value = ''
  documents.value = []
  searchTerm.value = ''
}

const onOwnerSearchInput = () => {
  showOwnerResults.value = true
  selectedOwnerId.value = ''
  selectedVehicleId.value = ''
  selectedMaintenanceId.value = ''
  maintenances.value = []
  documents.value = []
  searchTerm.value = ''
}

// Cargar mantenimientos de un vehículo
const loadMaintenances = async (vehicleId) => {
  try {
    if (!vehicleId) {
      maintenances.value = []
      selectedMaintenanceId.value = ''
      return
    }
    const response = await api.get(`/maintenances/vehicle/${vehicleId}`)
    maintenances.value = response.data
    selectedMaintenanceId.value = ''
    documents.value = []
  } catch (error) {
    errorMessage.value = 'Error al cargar mantenimientos'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

// Cargar documentos de un mantenimiento
const loadDocuments = async () => {
  try {
    if (!selectedMaintenanceId.value) {
      documents.value = []
      return
    }
    const response = await api.get(`/documents/maintenance/${selectedMaintenanceId.value}`)
    documents.value = response.data
  } catch (error) {
    errorMessage.value = 'Error al cargar documentos'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

// Eventos
const onVehicleChange = () => {
  searchTerm.value = ''
  loadMaintenances(selectedVehicleId.value)
}

const getMaintenanceInfo = () => {
  const maintenance = maintenances.value.find(m => m.id === parseInt(selectedMaintenanceId.value))
  if (!maintenance) return ''
  return `${maintenance.tipo} - ${formatDate(maintenance.fecha_programada)}`
}

// Subir documento
const openUploadModal = () => {
  if (!selectedMaintenanceId.value) return
  showUploadModal.value = true
  selectedFile.value = null
  resetUploadForm()
}

const closeUploadModal = () => {
  showUploadModal.value = false
  selectedFile.value = null
  showPieceField.value = false
  showDateField.value = false
  resetUploadForm()
}

const resetUploadForm = () => {
  uploadForm.value = {
    pieza_descripcion: '',
    garantia_hasta: ''
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const openWarrantyDatePicker = () => {
  if (!warrantyDateInput.value) return

  if (typeof warrantyDateInput.value.showPicker === 'function') {
    warrantyDateInput.value.showPicker()
    return
  }

  warrantyDateInput.value.focus()
}

const uploadDocument = async () => {
  try {
    if (!selectedFile.value) {
      errorMessage.value = 'Debes seleccionar un archivo'
      setTimeout(() => {
        errorMessage.value = ''
      }, 3000)
      return
    }

    const formData = new FormData()
    formData.append('archivo', selectedFile.value)
    formData.append('maintenance_id', selectedMaintenanceId.value)
    formData.append('pieza_descripcion', showPieceField.value ? uploadForm.value.pieza_descripcion : '')
    formData.append('garantia_hasta', showDateField.value ? uploadForm.value.garantia_hasta : '')

    await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    successMessage.value = 'Documento subido exitosamente'
    closeUploadModal()
    loadDocuments()

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Error al subir documento'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

const openBlob = (response) => {
  const url = window.URL.createObjectURL(new Blob([response.data], {
    type: response.headers['content-type'] || 'application/pdf'
  }))

  return url
}

const viewDocument = async (id) => {
  try {
    const response = await api.get(`/documents/view/${id}`, {
      responseType: 'blob'
    })

    const url = openBlob(response)
    window.open(url, '_blank', 'noopener,noreferrer')

    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 1000)
  } catch (error) {
    errorMessage.value = 'Error al abrir documento'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

// Descargar documento
const downloadDocument = async (id) => {
  try {
    const response = await api.get(`/documents/download/${id}`, {
      responseType: 'blob'
    })

    const url = openBlob(response)
    const link = document.createElement('a')
    link.href = url

    // Obtener nombre del archivo de la respuesta
    const contentDisposition = response.headers['content-disposition']
    let filename = 'documento.pdf'
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/)
      if (match) filename = match[1]
    }

    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    errorMessage.value = 'Error al descargar documento'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

// Eliminar documento
const openDeleteModal = (id) => {
  documentToDelete.value = id
}

const closeDeleteModal = () => {
  documentToDelete.value = null
}

const deleteDocument = async () => {
  try {
    await api.delete(`/documents/${documentToDelete.value}`)
    successMessage.value = 'Documento eliminado exitosamente'
    closeDeleteModal()
    loadDocuments()

    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    closeDeleteModal()
    errorMessage.value = error.response?.data?.error || 'Error al eliminar documento'
    setTimeout(() => {
      errorMessage.value = ''
    }, 3000)
  }
}

// Utilidades
const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatShortDate = (date) => {
  if (!date) return '-'
  const d = new Date(`${date}T00:00:00`)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '-'
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
}

onMounted(() => {
  loadVehicles()
})
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
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f87171;
}

.header-icon svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
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
  grid-template-columns: 1.4fr 1.2fr 1.2fr 1fr auto;
  gap: 16px;
  align-items: end;
}

@media (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }
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

.filter-group select,
.filter-group input {
  width: 100%;
  padding: 8px 12px;
  background: #1e293b;
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: white;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.filter-group select:focus,
.filter-group input:focus {
  border-color: #0ea5e9;
}

.filter-group select:disabled,
.filter-group input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.filter-group input::placeholder {
  color: #64748b;
}

.field-with-clear {
  position: relative;
}

.field-with-clear select,
.field-with-clear input {
  padding-right: 36px;
}

.btn-clear-field {
  position: absolute;
  right: 8px;
  top: 50%;
  z-index: 25;
  width: 22px;
  height: 22px;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 999px;
  background: rgba(51, 65, 85, 0.9);
  color: #cbd5e1;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear-field:hover {
  background: rgba(244, 63, 94, 0.2);
  color: #fb7185;
}

.owner-search {
  position: relative;
}

.owner-results {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 6px);
  z-index: 20;
  max-height: 240px;
  overflow-y: auto;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.32);
  padding: 6px;
}

.owner-option {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 9px 10px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #e2e8f0;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
}

.owner-option:hover {
  background: rgba(30, 41, 59, 0.75);
}

.owner-option strong {
  font-size: 13px;
}

.owner-option span,
.owner-empty {
  color: #94a3b8;
  font-size: 12px;
}

.owner-empty {
  padding: 10px;
}

.btn-upload {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #0ea5e9;
  color: #0f172a;
  font-weight: 600;
  font-size: 13px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-upload:hover:not(.btn-upload-disabled) {
  background: #0284c7;
  transform: scale(0.98);
}

.btn-upload-disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.documents-table {
  width: 100%;
  text-align: left;
  font-size: 14px;
  border-collapse: collapse;
}

.documents-table thead {
  background: rgba(15, 23, 42, 0.5);
  border-bottom: 1px solid #1e293b;
}

.documents-table thead th {
  padding: 14px 16px;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.documents-table tbody td {
  padding: 14px 16px;
  color: #cbd5e1;
  vertical-align: top;
}

.file-meta {
  display: block;
  color: #64748b;
  font-size: 11px;
  margin-top: 4px;
  max-width: 260px;
}

.warranty-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  color: #38bdf8;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
  font-size: 12px;
  font-weight: 600;
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

.btn-view {
  color: #38bdf8;
}

.btn-view:hover {
  background: rgba(14, 165, 233, 0.2);
  border-color: rgba(14, 165, 233, 0.3);
}

.btn-download {
  color: #34d399;
}

.btn-download:hover {
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
  display: block;
  font-size: 14px;
  font-weight: 500;
}

.empty-hint {
  font-size: 12px !important;
  font-weight: 400 !important;
  color: #475569;
  margin-top: 4px;
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

  .btn-upload {
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

  .documents-table,
  .documents-table thead,
  .documents-table tbody,
  .documents-table tr,
  .documents-table td {
    display: block;
    width: 100%;
  }

  .documents-table thead {
    display: none;
  }

  .documents-table tbody {
    display: grid;
    gap: 12px;
  }

  .documents-table tbody tr.table-row {
    background: #1e293b;
    border: 1px solid rgba(30, 41, 59, 0.8);
    border-radius: 14px;
    padding: 12px;
  }

  .documents-table tbody td {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(30, 41, 59, 0.55);
    text-align: right;
  }

  .documents-table tbody td::before {
    content: attr(data-label);
    color: #94a3b8;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    text-align: left;
  }

  .documents-table tbody td:last-child {
    border-bottom: none;
  }

  .documents-table .font-medium {
    align-items: flex-end;
    flex-direction: column;
  }

  .actions-cell {
    justify-content: stretch;
  }

  .actions-cell::before {
    display: none;
  }

  .documents-table tbody td.empty-state {
    display: block;
    text-align: center;
    border-bottom: none;
  }

  .documents-table tbody td.empty-state::before {
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

.optional-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-optional {
  border: 1px dashed rgba(14, 165, 233, 0.45);
  background: rgba(14, 165, 233, 0.08);
  color: #38bdf8;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-optional:hover {
  background: rgba(14, 165, 233, 0.16);
  border-color: rgba(14, 165, 233, 0.7);
}

.form-grid-modal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 640px) {
  .form-grid-modal {
    grid-template-columns: 1fr;
  }
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

.modal-form .form-group label .required {
  color: #fb7185;
}

.modal-form .form-group input {
  padding: 10px 14px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.modal-form .form-group input:focus {
  border-color: #0ea5e9;
}

.modal-form .form-group input::placeholder {
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

.input-disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* File Upload */
.file-upload-area {
  position: relative;
  border: 2px dashed #1e293b;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  transition: border-color 0.3s;
  cursor: pointer;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-upload-area:hover {
  border-color: #0ea5e9;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.file-placeholder i {
  font-size: 40px;
  color: #475569;
  display: block;
  margin-bottom: 8px;
}

.file-placeholder p {
  color: #94a3b8;
  font-size: 14px;
  margin: 0;
}

.file-hint {
  display: block;
  font-size: 12px;
  color: #475569;
  margin-top: 4px;
}

.file-selected {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #0f172a;
  border-radius: 8px;
  border: 1px solid #1e293b;
}

.file-selected i {
  font-size: 24px;
}

.file-selected span {
  color: white;
}

.file-size {
  color: #64748b;
  font-size: 12px;
}

.file-remove {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.file-remove:hover {
  color: #fb7185;
  background: rgba(244, 63, 94, 0.1);
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
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

.btn-save:hover:not(:disabled) {
  background: #0284c7;
  transform: scale(0.98);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
