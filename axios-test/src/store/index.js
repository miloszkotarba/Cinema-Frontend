import { createStore } from 'vuex';

export default createStore({
    state: {
        formData: null,
        selectedSeats: [],
        personalData: null,
        screening: null,
        reservation: null,
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
        setScreeningData(state, screening) {
            state.screening = screening
        },
        setReservationData(state, reservation) {
            state.reservation = reservation
        }
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
        updateScreeningData({ commit }, screening) {
            commit('setScreeningData', screening)
        },
        updateReservationData({ commit }, reservation) {
            commit('setReservationData', reservation)
        }
    },
    getters: {
        getFormData: (state) => state.formData,
        getSelectedSeats: (state) => state.selectedSeats,
        getPersonalData: (state) => state.personalData,
        getAllData: (state) => ({
            formData: state.formData,
            selectedSeats: state.selectedSeats,
            personalData: state.personalData,
        }),
        getScreeningData: (state) => state.screening,
        getReservationData: (state) => state.reservation,
    },
});