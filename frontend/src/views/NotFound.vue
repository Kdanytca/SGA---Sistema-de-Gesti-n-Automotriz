<template>
  <div class="not-found-container">
    <div class="not-found-card">
      <span class="status-code">404</span>
      <h1>Sitio no encontrado</h1>
      <p>La ruta que intentas abrir no existe o no esta disponible en el sistema.</p>

      <div class="actions">
        <router-link v-if="authStore.isAuthenticated" :to="homeRoute" class="btn-primary">
          Volver al inicio
        </router-link>
        <router-link v-else to="/login" class="btn-primary">
          Ir al login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../store/auth";

const authStore = useAuthStore();
const homeRoute = computed(() => (authStore.isAdmin ? "/usuarios" : "/vehicles"));
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: #020617;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #e2e8f0;
}

.not-found-card {
  width: 100%;
  max-width: 480px;
  background: #0f172a;
  border: 1px solid rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
}

.status-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #38bdf8;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.25);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  margin-bottom: 18px;
}

h1 {
  color: white;
  font-size: 28px;
  margin-bottom: 10px;
}

p {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  background: #0ea5e9;
  color: #0f172a;
  font-size: 13px;
  font-weight: 800;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #38bdf8;
  transform: translateY(-1px);
}
</style>
