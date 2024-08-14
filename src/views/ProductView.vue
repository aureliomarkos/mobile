<template>
    <div v-if="produto">
        <div class="div-imagem">
            <img v-if="produto.imagem_1" :src="getProdutoImage(produto.imagem_1)" alt="imagem_1" class="imagem"/>
            <img v-if="produto.imagem_2" :src="getProdutoImage(produto.imagem_2)" alt="imagem_2" class="imagem"/>
            <img v-if="produto.imagem_3" :src="getProdutoImage(produto.imagem_3)" alt="imagem_3" class="imagem"/>
            <img v-if="produto.imagem_4" :src="getProdutoImage(produto.imagem_4)" alt="imagem_4" class="imagem"/>
            <img v-if="produto.imagem_5" :src="getProdutoImage(produto.imagem_5)" alt="imagem_5" class="imagem"/>
        </div>

        <!-- Produto favorito -->
        <div class="div-icon-favorito-descricao-preco">
            <FavoriteIcon 
                class="icon"
                :initialFavorito="isFavorito" 
                @update:favorito="atualizarFavorito">
            </FavoriteIcon>
            
            <p class="descricao"> {{ produto.descricao }}</p>
            <p class="preco"> {{ precoFormatado(produto.preco) }}</p>
        </div>

        <!-- Caracteristicas do produto -->
            <div class="div-caracteristica">
                <p class="texto-caracteristica-produto">Características do Produto</p>
                <p-button icon="pi pi-arrow-right" size="large" v-on:click="mostrarModal = true"/>
            </div>
        <div> 
            <p-button class="btn-add-carrinho" label="Adicionar ao Carrinho" icon="pi pi-cart-plus" v-on:click="onClickButtonAddCart()" ></p-button>
        </div> 

        <!-- Modal para mostrar as caracteristicas do produto -->
        <div v-if="mostrarModal" class="modal-backdrop" @click="fecharModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <p>Descrição do Produto</p>
                    <p-button class="modal-button" label="Fechar" icon="pi pi-times" size="large" iconPos="left" @click="fecharModal"/>
                </div>

                <div class="modal-body">
                    <p>{{ produto.caracteristica }}</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Button from 'primevue/button';

import axios from '@/axios';

import { BASE_URL } from '@/baseurl.config';

import FavoriteIcon from '@/components/FavoriteIcon.vue';
import { formatCurrency } from '@/utils/currency';
import { useToast } from 'primevue/usetoast';


