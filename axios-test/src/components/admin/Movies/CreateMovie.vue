<template>
  <AlertDisplay />
  <div>
    <div class="admin-container">
      <div class="indent">
        <header>Dodawanie filmu</header>
        <form @submit.prevent="addMovie" enctype="multipart/form-data">
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
            <input type="number" id="relaseYear" v-model="newMovie.release.year" required/>
          </div>
          <div class="field">
            <label for="relaseCountry">kraj wydania</label>
            <input type="text" id="relaseCountry" v-model="newMovie.release.country" required/>
          </div>
          <div class="field">
            <label for="duration">czas trwania (w min)</label>
            <input type="number" id="duration" v-model="newMovie.duration" required/>
          </div>
          <div class="field">
            <label for="ageRestriction">ograniczenie wiekowe</label>
            <input type="number" id="ageRestriction" v-model="newMovie.ageRestriction" required/>
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
          <div class="field">
            <label for="poster">plakat (zdjęcie)</label>
            <input type="file" id="poster" @change="handlePosterChange" />
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
  poster: null, // Nowe pole dla pliku obrazu
});

const handlePosterChange = (event) => {
  const file = event.target.files[0];
  console.log('Wybrany plik:', file);
  newMovie.value.poster = file;
};

const addMovie = async () => {
  try {
    // Utwórz obiekt FormData do przesłania plików
    const formData = new FormData();
    // Dodaj wszystkie pola formularza
    formData.append('title', newMovie.value.title);
    formData.append('director', newMovie.value.director);
    formData.append('release[year]', newMovie.value.release.year);
    formData.append('release[country]', newMovie.value.release.country);
    formData.append('duration', newMovie.value.duration);
    formData.append('ageRestriction', newMovie.value.ageRestriction);
    formData.append('cast', JSON.stringify(newMovie.value.cast));
    formData.append('genres', JSON.stringify(newMovie.value.genres));
    formData.append('description', newMovie.value.description);
    // Dodaj plik obrazu
    formData.append('poster', newMovie.value.poster);

    // Prześlij dane do API
    const response = await axios.post(URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

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
      poster: null,
    };

    alertService.addAlert("Dodano nowy film.", "success", "/admin/filmy");
  } catch (error) {
    handleErrors(error, fetchError);
    alertService.addAlert(error.response.data.error, "error")
    console.log("Sprawdź chmod upload")
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
