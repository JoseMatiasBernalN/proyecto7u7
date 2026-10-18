<template>
<div class="comentario">
    <div class="escribir">
        <textarea type="text" v-model="nuevoComentario" placeholder="Escribe tu comentario aquí..." @keyup.enter="publicar" class="espacio_de_escritura">
        </textarea>
        <!-- <button v-on:click="publicar">Publicar</button> -->
    </div>
</div>
</template>

<script>
export default {
  name: 'CrearComentario',
  data() {
    return {
      nuevoComentario: ""
    }
  },
  methods: {
    publicar() {
        if (this.nuevoComentario.trim() !== '') {
        this.$emit("crear-comentario", this.nuevoComentario)
        this.nuevoComentario = '';
      }
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.comentario {
  width: 400px;
}
.lista {
    border: 1px solid grey;
    height: 200px;
    overflow-y: scroll;
    padding: 10px;
    margin-bottom: 15px;
}
.comentario{
    background: #eee;
    margin-bottom: 8px;
    padding: 5px;
    border-radius: 5px;
}
.escribir {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    padding: 9px;
}
.comentario-item{
    background-color: #f2f2f2;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    width: fit-content;
    max-width: 300px;
    box-shadow: 0px 2px 5px rgba(0,0,0,0.2);
}
.public {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  white-space: pre-line;
  word-wrap: break-word;   
  overflow-wrap: break-word;
}
.espacio_de_escritura {
  border: none;        /* quita el borde */
  outline: none;       /* quita el borde azul al hacer click */
  background: transparent; /* fondo transparente */
  resize: none;     
}
</style>