<template>

  <div class="header">
      <p-input-text class="input-descricao" type="text" v-model="descricao"></p-input-text>
      <p-button class="btn-search" icon="pi pi-search" v-on:click="filtrarProdutos()" />
  </div>

  <div :style="{ height: alturaPagina + 'px' }" class="body">
    <div v-on:click="onClickImage(produto)" class="card" v-for="produto in produtos" :key="produto.id">

      <img :src="getProdutoImage(produto.imagem)" alt="Imagem" class="imagem" v-if="produto.imagem">
        <div class="div-descricao-preco">
          <p>{{ produto.descricao }}</p>
          <p>{{ precoFormatado(produto.preco) }}</p>
        </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

import axios from '@/axios';

// PrimeVue
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

import { formatCurrency } from '@/utils/currency'

import { BASE_URL } from '@/baseurl.config';


export default {

  name: 'HomeView',

  components: {
    'p-input-text': InputText,
    'p-button': Button,
  },
  
  data() {
    const toast = useToast()
    const produtos = ref([])
    const descricao = ref('')
    const alturaPagina = ref(window.innerHeight)
    
    return { toast, produtos, descricao, alturaPagina };
  },

  created() {
      this.alturaPagina = this.alturaPagina - 185
      this.loadProducts();
  },


  methods:{

    async loadProducts(descricao) {
    
      try {
        const response = await axios.get(`${BASE_URL}/produtos`, { params: { descricao }});
        const respProdutos = response.data
        if (respProdutos.success) {
            this.produtos = respProdutos.data;
        } else {
            this.toast.add({ severity: 'error', summary: 'Erro', detail: respProdutos.message, life: 3000 });
        }

        
      } catch (error) {
        console.error('Error ao carregar produtos:', error);
      }

    },
    
    onClickImage(produto) {
      this.$router.push({ path:'/product', query: { data: JSON.stringify(produto) }} );
     },

    precoFormatado(preco){
      return formatCurrency(preco);
    },

    getProdutoImage(imagem) {
      return `data:image/jpeg;base64,${imagem}`;
    },

    filtrarProdutos() {
      this.loadProducts(this.descricao)

    }
  }
}
</script>

<style scoped>
.header{
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background-color:rgb(245, 245, 245);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.input-descricao{
  width:400px;
  margin:10px;

}
.btn-search{
  margin:10px;
}

.body {
  flex: 1; /* Faz com que o corpo ocupe o espaço disponível */
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto; /* Adiciona barra de rolagem */
  margin-top: 90px;
  margin-bottom: 95px;
  gap: 10px;
  justify-content: center;
}

.card {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  flex: 1 1 calc(50% - 16px); /* Dois cartões por linha com espaçamento */
  max-width: calc(50% - 16px);
  box-sizing: border-box;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.imagem {
  margin-top: 10px;
  margin-left: 18px;
  align-self: center;
  width: 100px; 
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.div-descricao-preco {
  padding: 16px;
}

.div-descricao-preco p {
  margin: 8px 0;
}
</style>