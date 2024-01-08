import { createStore } from 'vuex';

export default createStore({
    state: {
        formData: null,
    },
    mutations: {
        setFormData(state, formData) {
            state.formData = formData;
        },
        resetState(state) {
            state.formData = null;
        },
    },
    actions: {
        updateFormData({ commit }, formData) {
            commit('setFormData', formData);
        },
        reset({ commit }) {
            commit('resetState');
        },
    },
    getters: {
        getFormData: (state) => state.formData,
    },
});