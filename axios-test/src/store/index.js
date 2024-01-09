import { createStore } from 'vuex';

export default createStore({
    state: {
        formData: null,
        selectedSeats: [],
    },
    mutations: {
        setFormData(state, formData) {
            state.formData = formData;
        },
        resetState(state) {
            state.formData = null;
        },
        setSelectedSeats(state, seats) {
            state.selectedSeats = seats;
        },
    },
    actions: {
        updateFormData({ commit }, formData) {
            commit('setFormData', formData);
        },
        reset({ commit }) {
            commit('resetState');
        },
        updateSelectedSeats({ commit }, seats) {
            commit('setSelectedSeats', seats);
        },
    },
    getters: {
        getFormData: (state) => state.formData,
        getSelectedSeats: (state) => state.selectedSeats,
    },
});