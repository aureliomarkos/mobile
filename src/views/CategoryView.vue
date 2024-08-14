<template>
  <div>
    <h1>Data from MySQL</h1>
    <div v-for="item in data" :key="item.id">
      <p>{{ item.email }}</p>
      <p>{{ item.nome }}</p>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

import { BASE_URL } from '@/baseurl.config';

export default {

  data() {
    return {
      data: []
    };
  },

  mounted() {
    this.loadClientes();
  },

  methods: {
    async loadClientes() {
      try {
        const response = await axios.get(`${BASE_URL}/clientes`);
        this.data = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
};
</script>
