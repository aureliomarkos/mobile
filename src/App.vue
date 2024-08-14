<template>
  <div id="app">
    <router-view/>
    <Toast/> <!-- para definição de uso global -->
    <BottomAppBar v-if="showButtons"/>
  </div>
</template>

<script>
import BottomAppBar from './components/BottomAppBar.vue';

import { ref } from 'vue'

import Toast from 'primevue/toast';

import { mapActions } from 'vuex';

export default {
  components: {
    BottomAppBar,
    Toast
  },

  data() {
    const showButtons = ref(true)
    return { showButtons }
  },

  created(){
    this.checkLogin();
  },

  methods: {
    ...mapActions(['checkLogin'])
  }
}
</script>