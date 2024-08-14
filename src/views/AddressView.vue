<template>
    <div class="header">
        <p>Endereços</p>
        <div class="div-btn-novo-endereco">
            <p-button icon="pi pi-map-marker" id="endereco" @click="goNewAddress()"></p-button>
            <label>Novo Endereço</label>
        </div>
    </div>

    <div :style="{ height: alturaPagina + 'px' }"  class="body">
        <div v-for="endereco in enderecos" :key="endereco.id" class="card">
            <div class="div-padrao">
                <p v-if="endereco.principal" class="texto-principal">Principal</p>
                 <p-button v-else label="Deixar este endereço como Principal" text class="btn-endereco_principal" @click="setEnderecoPrincipal(endereco.id)"/>
                <div class="div-btn-edit-delete">
                    <p-button icon="pi pi-pencil" class="btn-edit" @click="onclickBtnEditEndereco(endereco)"/>
                    <p-button icon="pi pi-trash" class="btn-delete" @click="onclickBtnRemoveEndereco(endereco.id)"/>
                </div>
            </div>
            
            <div class="div-rua-nro-bairro">
                <p class="rua">Rua {{ endereco.rua }},</p>
                <p class="nro"> {{ endereco.nro }}</p>
                <p class="bairro"> {{ endereco.bairro }}</p>
            </div>

            <div class="div-cep-cidade-estado">
                <p class="cep"> {{ endereco.cep }}</p>
                <p class="cidade"> {{ endereco.cidade }}</p>
                <p class="estado"> {{ endereco.estado }}</p>
            </div>

            <div>
                <p class="complemento"> {{ endereco.complemento }}</p>
            </div>

        </div>
    </div>
</template>

<script>
import { ref } from 'vue'

import axios from '@/axios';

import { BASE_URL } from '@/baseurl.config';

import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

export default {
    components: {
        'p-button': Button
    },
    
    data() {
        const enderecos = ref([])
        const toast = useToast()
        const clienteId = this.$store.state.user.userId
        const alturaPagina = ref(window.innerHeight)

        return {
            enderecos,
            clienteId,
            toast,
            alturaPagina
        }
    },

    async created() {
        await this.carregarEnderecos()
        this.alturaPagina = this.alturaPagina - 185
    },

    methods:{

        async carregarEnderecos() {
            const clienteId = this.clienteId

            try {
                const response = await axios.get(`${BASE_URL}/enderecos`, { params: { clienteId }});
                const respEndereco = response.data
                if (respEndereco.success){
                    this.enderecos = respEndereco.data
                } else {
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: respEndereco.message, life: 3000 })
                }
            } catch (error) {
                console.error('Error ao selecionar endereços: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao selecionar endereços.', life: 3000 })
            }
        },

        async onclickBtnRemoveEndereco(enderecoId) {

            try {
                const response = await axios.delete(`${BASE_URL}/enderecos/removeEndereco`, { params: { enderecoId }} );
                const respRemEndereco = response.data
            
                if ( respRemEndereco.success ){ this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respRemEndereco.message, life: 3000 })}
                else { this.toast.add({ severity: 'error', summary: 'Erro', detail: respRemEndereco.message, life: 3000 })}
            
            } catch (error) {
                console.error('Error ao remover endereço: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao remover Endereço', life: 3000 })
            }
            this.carregarEnderecos()
        },

        async onclickBtnEditEndereco(endereco) {
            this.$router.push({ path:'/editaddress', query: { data: JSON.stringify(endereco) }} );
        },

        async setEnderecoPrincipal(enderecoId) {
            const clienteId = this.clienteId

            try {
                const response = await axios.put(`${BASE_URL}/enderecos/setEnderecoPrincipal`, { enderecoId, clienteId });
                const respSetEndPrincipal = response.data
                if (respSetEndPrincipal.success) {
                    this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respSetEndPrincipal.message, life: 3000 })
                } else {
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: respSetEndPrincipal.message, life: 3000 })
                }
            } catch (error) {
                console.error('Error ao alterar endereço principal: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao alterar endereço principal.', life: 3000 })
            }
            this.carregarEnderecos()
        },

        goNewAddress(){
            this.$router.push('/newaddress');
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

.div-btn-novo-endereco {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.body {
    overflow-y: auto; /* Adiciona barra de rolagem */
    margin-top: 90px;
    margin-bottom: 95px;
}

.card {
    display: flex;
    flex-direction: column;
    margin: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.div-padrao {
    display: flex;
    justify-content: space-between;
    margin: 0px;
}

.texto-principal {
    font-weight: bold;
    color:#1976d2;
    margin: 2px;
    padding: 2px;
}

.btn-endereco_principal {
    padding: 2px;
}

.div-btn-edit-delete {
    display: flex;
    align-items: center;
}

.btn-edit {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    padding: 2px;
}

.btn-delete {
    width: 30px;
    height: 30px;
    background-color: red;
    padding: 2px;
}

.rua,
.nro,
.bairro,
.cidade,
.estado,
.cep,
.complemento {
    margin: 2px;
}

.div-rua-nro-bairro {
    display: flex;
}

.div-cep-cidade-estado {
    display: flex;
}
</style>
