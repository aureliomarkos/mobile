<template>
    <div class="header">
          <p class="texto-carrinho">Carrinho</p>
        <div class="div-header-right">
          <div class="div-header-total">
            <p class="texto-total">Total:</p>
            <p class="texto-valor-total">{{ precoFormatado(valorTotalCarrinho) }}</p>
          </div>
            <p-button v-if="produtos" label="Remover todos ítens do carrinho" icon="pi pi-trash" class="btn-remover-todos-itens" @click="limparItensdoCarrinho()"/>
            <p-button v-if="produtos" label="Ir para o pagamento" icon="pi pi-dollar" class="btn-ir-pagamento" @click="onclickBtnIrPagamento()"/>
        </div>
    </div>

    <div :style="{ height: alturaPagina + 'px' }" class="body">
      <p v-if="!produtos" class="texto-nenhum-item-carrinho" >Nenhum ítem no carrinho</p>
      <div v-for="produto in produtos" :key="produto.id" class="card">
          <img :src="getProdutoImage(produto.imagem)" alt="imagem" class="imagem"/>
          <p class="descricao" >{{ produto.descricao }}</p>
          <p class="preco">{{ precoFormatado(produto.preco) }}</p>
          <p class="disponivel">{{ produto.qtde >= produto.qtdeCarrinho ? 'Disponível':'Indisponível' }}</p>
          <p v-if="produto.qtde >= produto.qtdeCarrinho" class="qtde">Quantidade<SpinButton :carrinhoId="produto.carrinhoId" :qtdeCarrinho="produto.qtdeCarrinho" :qtdeProduto="produto.qtde" @update:qtde="alterarQtde"/></p>
          <div class="div-total">
            <p class="texto-total">Total</p>
            <p class="valor-total">{{ precoFormatado(produto.valorTotalProduto) }}</p>
          </div>
          <p-button label="Remover este ítem do carrinho" icon="pi pi-trash" class="btn-remover" @click="removerProdutoCarrinho(produto.carrinhoId)"/>
      </div>
    </div>

</template>

<script>
import { ref } from 'vue';

import axios from '@/axios';

import { BASE_URL } from '@/baseurl.config';

import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

import { formatCurrency } from '@/utils/currency';
import SpinButton from '@/components/SpinButton.vue';


