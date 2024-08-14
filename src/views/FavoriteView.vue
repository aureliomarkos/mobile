<template>
      <header class="header">
        <h2>Favoritos</h2>
        <div class="div-limpar-icon">
            <p-button label="Remover todos produtos de Favoritos" icon="pi pi-trash" @click="limparFavoritos" class="btn-limpar-favorito"/>
        </div>  
    </header>


      <div :style="{ height: alturaPagina + 'px' }" class="body">
        <div v-for="produto in produtos" :key="produto.id" class="card">
            <img :src="getProdutoImage(produto.imagem)" alt="Imagem do produto" class="imagem">
            <p class="descricao">{{ produto.descricao }}</p>
            <p class="preco">{{ precoFormatado(produto.preco) }}</p>
            <p class="disponibilidade">{{ produto.qtde ? 'Disponível' : 'Indisponível' }}</p>
            <p-button icon="pi pi-cart-plus" label="Adicionar este produto ao carrinho" @click="adicionarAoCarrinho(produto.id)" class="btn-add-carrinho"/>
            <p-button label="Remover este produto de Favoritos" icon="pi pi-trash" @click="removerFavorito(produto.favoritoId)" class="btn-remover-carrinho"/>
        </div>
      </div>

  </template>
  
  <script>
  import { ref } from 'vue';
  
  import axios from '@/axios';

  import { BASE_URL } from '@/baseurl.config';

  import { formatCurrency } from '@/utils/currency';
  
  import { useToast } from 'primevue/usetoast';
  import Button from 'primevue/button';

  export default {
    name: 'FavoritosView',
  
    components: {
      'p-button': Button
    },

  data() {
        const produtos = ref([])
        const toast = useToast()
        const clienteId = this.$store.state.user.userId
        const alturaPagina = ref(window.innerHeight)

        return {
          clienteId,
          produtos,
          toast,
          alturaPagina
        }
  },

  async created() {
        this.alturaPagina = this.alturaPagina - 180
        await this.carregarFavoritos();

  },

  methods:{ 

      async carregarFavoritos() {

        const clienteId = this.clienteId
        try {
              const response = await axios.get(`${BASE_URL}/favoritos`, { params: { clienteId }});
              const respCarregFavoritos = response.data
              if (respCarregFavoritos.success){ this.produtos = respCarregFavoritos.data }
              else { this.toast.add({ severity: 'error', summary: 'Erro', detail: respCarregFavoritos.message, life: 3000 })}
          } catch (error) {
              this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao selecionar favoritos.', life: 3000 })
              console.error('Error ao selecionar os favoritos: ', error);
          }
      },
  
      async removerFavorito (favoritoId) {
        try {
              const response = await axios.delete(`${BASE_URL}/favoritos/removeFavorito/${favoritoId}`);
              const respRmvFavorito = response.data
              if (respRmvFavorito.success) { this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respRmvFavorito.message, life: 3000 }); }
              else { this.toast.add({ severity: 'error', summary: 'Erro', detail: respRmvFavorito.message, life: 3000 }); }
                
        } catch (error) {
              console.error('Erro ao remover produto de favoritos: ', error);
              this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover produto de favoritos:.', life: 3000 });
              return
        }
        this.carregarFavoritos()
      },
  
      async limparFavoritos() {
        const clienteId = this.clienteId

        try {
            const response = await axios.get(`${BASE_URL}/favoritos/limparFavoritos`, { params: { clienteId }});
            const respLimpFavoritos = response.data
            if (respLimpFavoritos.success) { this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respLimpFavoritos.message, life: 3000 }); }
            else { this.toast.add({ severity: 'error', summary: 'Erro', detail: respLimpFavoritos.message, life: 3000 }); }
                
        } catch (error) {
              console.error('Erro ao remover os produtos de favoritos: ', error);
              this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover os produtos de favoritos.', life: 3000 });
              return
        }
        this.carregarFavoritos()


      },
  
      async adicionarAoCarrinho( produtoId ) {
        const clienteId = this.clienteId

        try {
              const response = await axios.post(`${BASE_URL}/carrinho/addCarrinho`, { clienteId, produtoId });
              const respAddCarrinho = response.data
              if (respAddCarrinho.success) { this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respAddCarrinho.message, life: 3000 }); }
              else { this.toast.add({ severity: 'error', summary: 'Erro', detail: respAddCarrinho.message, life: 3000 }); }
                
        } catch (error) {
              console.error('Error ao inserir produto no carrinho:', error);
              this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao inserir produto no carrinho.', life: 3000 });
        }
      },
      
      precoFormatado(preco) {
          return formatCurrency(preco)
      },

      getProdutoImage(imagem) {
            return `data:image/jpeg;base64,${imagem}`;
      },

    },
  };
</script>
  
<style scoped>
.header {
    display: flex;
    position: fixed;
    top: 0;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding-left: 10px;
    padding-right: 10px;
    border-bottom: 1px solid #ddd;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
  
.div-limpar-icon {
    display: flex;
    align-items: center;
  }

.body {
    overflow-y: auto;  /* Adiciona barra de rolagem auto; */
    margin-top:80px;
    margin-bottom: 100px;
}
  
.imagem {
    align-self: center;
    width: 80px;
    height: 80px;
    border-radius: 8px;
  }
  
  .card {
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Adiciona barra de rolagem */
  border: 1px solid #ddd;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;;
  background-color:rgb(245, 245, 245);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
  
.descricao {
  margin: 2px;  

}
  
.preco {
  margin: 2px;
  color: green;
}
  
.disponibilidade {
  margin: 2px;
  color: #555;
}

.btn-limpar-favorito {
    font-size: 12px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-limpar-favorito:hover {
    background-color: darkred;
}

.btn-remover-carrinho,
.btn-add-carrinho {
    width: 95%;
    padding: 0.5rem 1rem;
    margin: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}
  
.btn-remover-carrinho {
    font-size: 12px;
    background-color: red;
    color: white;
}

.btn-remover-carrinho:hover {
    background-color: darkred;
}

.btn-add-carrinho {
    font-size: 12px;
    background-color: #2196f3;
    color: white;
}

.btn-add-carrinho:hover {
    background-color: #1976d2;
}
</style>
  