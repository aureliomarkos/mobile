import { createStore } from 'vuex';

import axios from '@/axios';

import { BASE_URL } from '@/baseurl.config';

const store = createStore({
  state: {
    user: null,
    token: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    clearAuthData(state) {
      state.user = null;
      state.token = null;
    },
  },
  actions: {
    async checkLogin({ commit }) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.post(`${BASE_URL}/clientes/checkLogin`,{}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          commit('setUser', response.data.user);
          commit('setToken', token);

        } catch (error) {
          commit('clearAuthData');
          localStorage.removeItem('token');
        }
      } else {
        commit('clearAuthData');
      }
    },
    login({ commit }, authData) {
      commit('setUser', authData.user);
      commit('setToken', authData.token);
      localStorage.setItem('token', authData.token);
    },
    logout({ commit }) {
      commit('clearAuthData');
      localStorage.removeItem('token');
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.token !== null;
    },
    getUser(state) {
      return state.user;
    },
  },
});

export default store;
