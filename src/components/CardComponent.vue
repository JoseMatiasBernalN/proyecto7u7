<template>
  <div class="userElement">
    <UserComponent
      v-for="user in users"
      :key="user.id"
      :user="user"
    />
  </div>
</template>

<script>
import UserComponent from './UserComponent.vue';

export default {
  name: 'CardComponent',
  components: { UserComponent },
  props: {
    users: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.userElement {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}
</style>