<template>
  <AlertDisplay />
  <div class="admin-container">
    <div class="indent">
      <header>Edycja sali kinowej</header>
      <form @submit.prevent="updateMovie">
        <div class="field">
          <label for="name">Nazwa sali</label>
          <input type="text" id="name" v-model="editedMovie.name" required/>
        </div>

        <div class="field">
          <label for="numberOfSeats">Liczba miejsc</label>
          <input
              type="number"
              id="numberOfSeats"
              v-model="editedMovie.numberOfSeats"
              required
          />
        </div>

        <button type="submit" class="submit-btn">Zapisz zmiany</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { createCustomError, handleErrors } from "../../../../errors/ErrorHandler.js";
import alertService from "@/components/alerts/AlertService.js";
import AlertDisplay from "@/components/alerts/AlertDisplay.vue";

const URL = import.meta.env.VITE_BACKEND_URI + "movies";

const fetchError = ref(null);
const editedMovie = ref({
  name: "xD",
  numberOfSeats: 0,
});

const router = useRoute();
const movieID = router.params.id;

const fetchMovieData = async () => {
  try {
    const response = await axios.get(`${URL}/${movieID}`);
    editedMovie.value = response.data;
  } catch (error) {
    handleErrors(error, fetchError);
  }
};

const updateMovie = async () => {
  try {
    if (editedMovie.value.numberOfSeats === 0) {
      return alertService.addAlert("Niepoprawna liczba siedzeń", "error");
    }

    if (editedMovie.value.numberOfSeats > 200) {
      return alertService.addAlert("Sala nie może przekraczać 200 miejsc", "error");
    }

    await axios.patch(`${URL}/${movieID}`, editedMovie.value);

    alertService.addAlert("Zaktualizowano salę kinową.", "success", "/admin/sale");
  } catch (error) {
    handleErrors(error, fetchError);
  }
};

onMounted(fetchMovieData);
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
