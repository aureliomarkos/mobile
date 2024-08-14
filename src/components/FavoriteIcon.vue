<template>
    <div>
      <i 
        :class="isFavorito ? 'pi pi-heart-fill' : 'pi pi-heart'" 
        @click="toggleFavorite"
        class="favorite-icon">
      </i>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FavoriteIcon',

    props: {
      initialFavorito: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        isFavorito: this.initialFavorito
      };
    },

    methods: {
      toggleFavorite() {
        this.isFavorito = !this.isFavorito;
        this.$emit('update:favorito', this.isFavorito);
      }
    },

    watch: {
        initialFavorito(newVal) {
            this.isFavorito = newVal;
        }
      }
  };
</script>
  
<style scoped>
.favorite-icon {
  margin: 10px;
  cursor: pointer;
  font-size: 30px;
  color:#2196f3;
}
</style>
  