export default {

    components: {
        'p-button': Button,
        SpinButton
    },

    data() {
        const produtos = ref(null)
        const clienteId = this.$store.state.user.userId
        const valorTotalCarrinho = 0
        const toast = useToast()
        const alturaPagina = ref(window.innerHeight)
       
        return {
            produtos,
            clienteId,
            valorTotalCarrinho,
            toast,
            alturaPagina,
        }
    },

    async created() {
        this.alturaPagina = this.alturaPagina - 220
        await this.carregarCarrinho()
    },

    components: {
        'p-button': Button,
        SpinButton
    },

    methods: {

        async carregarCarrinho() {
          const clienteId = this.clienteId

          try {
                const response = await axios.get(`${BASE_URL}/carrinho`, { params: { clienteId }});
                const respCarrinho = response.data
                if (respCarrinho.success){
                    this.produtos = respCarrinho.data
                } else {
                  this.toast.add({ severity: 'error', summary: 'Erro', detail: respCarrinho.message, life: 3000 });
                }
          } catch (error) {
                console.error('Error ao selecionar produtos do carrinho: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao selecionar produtos do carrinho.', life: 3000 });
          }
          this.somarValorTotalCarrinho();
        },

        precoFormatado(preco) {
          return formatCurrency(preco)
        },

        async alterarQtde(carrinhoId, qtdeCarrinho) {
          try {
                const response = await axios.put(`${BASE_URL}/carrinho/updateQtdeCarrinho`, { carrinhoId, qtdeCarrinho });
                const respUpdtQtdeCarrinho = response.data
                
                if (respUpdtQtdeCarrinho.success) { 
                  this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respUpdtQtdeCarrinho.message, life: 3000 })
                } else { 
                  this.toast.add({ severity: 'error', summary: 'Erro', detail: respUpdtQtdeCarrinho.message, life: 3000 });
                }
          } catch (error) {
                console.error('Error ao alterar a qtde do produto no carrinho: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao alterar a qtde do produto no carrinho.', life: 3000 });
          }

          // Atualiza a quantidade e o valor total para o produto específico
          this.produtos = this.produtos.map(produto => {
            if (produto.carrinhoId === carrinhoId) {
              
              
              
              return {
                ...produto,
                valorTotalProduto: qtdeCarrinho * produto.preco
              };
            }
            return produto;
          });
          this.somarValorTotalCarrinho();
        },

        async somarValorTotalCarrinho() {
          const clienteId = this.clienteId
          
          try {
                const response = await axios.get(`${BASE_URL}/carrinho/valorTotalCarrinho`, { params: { clienteId }});
                const respValorTotCarrinho = response.data
                if (respValorTotCarrinho.success){
                    this.valorTotalCarrinho = respValorTotCarrinho.data[0].valorTotalCarrinho;
                } else {
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: respValorTotCarrinho.message, life: 3000 });
                }
          } catch (error) {
                console.error('Error ao somar os produtos do carrinho: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao somar os produtos do carrinho.', life: 3000 });
          }
        },

        async limparItensdoCarrinho() {
          const clienteId = this.clienteId

          try {
                const response = await axios.get(`${BASE_URL}/carrinho/limparCarrinho`, { params: { clienteId }} );
                const respLimparCarrinho = response.data
                
                if (respLimparCarrinho.success) { 
                  this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respLimparCarrinho.message, life: 3000 });
                } else {
                  this.toast.add({ severity: 'error', summary: 'Erro', detail: respLimparCarrinho.message, life: 3000 });
                }
                
          } catch (error) {
                console.error('Error ao remover todos os produtos do carrinho: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao remover todos os produtos do carrinho.', life: 3000 });
          }
            this.carregarCarrinho();
        },

         async removerProdutoCarrinho(carrinhoId) {
          try {
                const response = await axios.delete(`${BASE_URL}/carrinho/removeCarrinho/${carrinhoId}`);
                const respRemCarrinho = response.data
                
                if (respRemCarrinho.success) {
                    this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respRemCarrinho.message, life: 3000 });
                } else { 
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: respRemCarrinho.nessage, life: 3000 });
                }
                
          } catch (error) {
                console.error('Error ao remover produto do carrinho: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao remover produto do carrinho.', life: 3000 });
          }
            this.carregarCarrinho()
        },

        onclickBtnIrPagamento() {
          this.$router.push('/newshopping')
        },

        getProdutoImage(imagem) {
            return `data:image/jpeg;base64,${imagem}`;
        },

    }

    
  };</script>

<style scoped>
.template {
  background-color: aqua;
}

.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    position:fixed;
    top: 0;
    width: 100%;
    padding: 5px;
    border-bottom: 1px solid #ddd;;
    background-color:rgb(245, 245, 245);
}

.texto-carrinho {
    font-size: 22px;
    font-weight: bold;
}

.div-header-right {
  display: flex;
  flex-direction: column;
}

.div-header-total {
  display: flex;
  align-items: center;

}

.texto-total {
  margin: 3px;
  font-weight: bold;
}

.texto-valor-total {
  margin: 3px;
  color: green;
  font-size: 20px;
}

.btn-remover-todos-itens {
    font-size: 12px;
    height: 35px;
    border: none;
    margin: 5px;
    background-color: red;
    color: white;
    border-radius: 4px;
}

.btn-remover-todos-itens:hover{
    background-color: darkred;  
}

.btn-ir-pagamento {
    font-size: 12px;
    height: 35px;
    border: none;
    margin: 5px;
    color: white;
    border-radius: 4px;
}

.btn-ir-pagamento:hover {
    background-color: #1976d2;
}

.body {
    overflow-y: auto; /* Adiciona barra de rolagem */
    margin-top: 130px;
    margin-bottom: 90px;
}

.texto-nenhum-item-carrinho {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80%;
}

.card {
  display: flex;
  flex-direction: column;
  margin: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;;
  background-color:rgb(245, 245, 245);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.imagem {
  width: 80px;
  height: 80px;
  border-radius: 5px;
  align-self: center;
}

.descricao {
  margin: 2px;
}

.preco {
  margin: 2px;
  font-size: 20px;
  color: green;
}

.disponivel {
  margin: 2px;
}

.qtde {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 2px;
}

.div-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.texto-total {
  margin:2px;
}

.valor-total {
  margin: 2px;
  font-size: 20px;
  color: green;
}

.btn-remover {
  background-color: red;
  color: white;
  border: none;
  transition: background-color 0.5s;
}

.btn-remover:hover {
  background-color: darkred;
}
</style>