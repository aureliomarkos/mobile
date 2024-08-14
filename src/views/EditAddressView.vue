<template>
    <div>
        <div class="header">
            <p-button icon="pi pi-arrow-left" @click="goBackEndereco()"></p-button>
            <p class="texto-novo-endereco">Alterar Endereço</p>
        </div>

            <div class="div-novo-endereco">

                <p class="texto-alterar-endereco">Alterar Endereço</p>

                <!-- cep -->
                <label for="cep">CEP</label>
                <input v-model="cep" id="cep" class="cep" placeholder="cep" v-mask="'#####-###'" />

                <!-- rua -->
                <br>
                <label for="rua">RUA</label>
                <input v-model="rua" id="rua" class="rua" placeholder="rua"/>

                <!-- nro -->
                <br>
                <label for="nro">NÚMERO</label>
                <input v-model="nro" id="nro" class="nro" placeholder="número"/>

                <!-- bairro -->
                <br>
                <label for="bairro">BAIRRO</label>
                <input v-model="bairro" id="bairro" class="bairro" placeholder="bairro"/>

                <!-- cidade -->
                <br>
                <label for="cidade">CIDADE</label>
                <input v-model="cidade" id="cidade" class="cidade" placeholder="cidade"/>

                <!-- estado -->
                <br>
                <label for="estado">ESTADO</label>
                <input v-model="estado" id="estado" class="estado" placeholder="estado"/>

                <!-- complemento -->
                <br>
                <label for="complemento">COMPLEMENTO</label>
                <input v-model="complemento" id="complemento" class="complemento" placeholder="complemento"/>

                <!-- botão cadastrar -->
                <br>
                <p-button label="Salvar" @click="onclickButtonSalvarEndereco()"/>
                <br>

        </div>

    </div>    
</template>

<script>
import { ref } from 'vue'
import { mask } from 'vue-the-mask';

import axios from '@/axios';

import { BASE_URL } from '@/baseurl.config';

import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';


export default {
    
    directives: { mask },

    components: {
        'p-button': Button
    },

    data() {
        const endereco = ref('')
        const cep = ref('')
        const rua = ref('')
        const nro = ref('')
        const bairro = ref('')
        const cidade = ref('')
        const estado = ref('')
        const complemento = ref('')
        const toast = useToast()

        return {
            endereco,
            cep,
            rua,
            nro,
            bairro,
            cidade,
            estado,
            complemento,
            toast,
        }
    },

    async created() {
        
        const data = this.$route.query.data;
        if (data) {
            this.endereco = await JSON.parse(data);
            this.cep = this.endereco.cep
            this.rua = this.endereco.rua
            this.nro = this.endereco.nro
            this.bairro = this.endereco.bairro
            this.cidade = this.endereco.cidade
            this.estado = this.endereco.estado
            this.complemento = this.endereco.complemento
        }

    },

    methods: {

        goBackEndereco() {
            this.$router.push('/address');
        },

        async onclickButtonSalvarEndereco() {
            if( !this.cep ){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Cep" deve ser informado.', life: 3000 })
                return
            
            } else if( !this.rua ){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Rua" deve ser informado.', life: 3000 })
                return
            
            } else if( !this.nro ){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Número" deve ser informado.', life: 3000 })
                return
            
            } else if( !this.bairro ){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Bairro" deve ser informado.', life: 3000 })
                return
            
            } else if( !this.cidade ){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Cidade" deve ser informado.', life: 3000 })
                return
            
            } else if( !this.estado ){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Campo "Estado" deve ser informado.', life: 3000 })
                return
            }

            const enderecoId = this.endereco.id
            const cep = this.cep
            const rua = this.rua
            const nro = this.nro
            const bairro = this.bairro
            const cidade = this.cidade
            const estado = this.estado
            const complemento = this.complemento

            try {
                const response = await axios.post(`${BASE_URL}/enderecos/updateEndereco`, { enderecoId, cep, rua, nro, bairro, cidade, estado, complemento });
                const respUpdtdEndereco = response.data;
                if (respUpdtdEndereco.success){ this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respUpdtdEndereco.message, life: 3000 })}
                else { this.toast.add({ severity: 'error', summary: 'Erro', detail: respUpdtdEndereco.message, life: 3000 })}

            } catch (error) {
                console.error('Error ao alterar endereço: ', error);
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Error ao alterar endereço.', life: 3000 });
            }
            setTimeout(() => { this.$router.push('/address') }, 3000)

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
    border-bottom: 1px solid #ddd;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.div-novo-endereco {
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* Adiciona barra de rolagem */
    padding: 10px;
    margin-top: 80px;
    margin-bottom: 90px;
    margin-left: 10px;
    border: 1px solid #2196f3;;
    border-radius: 8px;
    background-color:rgb(245, 245, 245);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.texto-alterar-endereco {
    font-size: 24px;  
    text-align: center;
    margin-bottom: 20px;
    color: #2196f3;;
}

label {
    margin-left:5px;
    font-size: 12px;
    font-weight: bold;
}

.texto-novo-endereco {
    padding-left: 10px;
}

.cep {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.rua {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.nro {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.bairro {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.cidade {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.estado {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

.complemento {
    width: 100%;
    height: 45px;
    font-size: 20px;
    border-radius: 8px;
    border: 1px solid #2196f3;
}

</style>
