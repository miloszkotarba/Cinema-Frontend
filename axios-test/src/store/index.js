import { createStore } from 'vuex';

export default createStore({
    state: {
        formData: null,
    },
    mutations: {
        setFormData(state, formData) {
            state.formData = formData;
        },
    },
    actions: {
        updateFormData({ commit }, formData) {
            commit('setFormData', formData);
        },
    },
    getters: {
        getFormData: (state) => state.formData,
    },
});