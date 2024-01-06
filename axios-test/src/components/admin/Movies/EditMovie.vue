<template>
  <AlertDisplay />
  <div class="admin-container">
    <div class="indent">
      <header>Edycja filmu</header>
      <form @submit.prevent="updateMovie">
        <div class="field">
          <label for="title">tytuł filmu</label>
          <input type="text" id="title" v-model="editedMovie.title" required/>
        </div>
        <div class="field">
          <label for="director">reżyser filmu</label>
          <input type="text" id="director" v-model="editedMovie.director" required/>
        </div>
        <div class="field">
          <label for="relaseYear">rok wydania</label>
          <input type="number" id="relaseYear" v-model="editedMovie.release.year" required/>
        </div>
        <div class="field">
          <label for="relaseCountry">kraj wydania</label>
          <input type="text" id="relaseCountry" v-model="editedMovie.release.country" required/>
        </div>
        <div class="field">
          <label for="duration">czas trwania (w min)</label>
          <input type="number" id="duration" v-model="editedMovie.duration" required/>
        </div>
        <div class="field">
          <label for="ageRestriction">ograniczenie wiekowe</label>
          <input type="number" id="ageRestriction" v-model="editedMovie.ageRestriction" required/>
        </div>
        <div class="field">
          <label for="cast">aktorzy</label>
          <input type="text" id="cast" v-model="editedMovie.cast" required/>
        </div>
        <div class="field">
          <label for="genres">gatunek</label>
          <input type="text" id="genres" v-model="editedMovie.genres" required/>
        </div>
        <div class="field">
          <label for="description">opis</label>
          <textarea class="description" id="description" v-model="editedMovie.description" required></textarea>
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
  title: '',
  director: '',
  release: {
    year: 0,
    country: '',
  },
  duration: 0,
  ageRestriction: 0,
  cast: [],
  genres: [],
  description: '',
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
    await axios.patch(`${URL}/${movieID}`, editedMovie.value);

    alertService.addAlert("Zaktualizowano film.", "success", "/admin/filmy");
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
  margin-bottom: 1rem;
}

.admin-container form .field input {
  max-width: 350px;
  width: 100%;
  padding: 8px 15px;
  border-radius: 5px;
  border: 1px solid black;
  font-size: 1.05rem;
}
.admin-container form .field .description  {
  max-width: 350px;
  height: 150px;
  width: 100%;
  padding: 8px 15px;
  border-radius: 5px;
  border: 1px solid black;
  font-size: 1.05rem;
  resize: none;
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
