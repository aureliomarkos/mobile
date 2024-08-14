<template>
<div :style="{ height: alturaPagina + 'px' }" class="div-nova-conta">
    <div class="body">
        <p class="texto-dados-pessoais">Dados Pessoais</p>

        <!-- email -->
            <label for="email">EMAIL</label>
            <input v-model="email" id="email" class="email" placeholder="email" type="text" disabled/>
        
        <!-- nome -->
        <br>
            <label for="nome">NOME</label>
            <input v-model="nome" id="nome" class="nome" placeholder="nome"/>

        <!-- cpf -->
        <br>
            <label for="cpf">CPF</label>
            <input v-model="cpf" id="cpf" class="cpf" v-mask="'###.###.###-##'" placeholder="cpf" inputmode="numeric"/>

        <!-- rg -->
        <br>
            <label for="rg">RG</label>
            <input v-model="rg" id="rg" class="rg" placeholder="rg" inputmode="numeric"/>

        <!-- celular -->
        <br>
            <label for="celular">CELULAR</label>
            <input v-model="celular" id="celular" class="celular" v-mask="'(##)#.####.####'" placeholder="celular" inputmode="numeric"/>

        <!-- data nascimento -->
        <br>
            <label for="dataNasc">DATA NASCIMENTO</label>
            <input v-model="dataNasc" id="dataNasc" class="data-nasc" v-mask="'##.##.####'" placeholder="data nascimento" inputmode="numeric"/>

        <!-- senha -->
        <br>
            <label for="senha">SENHA</label>
            <input v-model="senha" id="senha" class="senha" placeholder="senha" type="password"/>
        <p-button label="Alterar" class="btn-alterar" @click="onClickBtnAlterarConta"/>
    </div>
</div>
</template>

<script>
import { ref } from 'vue'
import { mask } from 'vue-the-mask'

import axios from '@/axios';

import { BASE_URL } from '@/baseurl.config';

import { dateToForm, dateToSql, validDate } from '@/utils/date_fn'

import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

export default {
    name: 'NewAccountView',
    
    directives: { mask },

    components: {
        'p-button': Button,
    },

    data() {
        const clienteId = this.$store.state.user.userId
        const email = ref('')
        const nome = ref('')
        const cpf = ref('')
        const rg = ref('')
        const celular = ref('')
        const dataNasc = ref('')
        const senha = ref('')
        const toast = useToast()
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const alturaPagina = ref(window.innerHeight);

        return { clienteId, email, nome, cpf, rg, celular, dataNasc, senha, toast, regex, alturaPagina }
    },

    async created() {
        await this.getCliente(this.clienteId)
        this.email = this.cliente.email
        this.nome = this.cliente.nome
        this.cpf = this.cliente.cpf
        this.rg = this.cliente.rg
        this.celular = this.cliente.celular
        this.dataNasc = dateToForm(this.cliente.data_nascimento)
        this.alturaPagina = this.alturaPagina - 80
    },

    methods: {

        async getCliente(clienteId){
            
            try {
                const response = await axios.get(`${BASE_URL}/clientes/<id>`, { params: { clienteId }});
                const respCliente = response.data
                if (respCliente.success) {
                    this.cliente = respCliente.data[0];
                } else {
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: respCliente.message, life: 3000 });
                }
                    
            } catch (error) {
                console.error('Error ao localizar cliente: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao localizar cliente.', life: 3000 });
            }
        },

        validateEmail () {
            return this.regex.test(this.email);
        },

        async onClickBtnAlterarConta() {
            if(!this.nome){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Nome" deve ser informado.', life: 3000 });
                return
            
            } else if(!this.cpf){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Cpf" deve ser informado.', life: 3000 });
                return

            } else if(!this.rg){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Rg" deve ser informado.', life: 3000 });
                return
            
            } else if(!this.celular){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Celular" deve ser informado.', life: 3000 });
                return
            
            } else if(!this.email){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Email" deve ser informado.', life: 3000 });
                return
            
            } else if(!this.validateEmail()){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Email inválido.', life: 3000 });
                return
            
            } else if(!validDate(this.dataNasc)){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Data inválida.', life: 3000 });
                return
            }

            const clienteId = this.clienteId
            const nome =  this.nome
            const cpf = this.cpf
            const rg = this.rg
            const celular = this.celular
            const dataNasc = dateToSql(this.dataNasc)
            const senha = this.senha

            try {
                const response = await axios.put(`${BASE_URL}/clientes/updateCliente`, { clienteId, nome, cpf, rg, celular, dataNasc, senha } );
                const respUpdtCliente = response.data
                
                if (respUpdtCliente.success) {
                     this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respUpdtCliente.message, life: 3000 });
                } else {
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: respUpdtCliente.message, life: 3000 });
                }
                setTimeout(() => { this.$router.push('/account') }, 3000)
                
            } catch (error) {
                console.error('Error ao alterar os dados do cliente: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao alterar os dados do cliente.', life: 3000 });
            }            
        }
    }
}
</script>

<style scoped>
label {
    margin-left:5px;
    font-size: 12px;
    font-weight: bold;
}

.div-nova-conta {
    display: flex;
    justify-content: center;
    align-items: center;
}

.body {
    display: flex;
    flex-direction: column;
    height: 620px;
    width: 330px;
    padding: 10px;
    margin: 20px;
    border: 1px solid #2196f3;;
    border-radius: 8px;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.texto-dados-pessoais {
    font-size: 24px;  
    text-align: center;
    margin-bottom: 20px;
    color: #2196f3;;
}

.email {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.nome {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.cpf {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.rg {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.celular {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.email {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.data-nasc {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.senha {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.btn-alterar {
    width: 100%;
    margin-top: 20px;
}
</style>