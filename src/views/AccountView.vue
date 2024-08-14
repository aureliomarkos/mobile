<template>
  <div class="header">
    <p class="texto-minha-conta">Minha Conta</p>
      <div class="div-btn-sair-app">
        <p-button class="btn-sair-app" icon="pi pi-sign-out" iconPos="top" size="large" @click="sairDoApp()"></p-button>
        <p class="texto-sair-app">Sair do App</p>
      </div>
  </div>

  <!-- botões dados pessoais e endereço -->
  <div class="div-btn-dados-endereco">
    <div class="div-btn-dados">
      <p-button 
        class="btn-dados"
        icon="pi pi-user" 
        iconPos="top" 
        size="large" 
        @click="goTo('/personaldata')">
      </p-button>
      <p class="label-dados-pessoais">Dados Pessoais</p>
    </div>

    <div class="div-btn-endereco">
      <p-button 
        class="btn-endereco"
        icon="pi pi-address-book" 
        iconPos="top" 
        size="large" 
        @click="goTo('/address')">
      </p-button>
      <p class="label-endereco">Endereço</p>
    </div>
  </div>

  <div>
    <div class="div-btn-pedido">
      <p-button 
        class="btn-pedido"
        icon="pi pi-truck" 
        iconPos="top" 
        size="large" 
        @click="goTo('/order')">
      </p-button>
      <p class="label-pedidos">Pedidos</p>
    </div>

  </div>

</template>

<script>
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

export default {
  components: {
    'p-button': Button
  },

  data() {
    const toast = useToast()
    return {
      toast
    }
  },

  methods: {

    showSuccessLogout() {
        this.toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Logout efetuado com sucesso.', life: 3000 });

    },
    
    sairDoApp() {
      this.showSuccessLogout();
      setTimeout(() => { 
        localStorage.removeItem('token');
        this.$router.push('/');
      }, 3000)
    },

    goTo(path) {
      this.$router.push(path);
      this.activePath = path;
    }
  }
}
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  position: fixed;
  top: 0;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  background-color:rgb(245, 245, 245);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.texto-minha-conta {
  font-size: 20px;
  margin-left: 4px;
}

.div-btn-sair-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px;
}

.btn-sair-app {
  background-color: red;
}

.texto-sair-app {
  margin: 2px;
}

.div-btn-dados-endereco {
  margin-top: 120px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}

.div-btn-dados {
  display:flex;
  flex-direction: column;
  align-items: center;
}

.btn-dados {
  color: white;
  width: 60px;
  height: 60px;
  background-color: #2196f3;
  border-radius: 30px;
}

.btn-dados:hover {
  background-color: #1976d2;
}

.label-dados-pessoais {
  margin: 2px;
}

.div-btn-endereco {
  display:flex;
  flex-direction: column;
  align-items: center;
}

.btn-endereco {
  color: white;
  width: 60px;
  height: 60px;
  background-color: #2196f3;
  border-radius: 30px;
}

.btn-endereco:hover {
  background-color: #1976d2;
}

.label-endereco {
  margin: 2px;
}

.div-btn-pedido {
  display:flex;
  flex-direction: column;
  align-items: center;
}

.btn-pedido {
  color: white;
  width: 60px;
  height: 60px;
  background-color: #2196f3;
  border-radius: 30px;
}

.btn-pedido:hover {
  background-color: #1976d2;
}

.label-pedidos {
  margin: 2px;
}


</style>