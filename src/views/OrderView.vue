<template>
<header class="header">
    <div class="div-btn-goback">
        <p-button class="btn-goback" icon="pi pi-arrow-left" @click="onclickBtnGoBack()"></p-button>
        <p class="texto-compras">Minhas compras</p>
    </div>
</header>


<div class="body" :style="{ height: alturaPagina + 'px' }">
    <div v-for="pedido in pedidos" :key="pedido.id" class="card">
        <div class="div-imagem">
            <img :src="getProdutoImage(pedido.imagem)" alt="Imagem" class="imagem">
            <p class="data">Data: {{ dataFormatada(pedido.data) }}</p>
            <p class="status">{{ pedido.status }}</p>
        </div>
            <p class="descricao">{{ pedido.descricao }}</p>
            <p class="preco">{{ precoFormatado(pedido.preco) }}</p>
        <div class="div-qtde">
            <p class="texto-qtde">Quantidade:</p>
            <p class="qtde">{{ pedido.qtde }}</p>
        </div>
        <div class="div-valor-total-produto">
            <p class="texto-total">Total:</p>
            <p class="valor-total-produto">{{ precoFormatado(pedido.valorTotalProduto) }}</p>
        </div>
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
import { dateTimeToForm } from '@/utils/date_fn';


export default {

components: {
    'p-button': Button
},

data() {
    const pedidos = ref([])
    const toast = useToast()
    const clienteId = this.$store.state.user.userId
    const alturaPagina = ref(window.innerHeight)

    return {
        pedidos,
        toast,
        clienteId,
        alturaPagina
    }
},

async created() {
    this.alturaPagina = this.alturaPagina - 180
    await this.carregarPedidos()
},

methods: {
    
    async carregarPedidos() {
        const clienteId = this.clienteId
        try {
            const response = await axios.get(`${BASE_URL}/pedidos`, { params: { clienteId }})
            const respPedidos = response.data
            if (respPedidos.success) {
                this.pedidos = respPedidos.data
            } else {
                this.toast.add({ severity: 'error', summary: 'Erro', detail: respPedidos.message, life: 3000 });
            }

        } catch {
            console.error('Erro ao selecionar pedidos do cliente.');
            this.toast.add({ severity: 'error', summary: 'Erro', detail: respPedidos.message, life: 3000 });
        }
    },

    getProdutoImage(imagem) {
            return `data:image/jpeg;base64,${imagem}`;
    },

    precoFormatado(preco) {
        return formatCurrency(preco)
    },

    dataFormatada(data) {
        return dateTimeToForm(data)
    },

    onclickBtnGoBack() {
        this.$router.push('/account')
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
    padding: 10px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.div-btn-goback {
    display: flex;
    flex-direction: row;
}

.btn-goback:hover {
    background-color: #1976d2;
}

.texto-compras {
    margin-left: 10px;
}

.body{
    overflow-y: auto;
    margin-top: 80px;
    margin-bottom: 80px;
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

.div-imagem {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.imagem {
    width: 80px;
    height: 80px;
    margin: 2px;
    border-radius: 8px;
}

.status {
    font-weight: bold;
    color:#1976d2;
}

.descricao {
    margin: 2px;
}

.preco {
    margin: 2px;
    color: green;
    font-size: 20px;
}

.div-qtde {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.texto-qtde {
    margin: 2px;
}

.qtde {
    margin: 2px;
    width: 50px;
    height: 30px;
    text-align: center;
    line-height: 30px; /* alinha na vertical o height tem que ser igual */
    background-color: #2196f3;
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
}

.div-valor-total-produto {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.texto-total {
    margin: 2px;
    font-weight: bold;
}

.valor-total-produto {
    margin: 2px;
    color: green;
    font-size: 20px;;
}
</style>