<template>
  <AlertDisplay/>
  <div>
    <div class="admin-container">
      <div class="indent">
        <header>Dodawanie filmu</header>
        <form @submit.prevent="addMovie">
          <div class="field">
            <label for="title">tytuł filmu</label>
            <input type="text" id="title" v-model="newMovie.title" required/>
          </div>
          <div class="field">
            <label for="director">reżyser filmu</label>
            <input type="text" id="director" v-model="newMovie.director" required/>
          </div>
          <div class="field">
            <label for="relaseYear">rok wydania</label>
            <input type="text" id="relaseYear" v-model="newMovie.release.year" required/>
          </div>
          <div class="field">
            <label for="relaseCountry">kraj wydania</label>
            <input type="text" id="relaseCountry" v-model="newMovie.release.country" required/>
          </div>
          <div class="field">
            <label for="duration">czas trwania (w min)</label>
            <input type="text" id="duration" v-model="newMovie.duration" required/>
          </div>
          <div class="field">
            <label for="ageRestriction">ograniczenie wiekowe</label>
            <input type="text" id="ageRestriction" v-model="newMovie.ageRestriction" required/>
          </div>
          <div class="field">
            <label for="cast">aktorzy</label>
            <input type="text" id="cast" v-model="newMovie.cast" required/>
          </div>
          <div class="field">
            <label for="genres">gatunek</label>
            <input type="text" id="genres" v-model="newMovie.genres" required/>
          </div>
          <div class="field">
            <label for="description">opis</label>
            <textarea class="description" id="description" v-model="newMovie.description" required></textarea>
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

const URL = import.meta.env.VITE_BACKEND_URI + 'movies';

const fetchError = ref(null);
const newMovie = ref({
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

const addMovie = async () => {
  try {
    const response = await axios.post(URL, newMovie.value);

    newMovie.value = {
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
    };

    alertService.addAlert("Dodano nowy film.", "success", "/admin/filmy")
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
