<template>
<div class="esp-centro">
    <CrearComentarios @crear-comentario="agregarComentario"/>
    <div v-for="(publicacion, index) in publicaciones" :key="index" class="public">
        {{ publicacion }}
    </div>
</div>
</template>

<script>
import CrearComentario from '@/components/CrearComentarios.vue';

export default {
    name: 'EspacioPublicar',
    data() {
        return {
            publicaciones: []
        }
    },
    components: {
        CrearComentario,
    },
    methods: {
        agregarComentario(nuevoComentario) {
            this.publicaciones.unshift(nuevoComentario);
        }
    }
}
</script>

<style scoped>
.esp-centro {
    display: flex;
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #ffffff;
    flex-direction: column;
}
.public {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;

  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: break-word;

  width: 100%;
  box-sizing: border-box;
}
</style>