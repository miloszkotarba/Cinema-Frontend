<template>
  <AlertDisplay/>
  <div>
    <form @submit.prevent="addRoom">
      <label for="name">Room Name:</label>
      <input type="text" id="name" v-model="newRoom.name" required/>

      <label for="numberOfSeats">Number of Seats:</label>
      <input type="number" id="numberOfSeats" v-model="newRoom.numberOfSeats" required/>

      <button type="submit">Add Room</button>
    </form>

    <div v-for="room in rooms" :key="room._id">
      <h2>{{ room.name }}</h2>
      <span>Number of Seats: {{ room.numberOfSeats }}</span>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

import { createCustomError, handleErrors } from '../../../../errors/ErrorHandler.js';
import alertService from "@/components/alerts/AlertService.js";
import AlertDisplay from "@/components/alerts/AlertDisplay.vue";

const URL = import.meta.env.VITE_BACKEND_URI + 'rooms';

const fetchError = ref(null);
const newRoom = ref({
  name: '',
  numberOfSeats: 0,
});

const addRoom = async () => {
  try {
    if (newRoom.value.numberOfSeats === 0) {
      return alertService.addAlert("Niepoprawna liczba siedzeń", "error")
    }

    const response = await axios.post(URL, newRoom.value);

    newRoom.value = { name: '', numberOfSeats: 0 };

    alertService.addAlert("Dodano salę kinową.", "success", "/admin/sale")
  } catch (error) {
    handleErrors(error, fetchError);
  }
};
</script>

<style scoped>
form {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
  margin-top: 30px;
}

label {
  display: block;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 12px;
  box-sizing: border-box;
}

button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
