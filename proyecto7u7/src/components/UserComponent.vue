<template>
  <div class="card">
    <div class="image-wrapper">
      <img :src="user.imagen || 'https://ui-avatars.com/api/?name=' + user.nombre" :alt="user.nombre" />
    </div>
    <div class="card-body">
      <h3>{{ user.nombre }}</h3>
      <p class="especialidad">🧠 {{ user.descripcion }}</p>
      <p class="ubicacion">📍 {{ user.ubicacion }}</p>
    </div>
    <router-link :to="`/psicologos/${user.id}`" class="btn-perfil">Ver Perfil</router-link>
  </div>
</template>

<script>
export default {
  name: 'UserComponent',
  props: {
    user: Object
  }
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8f0fe;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(52, 152, 219, 0.15);
}

.image-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #3498db;
  margin-bottom: 0.5rem;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.especialidad {
  font-size: 0.85rem;
  color: #5d6d7e;
  margin: 0;
}

.ubicacion {
  font-size: 0.82rem;
  color: #e74c3c;
  margin: 0;
}

.btn-perfil {
  margin-top: 0.8rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  text-decoration: none;
  padding: 0.55rem 1.4rem;
  border-radius: 25px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: opacity 0.2s ease;
  width: 100%;
  display: block;
}

.btn-perfil:hover {
  opacity: 0.85;
}
</style>