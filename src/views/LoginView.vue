<template>
        
    <!-- form login -->
    <div class="div-login">
      <div class="body">
          <form @submit.prevent="login">
              <p class="titulo">Login</p>
              <p-float-label>
                <p-input-text v-model="email" id="email" class="email" placeholder="Email"></p-input-text>
                <label for="email">email</label>
              </p-float-label>
              <br>
              <p-float-label>
                <p-input-text v-model="password" id="password" class="password " type="password" placeholder="Senha"></p-input-text>
                <label for="password">senha</label>
              </p-float-label>
              <br>
              <p-button label="Login" class="btn-login" @click="onclickButtonLogin()"/>
              <p-button label="Nova Conta" class="btn-nova-conta" @click="goNewAccount('/newaccount')"/>
          </form>
      </div>
  </div>
</template>
  
<script>
import { ref } from 'vue';
import { mapActions } from 'vuex';

import axios from '@/axios';

import { jwtDecode } from 'jwt-decode';

import { BASE_URL } from '@/baseurl.config';

// PrimeVue
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import { useToast } from 'primevue/usetoast';


export default {
    components: {
      'p-input-text': InputText,
      'p-button': Button,
      'p-float-label': FloatLabel
    },
  
    data() {
      const email = ref('')
      const password = ref('')
      const toast = useToast()
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return { email, password, toast, regex };
    },

    methods: {
        
        // vuex
        ...mapActions(['login']),

        showLoginError(mensagem){
            this.toast.add({ severity: 'error', summary: 'Erro', detail: mensagem, life: 3000 });
        },

        validateEmail () {
            return this.regex.test(this.email);
        },

        goNewAccount(path) {
            this.$router.push(path);
        },

        async onclickButtonLogin() {

            if (!this.email){
              this.showLoginError('Campo Email deve ser informado.')
              return
            }

            if (!this.password){
              this.showLoginError('Campo Senha deve ser informado.')
              return
            }

            if (!this.validateEmail(this.email)){
                this.toast.add({ severity: 'error', summary: 'Erro', detail: 'Email inválido.', life: 3000 });
                return
            }

          try {
              const response = await axios.post(`${BASE_URL}/clientes/login`, { email: this.email, senha: this.password });
              const respLogin = response.data
              if(respLogin.success) {
                  this.toast.add({ severity: 'success', summary: 'Sucesso', detail: respLogin.message, life: 3000 });
                  const token = respLogin.data;
                  localStorage.setItem('token', token);
                  const user = jwtDecode(token);
                  this.login({ token, user });
                  this.$router.push('/');
              } else {
                this.toast.add({ severity: 'error', summary: 'Erro', detail: respLogin.message, life: 3000 });
              }

          } catch (error) {
            console.error('Erro ao fazer login:', error);
            this.toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Erro ao fazer login.', life: 3000 });
          }
        }
    },
}
  
  </script>
  
  <style scoped>
.div-login {
  display: flex;
  justify-content: center;
  margin-top: 160px;
}

.body {
  padding: 20px;
  width: 400px;
  height: 400px;
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

.email {
  width: 100%;
}

.password {
  width: 100%;
}

.btn-login {
  width: 100%;
  margin-bottom: 20px;

}

.btn-login:hover {
  background-color: #1976d2;
}

.btn-nova-conta {
  width: 100%
}

.btn-nova-conta:hover {
  background-color: #1976d2;
}
</style>
  