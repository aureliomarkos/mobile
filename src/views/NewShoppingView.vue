<template>

<div class="header">

        <!-- componentes do lado esquerdo do header -->
        <div class="div-btn-goback">
            <p-button class="btn-goback" icon="pi pi-arrow-left" @click="onclickBtnGoBack()"></p-button>
            <p class="texto-compras">Compras</p>
        </div>

        <!-- componentes do lado direito do header -->
        <div class="div-valores">
            
            <!-- total produtos -->
            <div class="div-total-produtos">
                <p class="texto-total-produtos">Total Produtos:</p>
                <p class="total-produtos">{{ precoFormatado(valorTotalCarrinho) }}</p>
            </div>
            
            <!-- total frete -->
            <div class="div-total-frete">
                <p class="texto-total-frete">Total Frete:</p>
                <p class="total-frete"> {{ precoFormatado(totalFrete) }}</p>
            </div>
            
            <!-- valor total -->
            <div class="div-valor-total">
                <p class="texto-valor-total">Valor Total:</p>
                <p class="valor-total">{{ precoFormatado(valorTotal) }}</p>
            </div>
        </div>

</div>

<!-- card endereço principal -->
<div class="div-card-endereco">
    <div class="card-endereco">
        <p class="texto-principal">Endereço</p>
        <div class="div-rua-nro-bairro">
            <p class="rua">Rua {{ endereco.rua }},</p>
            <p class="nro"> {{ endereco.nro }}</p>
            <p class="bairro"> {{ endereco.bairro }}</p>
        </div>

        <div class="div-cep-cidade-estado">
            <p class="cep">{{ endereco.cep }}</p>
            <p class="cidade">{{ endereco.cidade }}</p>
            <p class="estado">/ {{ endereco.estado }}</p>
        </div>

        <div>
            <p class="complemento"> {{ endereco.complemento }}</p>
        </div>
    </div>
</div>

<!-- card formas de pagamento -->
<div class="div-forma-pagto">
    <div class="card-forma-pagto">
        
        <p class="texto-forma-pagto">Forma de Pagamento</p>
        
        <input  class="pix" type="radio" id="pix" value="Pix" v-model="formaPagto" />
        <label for="pix">Pix</label>
        <br>
        
        <input class="boleto" type="radio" id="boleto" value="Boleto" v-model="formaPagto" />
        <label for="boleto">Boleto Bancário</label>
        <br>
        
        <input class="cartao" type="radio" id="cartao" value="Cartao" v-model="formaPagto" />
        <label for="cartao">Cartão de Crédito</label>

    </div>
</div>

<div>
    <p-button class="btn-fazer-pedido" label="Fazer Pedido" icon="pi pi-dollar" @click="onclickBtnFazerPedido()"></p-button>
</div>

</template>

<script>
import { ref } from 'vue'

import axios from '@/axios';

import { BASE_URL } from '@/baseurl.config';

import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

import { formatCurrency } from '@/utils/currency'

