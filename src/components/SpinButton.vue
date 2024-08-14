<template>
        <div class="spin-button">
            <i class="btn-dec pi pi-minus" @click="decValue()"></i>
            <p class="spin-qtde">{{ qtde }}</p>
            <i class="btn-inc pi pi-plus" @click="incValue()"></i>
        </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';

export default {
    name: 'SpinButton',

    data(){
        
        const toast =useToast()

        return {
            qtde: this.qtdeCarrinho,
            toast
        }
    },

    props: {
        carrinhoId: {
            type: Number,
            default: null
        },

        qtdeCarrinho: {
            type: Number,
            default: 1
      },

        qtdeProduto: {
            type: Number,
            default: 0
      }
    },
    
    methods:{

        incValue() {
            this.qtde += 1
            if (this.qtde > this.qtdeProduto){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Quantidade indisponível do Produto.', life: 3000 });
                this.qtde = this.qtdeProduto
                return
            }
           
            this.$emit('update:qtde', this.carrinhoId, this.qtde);
        },

        decValue() {
            if (this.qtde === 1){
                return
            }
            this.qtde -= 1
            this.$emit('update:qtde', this.carrinhoId, this.qtde);
        },
    }

}
</script>

<style scoped>
.spin-button {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100px;
    height: 35px;
    padding: 10px;;
    background-color: #2196f3;
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
}

.btn-dec {
    cursor: pointer;
}

.btn-dec:hover {
    width: 16px;
    background-color: #1671bb;
    border-radius: 8px;
}

.spin-qtde {
    margin-left: 10px;
    margin-right: 10px;
}

.btn-inc {
    cursor: pointer;
}

.btn-inc:hover {
    width: 16px;
    background-color: #1671bb;
    border-radius: 8px;
}

</style>
