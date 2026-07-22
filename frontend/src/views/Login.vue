<template>
  <div class="login-container">
    <!-- Lado Izquierdo: Branding -->
    <div class="login-left">
      <div class="bg-glow-1"></div>
      <div class="bg-glow-2"></div>

      <div class="brand-content">
        <div class="brand-header">
          <div class="brand-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.2 6.5A3 3 0 0 1 9 4.5h6a3 3 0 0 1 2.8 2l1.05 3H20a2 2 0 0 1 2 2v5h-2.1a3 3 0 0 1-5.8 0H9.9a3 3 0 0 1-5.8 0H2v-5a2 2 0 0 1 2-2h1.15l1.05-3Zm1.9 3h7.8l-.75-2.15A1.25 1.25 0 0 0 14 6.5H10a1.25 1.25 0 0 0-1.15.85L8.1 9.5ZM7 17.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
          </div>
          <div>
            <span class="brand-title">SGA SYSTEM</span>
            <span class="brand-subtitle">Sistema de Gestión Automotriz</span>
          </div>
        </div>

        <div class="brand-text">
          <h1>Control claro para vehículos, mantenimientos y facturas.</h1>
          <p>
            SGA significa Sistema de Gestión Automotriz: una herramienta para
            registrar propietarios, dar seguimiento a vehículos, documentar
            mantenimientos y conservar facturas de forma ordenada.
          </p>
        </div>

        <div class="brand-features">
          <div class="feature-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>Historial de cada vehículo en un solo lugar</span>
          </div>
          <div class="feature-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>Control de mantenimientos pendientes y completados</span>
          </div>
          <div class="feature-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>Facturas y documentos vinculados al mantenimiento</span>
          </div>
        </div>

        <div class="brand-footer">
          Hecho por Kevin Daniel Vásquez Alegría. Todos los derechos reservados.
        </div>
      </div>
    </div>

    <!-- Lado Derecho: Login -->
    <div class="login-right">
      <div class="login-box">
        <div class="login-header">
          <div class="mobile-brand">
            <div class="mobile-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.2 6.5A3 3 0 0 1 9 4.5h6a3 3 0 0 1 2.8 2l1.05 3H20a2 2 0 0 1 2 2v5h-2.1a3 3 0 0 1-5.8 0H9.9a3 3 0 0 1-5.8 0H2v-5a2 2 0 0 1 2-2h1.15l1.05-3Zm1.9 3h7.8l-.75-2.15A1.25 1.25 0 0 0 14 6.5H10a1.25 1.25 0 0 0-1.15.85L8.1 9.5ZM7 17.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
              </svg>
            </div>
            <span>SGA SYSTEM</span>
          </div>
          <h2>Iniciar Sesión</h2>
          <p>Por favor, introduce tus credenciales para ingresar.</p>
        </div>

        <div v-if="error" class="alert-error">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>{{ error }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Correo Electrónico</label>
            <div class="input-wrapper">
              <i class="fa-solid fa-envelope input-icon"></i>
              <input
                v-model="email"
                type="email"
                placeholder="admin@admin.com"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <div class="password-header">
              <label>Contraseña</label>
              <a href="#" class="forgot-link" @click.prevent>¿La olvidó?</a>
            </div>
            <div class="input-wrapper">
              <i class="fa-solid fa-lock input-icon"></i>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                @click="togglePassword"
                class="password-toggle"
              >
                <i
                  :class="
                    showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'
                  "
                ></i>
              </button>
            </div>
          </div>

          <div class="remember-me">
            <input type="checkbox" id="remember" v-model="remember" />
            <label for="remember"
              >Mantener sesión iniciada en este equipo</label
            >
          </div>

          <button type="submit" class="btn-login">
            Ingresar al Portal <i class="fa-solid fa-right-to-bracket"></i>
          </button>
        </form>

        <!-- Credenciales Rápidas -->
        <div class="quick-credentials">
          <p class="quick-title">
            <i class="fa-solid fa-circle-info"></i> Credenciales de
            demostración:
          </p>
          <div class="credentials-grid">
            <div
              class="credential-card admin"
              @click="fillCredentials('admin@admin.com', 'admin123')"
            >
              <span class="credential-role">Administrador:</span>
              <span class="credential-data">User: admin@admin.com</span>
              <span class="credential-data">Pass: admin123</span>
            </div>
            <div
              class="credential-card mecanico"
              @click="fillCredentials('mecanico@mecanico.com', 'admin123')"
            >
              <span class="credential-role">Mecánico:</span>
              <span class="credential-data">User: mecanico@mecanico.com</span>
              <span class="credential-data">Pass: admin123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const remember = ref(false);
const showPassword = ref(false);
const error = ref("");
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  if (loading.value) return;

  error.value = "";
  loading.value = true;

  try {
    await authStore.login(email.value, password.value, remember.value);
    router.push(authStore.isAdmin ? "/usuarios" : "/vehicles");
  } catch (err) {
    const errorMsg = err.response?.data?.error || "Credenciales inválidas";

    if (errorMsg.includes("deshabilitado") || errorMsg.includes("inactivo")) {
      error.value = "❌ Usuario deshabilitado. Contacta al administrador.";
    } else if (
      errorMsg.includes("Credenciales") ||
      errorMsg.includes("inválidas")
    ) {
      error.value = "❌ Usuario o contraseña incorrectos.";
    } else {
      error.value = "❌ " + errorMsg;
    }
  } finally {
    loading.value = false;
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const fillCredentials = (user, pass) => {
  email.value = user;
  password.value = pass;
  error.value = "";
};
</script>

<style scoped>
/* ===== CONTENEDOR PRINCIPAL ===== */
.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #020617;
  color: #f1f5f9;
  font-family: "Inter", sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

/* ===== LADO IZQUIERDO ===== */
.login-left {
  display: none;
  width: 50%;
  background: #0f172a;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 48px;
  border-right: 1px solid #1e293b;
}

@media (min-width: 1024px) {
  .login-left {
    display: flex;
  }
}

.bg-glow-1 {
  position: absolute;
  top: -160px;
  left: -160px;
  width: 384px;
  height: 384px;
  background: rgba(14, 165, 233, 0.1);
  border-radius: 50%;
  filter: blur(80px);
}

.bg-glow-2 {
  position: absolute;
  bottom: -160px;
  right: -160px;
  width: 384px;
  height: 384px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50%;
  filter: blur(80px);
}

.brand-content {
  max-width: 448px;
  position: relative;
  z-index: 10;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: #0ea5e9;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  font-weight: 700;
  font-size: 18px;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
}

.brand-icon svg,
.mobile-icon svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.brand-title {
  font-weight: 700;
  color: white;
  font-size: 18px;
  display: block;
  letter-spacing: 0.025em;
}

.brand-subtitle {
  font-size: 10px;
  color: #38bdf8;
  font-weight: 600;
  letter-spacing: 0.1em;
  display: block;
  text-transform: uppercase;
}

.brand-text h1 {
  font-size: 36px;
  font-weight: 800;
  color: white;
  line-height: 1.25;
  letter-spacing: -0.025em;
  margin-bottom: 16px;
}

.brand-text p {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.625;
}

.brand-features {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #cbd5e1;
}

.feature-item i {
  color: #34d399;
  font-size: 14px;
}

.brand-footer {
  margin-top: 24px;
  font-size: 11px;
  color: #475569;
}

/* ===== LADO DERECHO ===== */
.login-right {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 32px 48px;
}

@media (min-width: 1024px) {
  .login-right {
    width: 50%;
  }
}

.login-box {
  width: 100%;
  max-width: 448px;
}

.login-header {
  margin-bottom: 32px;
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

@media (min-width: 1024px) {
  .mobile-brand {
    display: none;
  }
}

.mobile-icon {
  width: 32px;
  height: 32px;
  background: #0ea5e9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  font-weight: 700;
  font-size: 14px;
}

.mobile-icon svg {
  width: 16px;
  height: 16px;
}

.mobile-brand span {
  font-weight: 700;
  color: white;
  font-size: 14px;
  letter-spacing: 0.025em;
}

.login-header h2 {
  font-size: 30px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.025em;
}

.login-header p {
  font-size: 14px;
  color: #94a3b8;
  margin-top: 4px;
}

/* ===== ALERTA ERROR ===== */
.alert-error {
  padding: 14px;
  background: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: #fb7185;
  font-size: 12px;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}

.alert-error i {
  margin-top: 2px;
}

/* ===== FORMULARIO ===== */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 14px;
}

.input-wrapper input {
  width: 100%;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 12px 16px 12px 40px;
  font-size: 14px;
  color: #e2e8f0;
  outline: none;
  transition: border-color 0.2s;
}

.input-wrapper input:focus {
  border-color: #0ea5e9;
}

.input-wrapper input::placeholder {
  color: #475569;
}

.password-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.password-toggle:hover {
  color: #cbd5e1;
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.forgot-link {
  font-size: 12px;
  color: #38bdf8;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
}

.remember-me input[type="checkbox"] {
  accent-color: #0ea5e9;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border-color: #1e293b;
  background: #0f172a;
  cursor: pointer;
}

.remember-me label {
  font-size: 12px;
  color: #94a3b8;
  cursor: pointer;
  user-select: none;
}

.btn-login {
  width: 100%;
  background: #0ea5e9;
  color: #0f172a;
  font-weight: 700;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-login:hover {
  background: #0284c7;
  transform: scale(0.98);
}

.btn-login i {
  font-size: 12px;
}

/* ===== CREDENCIALES RÁPIDAS ===== */
.quick-credentials {
  margin-top: 24px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(30, 41, 59, 0.8);
  border-radius: 12px;
}

.quick-title {
  font-size: 12px;
  font-weight: 700;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.quick-title i {
  color: #38bdf8;
}

.credentials-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 640px) {
  .credentials-grid {
    grid-template-columns: 1fr;
  }
}

.credential-card {
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(30, 41, 59, 0.4);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  color: #94a3b8;
}

.credential-card:hover {
  transform: translateX(4px);
}

.credential-card.admin:hover {
  border-color: rgba(14, 165, 233, 0.5);
  background: rgba(14, 165, 233, 0.05);
}

.credential-card.mecanico:hover {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.05);
}

.credential-role {
  display: block;
  font-weight: 700;
}

.credential-card.admin .credential-role {
  color: #38bdf8;
}

.credential-card.mecanico .credential-role {
  color: #34d399;
}

.credential-data {
  display: block;
  font-family: monospace;
  font-size: 10px;
}
</style>
