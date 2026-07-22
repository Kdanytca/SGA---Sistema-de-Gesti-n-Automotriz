<template>
  <div class="navbar-container">
    <div class="navbar-content">
      <!-- Logo y Navegación -->
      <div class="navbar-left">
        <router-link :to="homeRoute" class="navbar-logo">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.2 6.5A3 3 0 0 1 9 4.5h6a3 3 0 0 1 2.8 2l1.05 3H20a2 2 0 0 1 2 2v5h-2.1a3 3 0 0 1-5.8 0H9.9a3 3 0 0 1-5.8 0H2v-5a2 2 0 0 1 2-2h1.15l1.05-3Zm1.9 3h7.8l-.75-2.15A1.25 1.25 0 0 0 14 6.5H10a1.25 1.25 0 0 0-1.15.85L8.1 9.5ZM7 17.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
          </div>
          <span class="logo-text"
            >Taller<span class="logo-highlight">SGA</span></span
          >
        </router-link>

        <nav class="navbar-nav" :class="{ 'nav-open': isMenuOpen }">
          <router-link
            to="/vehicles"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/vehicles') }"
            @click="closeMenu"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 11 6.7 6.7A3 3 0 0 1 9.5 4.8h5a3 3 0 0 1 2.8 1.9L19 11h1a2 2 0 0 1 2 2v4h-2a2.5 2.5 0 0 1-5 0H9a2.5 2.5 0 0 1-5 0H2v-4a2 2 0 0 1 2-2h1Zm2.2 0h9.6l-1.15-3.05a1.25 1.25 0 0 0-1.15-.8h-5a1.25 1.25 0 0 0-1.15.8L7.2 11ZM6.5 18a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm11 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
            </svg>
            Vehículos
          </router-link>
          <router-link
            to="/maintenances"
            class="nav-link"
            :class="{ active: $route.path.startsWith('/maintenances') }"
            @click="closeMenu"
          >
            <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21.1 5.6a5.9 5.9 0 0 1-7.4 7.4l-6.8 6.8a2.4 2.4 0 0 1-3.4-3.4l6.8-6.8A5.9 5.9 0 0 1 17.7 2.2l-3.1 3.1 4.4 4.4 3.1-3.1c-.2-.35-.55-.8-1-1Z" />
            </svg>
            Mantenimientos
          </router-link>
          <router-link to="/documents" class="nav-link" :class="{ active: $route.path === '/documents' }" @click="closeMenu">
  <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm7 1.8V8h4.2L13 3.8ZM7 13h2.2a2 2 0 0 1 0 4H8v2H7v-6Zm1 1v2h1.2a1 1 0 0 0 0-2H8Zm4 0h1.2a2.8 2.8 0 0 1 0 5H12v-5Zm1 1v3h.2a1.8 1.8 0 0 0 0-3H13Zm4 0v1h2v1h-2v2h-1v-5h3v1h-2Z" />
  </svg>
  Documentos
</router-link>

          <!-- Admin Links -->
          <template v-if="authStore.isAdmin">
            <div class="divider"></div>
            <router-link to="/usuarios" class="nav-link admin-link" @click="closeMenu">
              <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0 2c4 0 7 2 7 4.5V20H2v-2.5C2 15 5 13 9 13Zm8.2-.5A3.5 3.5 0 1 1 18 5.6a3.5 3.5 0 0 1-.8 6.9ZM17 13c3 0 5 1.5 5 3.6V20h-4v-2.5c0-1.7-.8-3.1-2.2-4.1.4-.25.8-.4 1.2-.4Z" />
              </svg>
              Usuarios
            </router-link>
            <router-link to="/audit" class="nav-link admin-link" :class="{ active: $route.path === '/audit' }" @click="closeMenu">
              <svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3a9 9 0 1 1-8.2 5.3L2 8.2V3h5.2L5.3 4.9A7 7 0 1 0 12 5v4l3.2 3.2-1.4 1.4L10 9.8V3h2Z" />
              </svg>
              Auditoría
            </router-link>
          </template>
        </nav>
      </div>

      <!-- Usuario y Logout -->
      <div class="navbar-right">
        <div class="user-info">
          <p class="user-name">{{ authStore.user?.nombre || "Usuario" }}</p>
          <p class="user-role">
            {{ authStore.isAdmin ? "Administrador" : "Mecánico" }}
          </p>
        </div>

        <div class="divider-vertical"></div>

        <button
          type="button"
          class="menu-toggle"
          :class="{ active: isMenuOpen }"
          aria-label="Abrir menú"
          @click="toggleMenu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <button @click="requestLogout" class="logout-btn" title="Salir">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 3h8a2 2 0 0 1 2 2v3h-2V5H5v14h8v-3h2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm11.6 4.4L21.2 12l-4.6 4.6-1.4-1.4 2.2-2.2H9v-2h8.4l-2.2-2.2 1.4-1.4Z" />
          </svg>
          <span class="logout-text">Salir</span>
        </button>
      </div>
    </div>
  </div>

  <ConfirmModal
    v-if="showLogoutConfirm"
    title="Cerrar sesión"
    message="¿Seguro que deseas salir del sistema? Tendrás que iniciar sesión nuevamente para continuar."
    confirm-text="Sí, salir"
    cancel-text="Cancelar"
    @confirm="confirmLogout"
    @cancel="showLogoutConfirm = false"
  />
