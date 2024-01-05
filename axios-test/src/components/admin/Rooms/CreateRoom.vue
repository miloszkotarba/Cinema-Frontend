<template>
  <AlertDisplay/>
  <div>
    <div class="admin-container">
      <div class="indent">
        <header>Dodawanie sali kinowej</header>
        <form @submit.prevent="addRoom">
          <div class="field">
            <label for="name">nazwa sali</label>
            <input type="text" id="name" v-model="newRoom.name" required/>
          </div>

          <div class="field">
            <label for="numberOfSeats">liczba miejsc</label>
            <input type="number" id="numberOfSeats" v-model="newRoom.numberOfSeats" required/>
          </div>

          <button type="submit" class="submit-btn">Dodaj</button>
        </form>
      </div>
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

    if (newRoom.value.numberOfSeats > 200) {
      return alertService.addAlert("Sala nie może przekraczać 200 miejsc", "error")
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
.admin-container {
  width: clamp(200px, 100%, 600px);
}

.admin-container header {
  font-size: 23px;
  text-transform: uppercase;
  margin-bottom: 3rem;
}

.admin-container .indent {
  margin-left: 3rem;
}

.admin-container form .field {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1.3rem;
}

.admin-container form .field input {
  max-width: 350px;
  width: 100%;
  padding: 8px 15px;
  border-radius: 5px;
  border: 1px solid black;
  font-size: 1.05rem;
}

.admin-container .submit-btn {
  float: right;
  background: #686868;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  text-transform: uppercase;
  cursor: pointer;
}

</style>