export default {
    components: {
        'p-button': Button,
    },

    data() {
        const clienteId = this.$store.state.user.userId
        const endereco = ref([])
        const formaPagto = ref('Pix')
        const toast = useToast()
        const valorTotalCarrinho = 0
        const totalFrete = 55.45
        const valorTotal = 0

        return {
            clienteId,
            endereco,
            formaPagto,
            toast,
            valorTotalCarrinho,
            totalFrete,
            valorTotal
        }    
    },

    async created() {
        await this.carregarEndereco()
        await this.getValorTotalCarrinho()
        this.valorTotal = parseFloat(this.valorTotalCarrinho) + parseFloat(this.totalFrete)
    },
 
    methods: {

        async getValorTotalCarrinho() {
            const clienteId = this.clienteId
            try {
                const response = await axios.get(`${BASE_URL}/carrinho/valorTotalCarrinho`, { params: { clienteId }});
                const respValorTotalCarrinho = response.data
                if (respValorTotalCarrinho.success) { 
                    this.valorTotalCarrinho = respValorTotalCarrinho.data[0].valorTotalCarrinho;
                } else {
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: respValorTotalCarrinho.message, life: 3000 });
                }
            } catch (error) {
                console.error('Error ao somar os produtos do carrinho: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao somar os produtos do carrinho.', life: 3000 });
            }
        },

        async carregarEndereco() {
            const clienteId = this.clienteId
            try {
                const response = await axios.get(`${BASE_URL}/enderecos/getEnderecoPrincipal`, { params: { clienteId }});
                const respGetEndPrincipal = response.data
                if (respGetEndPrincipal.success) {
                    this.endereco = respGetEndPrincipal.data[0];
                } else {
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: respGetEndPrincipal.message, life: 3000 });
                }
            } catch (error) {
                console.error('Error ao localizar endereço principal do cliente: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao localizar endereço principal do cliente:', life: 3000 });
            }
        },

        precoFormatado(preco) {
            return formatCurrency(preco)
        },
        
        async onclickBtnFazerPedido() {
            const clienteId = this.clienteId
            const enderecoId = this.endereco.id
            const formaPagto =  this.formaPagto
            const totalFrete = this.totalFrete
            const valorTotal = parseFloat(this.valorTotal.toFixed(2))
            
            try {
                const response = await axios.post(`${BASE_URL}/pedidos/addPedido`, { clienteId, enderecoId, formaPagto, totalFrete,  valorTotal });
                const respAddPedido = response.data;
                if (respAddPedido.success) { this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respAddPedido.message, life: 3000 }); }
                else { this.toast.add({ severity: 'error', summary: 'Erro', detail: respAddPedido.message, life: 3000 }); }

            } catch (error) {
                console.error('Error ao realizar o pedido: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao realizar o pedido.', life: 3000 });
            }
                setTimeout(() => { this.$router.push('/') }, 3000)
        },

        onclickBtnGoBack() {
            this.$router.push('/cart')
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
    justify-content:space-between
}

.btn-goback:hover {
    background-color: #1976d2;
}

.texto-compras {
    margin-left: 5px;
}

.div-valores {
    display:flex;
    flex-direction: column;
    justify-content: space-between;    
}

.div-total-produtos {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.texto-total-produtos {
    margin: 2px;
}

.total-produtos {
    margin: 2px;
    font-size: 20px;
    color: green;
}

.div-total-frete {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.texto-total-frete {
    margin: 2px;
}

.total-frete {
    margin: 2px;
    font-size: 20px;
    color: green;
}

.div-valor-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.texto-valor-total {
    margin: 2px;
}

.valor-total {
    margin: 2px;
    font-size: 20px;
    color: green;
}

.div-card-endereco {
    display: flex;
    flex-direction: column;
    margin-top: 120px;
}

.card-endereco {
    margin: 10px;
    border: 1px solid #1976d2;
    border-radius: 8px;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.texto-principal {
    display: flex;
    font-weight: bold;
    color: white;
    background-color: #1e90ff;
    align-items: center;
    height: 30px;
    margin: 0px;
    padding-left: 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.div-rua-nro-bairro {
    display: flex;
}

.rua {
    margin: 2px;
    padding-left: 10px;
}

.nro {
    margin: 2px;
}

.bairro {
    margin: 2px;
}

.div-cep-cidade-estado {
    display: flex;
}

.cep {
    margin: 2px;
    padding-left: 10px;
}

.cidade {
    margin: 2px;
}

.estado {
    margin: 2px;
}

.complemento {
    margin: 2px;
    padding-left: 10px;
    padding-bottom: 10px;
}

.div-forma-pagto {
    display: flex;
    flex-direction: column;
}

.card-forma-pagto {
    margin: 10px;
    border: 1px solid #1976d2;
    border-radius: 8px;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.texto-forma-pagto {
    display: flex;
    font-weight: bold;
    color: white;
    background-color: #1e90ff;
    align-items: center;
    height: 30px;
    margin: 0px;
    padding-left: 10px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
}

.pix {
    margin-top: 10px;
    margin-left: 10px;
}

.boleto {
    margin-left: 10px;
}

.cartao {
    margin-left: 10px;
    margin-bottom: 10px;
}

.btn-fazer-pedido {
    margin: 10px;
    width: 95%;
}

.btn-fazer-pedido:hover {
    background-color: #1976d2;
}

</style>