</template>

<script setup>
import { computed, ref } from "vue";
import { useAuthStore } from "../store/auth";
import { useRouter } from "vue-router";
import ConfirmModal from "./ConfirmModal.vue";

const authStore = useAuthStore();
const router = useRouter();
const isMenuOpen = ref(false);
const showLogoutConfirm = ref(false);
const homeRoute = computed(() => (authStore.isAdmin ? "/usuarios" : "/vehicles"));

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const requestLogout = () => {
  closeMenu();
  showLogoutConfirm.value = true;
};

const confirmLogout = () => {
  showLogoutConfirm.value = false;
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
/* ===== CONTENEDOR PRINCIPAL ===== */
.navbar-container {
  background: #0f172a;
  border-bottom: 1px solid #1e293b;
  padding: 16px 24px;
  width: 100%;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== LADO IZQUIERDO ===== */
.navbar-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.navbar-logo:hover {
  opacity: 0.8;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: #0ea5e9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  font-size: 14px;
  transition: background 0.2s;
}

.logo-icon svg,
.nav-icon,
.logout-btn svg {
  width: 16px;
  height: 16px;
  fill: currentColor;
  flex: 0 0 auto;
}

.navbar-logo:hover .logo-icon {
  background: #38bdf8;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.025em;
}

.logo-highlight {
  color: #38bdf8;
}

/* Navegación */
.navbar-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 10px 12px;
  }

  .navbar-content {
    align-items: center;
    gap: 10px;
  }

  .navbar-left {
    flex: 1 1 auto;
    min-width: 0;
  }

  .navbar-nav {
    position: absolute;
    top: calc(100% + 8px);
    left: 12px;
    right: 12px;
    z-index: 30;
    display: none;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    padding: 12px;
    background: rgba(15, 23, 42, 0.98);
    border: 1px solid rgba(51, 65, 85, 0.9);
    border-radius: 14px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  }

  .navbar-nav.nav-open {
    display: grid;
  }

  .nav-link {
    justify-content: center;
    padding: 9px 8px;
    background: rgba(15, 23, 42, 0.65);
    border: 1px solid rgba(30, 41, 59, 0.7);
    font-size: 12px;
  }

  .navbar-right {
    justify-content: flex-end;
    gap: 8px;
    flex: 0 0 auto;
  }

  .user-info {
    text-align: right;
  }

  .user-role {
    display: none;
  }

  .divider-vertical {
    display: none;
  }
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link i {
  font-size: 12px;
}

.nav-link:hover {
  color: white;
  background: rgba(30, 41, 59, 0.5);
}

.nav-link.active {
  color: #38bdf8;
  background: rgba(30, 41, 59, 0.4);
}

.admin-link.active {
  color: #fbbf24 !important;
}

.admin-link:hover {
  color: #fbbf24 !important;
}

.divider {
  width: 1px;
  height: 20px;
  background: #1e293b;
  margin: 0 8px;
  display: none;
}

@media (min-width: 768px) {
  .divider {
    display: block;
  }
}

/* ===== LADO DERECHO ===== */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  text-align: right;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin: 0;
}

.user-role {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.divider-vertical {
  width: 1px;
  height: 24px;
  background: #1e293b;
}

.menu-toggle {
  display: none;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(51, 65, 85, 0.9);
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.85);
  color: #cbd5e1;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
}

.menu-toggle span {
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 999px;
  background: currentColor;
  transition: transform 0.2s, opacity 0.2s;
}

.menu-toggle.active {
  color: #38bdf8;
  border-color: rgba(14, 165, 233, 0.45);
}

.menu-toggle.active span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
  padding: 6px 8px;
  border-radius: 6px;
}

.logout-btn svg {
  width: 18px;
  height: 18px;
}

.logout-btn:hover {
  color: #f43f5e;
}

.logout-text {
  display: none;
}

@media (min-width: 640px) {
  .logout-text {
    display: inline;
  }
}

@media (max-width: 768px) {
  .navbar-content {
    position: relative;
  }

  .nav-link {
    justify-content: center;
    padding: 9px 8px;
    background: rgba(15, 23, 42, 0.65);
    border: 1px solid rgba(30, 41, 59, 0.7);
    font-size: 12px;
  }

  .logo-icon {
    width: 30px;
    height: 30px;
  }

  .logo-text {
    font-size: 18px;
  }

  .user-name {
    max-width: 96px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }

  .menu-toggle {
    display: flex;
  }

  .logout-btn {
    width: 38px;
    height: 38px;
    justify-content: center;
    padding: 0;
    border: 1px solid rgba(51, 65, 85, 0.9);
    background: rgba(15, 23, 42, 0.85);
  }
}

@media (max-width: 380px) {
  .navbar-nav {
    grid-template-columns: 1fr;
  }
}
</style>
