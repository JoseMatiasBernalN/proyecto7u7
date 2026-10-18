<template>
  <div class="search-container">
    <input 
      type="text" 
      placeholder="Buscar temas (ansiedad, consejos, desahogo...)" 
      v-model="query"
    />
    <button @click="buscar">Buscar</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() { return { query: '' } },
  methods: {
    buscar() { console.log("Buscando:", this.query); }
  }
}
</script>

<style scoped>
.search-container { margin: 20px 0; }
input { padding: 10px; width: 300px; border-radius: 20px; border: 1px solid #ccc; }
button { padding: 10px 20px; border-radius: 20px; background: #42b983; color: white; border: none; cursor: pointer; margin-left: 10px; }
</style>