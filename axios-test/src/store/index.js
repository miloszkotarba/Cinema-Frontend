import { createStore } from 'vuex';

export default createStore({
    state: {
        formData: null,
        selectedSeats: [],
        personalData: null,
    },
    mutations: {
        setFormData(state, formData) {
            state.formData = formData;
        },
        setPersonalData(state, personalData) {
            state.personalData = personalData;
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
        updatePersonalData({ commit }, personalData) {
            commit('setPersonalData', personalData);
        },
    },
    getters: {
        getFormData: (state) => state.formData,
        getSelectedSeats: (state) => state.selectedSeats,
        getPersonalData: (state) => state.personalData,
    },
});