<template>
<div class="div-nova-conta">
    <div class="body">
        <p class="titulo">Nova Conta</p>

        <!-- nome -->
        <p-float-label>
            <input v-model="nome" id="nome" class="nome" placeholder="nome"/>
            <label for="nome">nome</label>
        </p-float-label>

        <!-- cpf -->
        <br>
        <p-float-label>
            <input v-model="cpf" id="cpf" class="cpf" v-mask="'###.###.###-##'" placeholder="cpf" inputmode="numeric"/>
            <label for="cpf">cpf</label>
        </p-float-label>

        <!-- rg -->
        <br>
        <p-float-label>
            <input v-model="rg" id="rg" class="rg" placeholder="rg" inputmode="numeric"/>
            <label for="rg">rg</label>
        </p-float-label>

        <!-- celular -->
        <br>
        <p-float-label>
            <input v-model="celular" id="celular" class="celular" v-mask="'(##)#.####.####'" placeholder="celular" inputmode="numeric"/>
            <label for="celular">celular</label>
        </p-float-label>

        <!-- email -->
        <br>
        <p-float-label>
            <input v-model="email" id="email" class="email" placeholder="email"/>
            <label for="email">email</label>
        </p-float-label>

        <!-- data nascimento -->
        <br>
        <p-float-label>
            <input v-model="dataNasc" id="dataNasc" class="dataNasc" v-mask="'##.##.####'" placeholder="data nascimento"/>
            <label for="dataNasc">data nascimento</label>
        </p-float-label>

        <!-- senha -->
        <br>
        <p-float-label>
            <input v-model="senha" id="senha" class="senha" placeholder="senha" type="password"/>
            <label for="senha">senha</label>
        </p-float-label>
        
        <p-button label="Cadastrar-se" class="btn-nova-conta" @click="onclickBtnNovaConta()"/>
    </div>
</div>
</template>

<script>
import { ref } from 'vue'
import { mask } from 'vue-the-mask'

import axios from '@/axios';

import { BASE_URL } from '@/baseurl.config';

import { validDate, dateToSql } from '@/utils/date_fn';

import Button from 'primevue/button'
import FloatLabel from 'primevue/floatlabel'
import { useToast } from 'primevue/usetoast'

export default {
    name: 'NewAccountView',
    
    directives: { mask },

    components: {
        'p-button': Button,
        'p-float-label': FloatLabel
    },

    data() {
        const nome = ref('')
        const cpf = ref('')
        const rg = ref('')
        const celular = ref('')
        const email = ref('')
        const dataNasc = ref('')
        const senha = ref('')
        const toast = useToast()
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return { nome, cpf, rg, email, celular, senha, dataNasc, toast, regex }
    },

    methods: {

        async createNewUsuario () {

            const nome = this.nome
            const cpf = this.cpf
            const rg = this.rg
            const email = this.email
            const celular = this.celular
            const dataNasc = dateToSql(this.dataNasc)
            const senha = this.senha

            try {
                const response = await axios.post(`${BASE_URL}/clientes/addCliente`, { nome, cpf, rg, email, celular, dataNasc, senha });
                const resultAddCliente = response.data;

                if (resultAddCliente.success){
                    this.toast.add({ severity: 'success', summary: 'Sucesso', detail: resultAddCliente.message, life: 3000 });
                    this.$router.push('/login')
                } else {
                    this.toast.add({ severity: 'error', summary: 'Erro', detail: resultAddCliente.message, life: 3000 })
                }

            } catch (error) {
                console.error('Error ao cadastrar novo cliente: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao cadastrar novo cliente.', life: 3000 })
            }
        },

        validateEmail () {
            return this.regex.test(this.email);
        },

        async onclickBtnNovaConta() {
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

            } else if(!this.dataNasc){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Data Nascimento" deve ser informado.', life: 3000 });
                return
                
            } else if(!this.senha){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Senha" deve ser informado.', life: 3000 });
                return

            } else if(!this.validateEmail()){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Email inválido.', life: 3000 });
                return
            
            } else if(!validDate(this.dataNasc)){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Data inválida.', life: 3000 });
                return
            }
            this.createNewUsuario()

        }
    }
}
</script>

<style scoped>
.div-nova-conta {
    display: flex;
    justify-content: center;
}

.body {
    display: flex;
    flex-direction: column;
    width: 330px;
    padding: 20px;
    margin: 20px;
    margin-top: 90px;
    border: 1px solid #2196f3;;
    border-radius: 8px;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.titulo {
    font-size: 24px;  
    text-align: center;
    margin-bottom: 20px;
    color: #2196f3;;
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

.dataNasc {
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

.btn-nova-conta {
    width: 100%;
    margin-top: 20px;
}
</style>