export default{
    name: 'ProductView',

    components:{
        'p-button': Button,
        FavoriteIcon,
    },

    data() {
        const clienteId = this.$store.state.user.userId
        const toast = useToast()
        const favorito = null
        
        return {
            produto: null,
            mostrarModal: false,
            isFavorito: false,
            clienteId,
            toast,
            favorito
        }
    },

    async created() {

        const data = this.$route.query.data;
        if (data) {
            this.produto = await JSON.parse(data);
        }
        
        this.loadProdutoDescricao()
    
        if (this.clienteId && this.produto) {
            this.verifyIsFavorito(this.clienteId, this.produto.id)
        }
    },

    methods:{

        fecharModal() {
            this.mostrarModal = false;
        },
        
        async onClickButtonAddCart(){
            const clienteId = this.clienteId
            const produtoId = this.produto.id

            try {
                    const response = await axios.post(`${BASE_URL}/carrinho/addCarrinho`, { clienteId, produtoId });
                    const respAddCarrinho = response.data
                    if (respAddCarrinho.success) { this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respAddCarrinho.message, life: 3000 })}
                    else { this.toast.add({ severity: 'error', summary: 'Erro', detail: respAddCarrinho.message, life: 3000 })}
                
                } catch (error) {
                    console.error('Error ao adicionar produto no carrinho:', error);
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível adicionar produto no carrinho.', life: 3000 });
                    return
                }
        },

        
        // carregar informações do produto na tabela produto_descricao
        async loadProdutoDescricao(){
            const produtoId = this.produto.id
            
            try {
                    const response = await axios.get(`${BASE_URL}/produtoDescricao`, { params: { produtoId }});
                    const respProdDescricao = response.data
                    if (respProdDescricao.success) {
                        this.produto = {...this.produto, ...respProdDescricao.data[0]};
                    } else {
                        this.toast.add({ severity: 'error', summary: 'Erro', detail: respProdDescricao.message, life: 3000 });
                    }

                } catch (error) {
                    console.error('Error ao selecionar detalhes do produto: ', error);
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao selecionar detalhes do produto.', life: 3000 });
                    return
                }
        },
        
        // atualizar favoritos
        async atualizarFavorito(novoEstadoFavorito) {
            const clienteId = this.clienteId
            const produtoId = this.produto.id
            
            if(novoEstadoFavorito) {
                try {
                    const response = await axios.post(`${BASE_URL}/favoritos/addFavorito`, { clienteId, produtoId });
                    const respAddFavorito = response.data
                    if (respAddFavorito.success) { 
                        this.favorito = respAddFavorito.data;
                        this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respAddFavorito.message, life: 3000 });
                    } else { 
                        this.toast.add({ severity: 'error', summary: 'Erro', detail: respAddFavorito.message, life: 3000 })
                    }
                    
                } catch (error) {
                    console.error('Error ao inserir favorito: ', error);
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao inserir favorito.', life: 3000 })
                }

            } else {
                try {
                    const response = await axios.delete(`${BASE_URL}/favoritos/removeFavoritoCP/${clienteId}/${produtoId}`)
                    const respRemvFavorito = response.data
                    if (respRemvFavorito.success){
                        this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respRemvFavorito.message, life: 3000 });
                    } else {
                        this.toast.add({ severity: 'error', summary: 'Erro', detail: respRemvFavorito.message, life: 3000 })
                    }
                } catch (error) {
                    console.error('Error ao remover favorito:', error);
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao remover favorito.', life: 3000 });
                }
            }    
        },

        precoFormatado(preco) {
            return formatCurrency(preco)
        },

        async verifyIsFavorito(clienteId, produtoId) {
            try {
                const response = await axios.get(`${BASE_URL}/favoritos/produtoInFavoritos`, { params: { clienteId, produtoId }});
                this.isFavorito = response.data;
            } catch (error) {
                console.error('Error ao localizar favorito:', error);
            }
        },

        getProdutoImage(imagem) {
            return `data:image/jpeg;base64,${imagem}`;
    },

    }        
}

</script>

<style scoped>
.div-imagem{
    display: flex;
    justify-content: space-between;
    align-items: center; /* Opcional: centraliza as imagens verticalmente */
    margin: 5px;
    border: 1px solid #ddd;
    border-radius: 8px;;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.imagem{
    width: 80px;
    height: 80px;
    margin:5px;
    border-radius: 5px;
    border-bottom: 1px solid #ddd;;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.div-icon-favorito-descricao-preco {
    display: flex;
    flex-direction: column;
    margin: 5px;
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 8px;;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.icon {
    align-self: flex-end;
}
.descricao{
    font-size: 24px;
    margin: 2px;
}

.preco{
    color: green;
    font-size: 24px;
    margin: 2px;
}

.div-caracteristica{
    display: flex;
    align-items: center;
    padding: 20px;
    margin: 5px;
    justify-content:space-between;
    border: 1px solid #ddd;
    border-radius: 8px;;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.texto-caracteristica-produto{
    font-size: 20px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ddd;
    position: sticky; /* Torna o cabeçalho fixo */
    top: 0; /* Fixa no topo do modal */
    border-bottom: 1px solid #ddd;;
    background-color: white;

}

.modal-button{
    height: 40px;
    font-size: 14px;
}

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    width: 80%;
    max-width: 500px;
    height: 500px;
    overflow: auto;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border-radius: 20px;
}

.modal-body {
    padding: 20px;
    height: 360px; /* Altura fixa para a área rolável */
    overflow-y: auto; /* Adiciona barra de rolagem */
    flex: 1; /* Faz com que o corpo ocupe o espaço disponível */
}

.btn-add-carrinho{
    width: 95%;
    margin-top: 20px;
    margin-left: 10px;
}
</style>
