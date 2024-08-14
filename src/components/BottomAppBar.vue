<template>
  <footer class="bottom-app-bar">
    
    <!-- Home -->
    <p-button 
      class="btn-home"
      label="Home"  
      icon="pi pi-home" 
      iconPos="top" 
      size="large"      
      :class="{'p-button-text': true, 'active': activePath === '/'}"
      @click="goTo('/')">
    </p-button>
    
    <!-- Categorias -->
    <p-button 
      class="btn-category"
      label="Categoria" 
      icon="pi pi-bars" 
      iconPos="top" 
      size="large"
      :class="{'p-button-text': true, 'active': activePath === '/category'}"
      @click="goTo('/category')">
    </p-button>

    <!-- Favoritos -->
    <p-button 
      class="btn-favorite"
      label="Favorito" 
      icon="pi pi-heart" 
      iconPos="top" 
      size="large" 
      :class="{'p-button-text': true, 'active': activePath === '/favorite'}"
      @click="goTo('/favorite')">
    </p-button>

    <!-- Carrinho -->
    <p-button 
      class="btn-cart"
      label="Carrinho" 
      icon="pi pi-shopping-cart" 
      iconPos="top" 
      size="large" 
      :class="{'p-button-text': true, 'active': activePath === '/cart'}"
      @click="goTo('/cart')">
    </p-button>
    
    <!-- Conta -->
    <p-button 
      class="btn-account"
      label="Conta" 
      icon="pi pi-user" 
      iconPos="top" 
      size="large" 
      :class="{'p-button-text': true, 'active': activePath === '/account'}"
      @click="goTo('/account')">
    </p-button>
  </footer>
</template>

<script>
import Button from 'primevue/button';

export default {
  name: 'BottomAppBar',
  
  components: {
    'p-button': Button
  },

  data() {
    return {
      activePath: this.$route.path
    };
  },

  watch: {
    '$route.path'(newPath) {
      this.activePath = newPath;
    }
  },

  methods: {
    goTo(path) {
      this.$router.push(path);
      this.activePath = path;
    }
  },

}
</script>

<style scoped>
.bottom-app-bar {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  padding: 40px;;
  width: 100%;
  background-color:rgb(245, 245, 245);
  border-top: 1px solid #ddd;
  padding: 0.5rem 0;
  z-index: 1000;
}

.btn-home {
  font-size: 16px;
  margin-left: 8px;
}

.btn-category {
  font-size: 16px;
}

.btn-favorite {
  font-size: 16px;
}

.btn-cart {
  font-size: 16px;
}

.btn-account {
  font-size: 16px;
  margin-right: 8px;
}

.p-button.active {
  border-radius: 8px;
  color: white; /* Cor do texto do botão ativo */
  background-color:dodgerblue; /* Cor de fundo do botão ativo */
}
</style>
