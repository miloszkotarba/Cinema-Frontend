<template>
  <AlertDisplay/>
  <div class="admin-container">
    <header>
      <h1>Filmy</h1>
      <div class="icon"><img src="../../../assets/img/movie.svg" alt="Movie Icon"></div>
    </header>

    <div class="indent">
      <div class="btn-add">
        <a href="/admin/filmy/create">
          <img src="../../../assets/img/add.svg" alt="Button add">
        </a>
      </div>

      <div v-if="fetchError">{{ fetchError }}</div>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div v-for="movie in movies" :key="movie._id" class="movie">
          <div class="left">
            <span class="name">{{ movie.title }}</span>
            <span class="genres">gatunek: {{ movie.genres }}</span>
            <span class="director">reżyser: {{ movie.director }}</span>
            <span class="releaseDate">Data wydania: {{ movie.release.year }}</span>
            <span class="releaseCountry">Kraj wydania: {{ movie.release.country }}</span>
            <span class="duration">czas trwania: {{ movie.duration }}</span>
            <span class="ageRestriction">ograniczenie wiekowe: {{ movie.ageRestriction }}</span>
            <span class="cast">aktorzy: {{ movie.cast }}</span>
            <span class="description">opis: {{ movie.description }}</span>
          </div>
          <div class="right">
            <RouterLink :to="{ name: 'EditMovie', params: { id: movie._id }}" class="btn btn-edit"
                        style="text-decoration: none; color: black">
              Edytuj
            </RouterLink>
            <button @click="deleteMovie(movie._id)" class="btn btn-delete">Usuń</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from "vue";

import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import { createCustomError, handleErrors } from '../../../../errors/ErrorHandler.js';
import alertService from "@/components/alerts/AlertService.js";

const fetchError = ref(null);

const URL = import.meta.env.VITE_BACKEND_URI + "movies";

const movies = ref([]);
const isLoading = ref(true);

const fetchMovieData = async () => {
  try {
    const response = await axios.get(URL);
    movies.value = response.data.movies;
  } catch (error) {
    handleErrors(error, fetchError);
  } finally {
    isLoading.value = false;
  }
};

const deleteMovie = async (movieID) => {
  try {
    await axios.delete(URL + `/${movieID}`);
    await fetchMovieData();
    alertService.addAlert("Usunięto salę kinową.", "success", "/admin/sale")
  } catch (error) {
    handleErrors(error, fetchError);
  }
}

onMounted(fetchMovieData);
</script>

<style scoped>
.admin-container header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-container header h1 {
  font-size: 35px;
  font-weight: 500;
}

.admin-container header .icon img {
  width: 45px;
}

.admin-container .btn-add img {
  width: 45px;
  margin-bottom: 1.5rem;
}

.admin-container .indent {
  margin-left: 3rem;
  margin-top: 3rem;
}

.admin-container .movie {
  position: relative;
  display: flex;
  width: clamp(200px, 100%, 800px);
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.admin-container .movie:after {
  position: absolute;
  content: "";
  left: 0;
  bottom: -25px;
  width: 100%;
  height: 1px;
  background: #ccc;
  border-radius: 7px;
}

.admin-container .movie .left {
  display: flex;
  flex-direction: column;
  font-size: 16px;
}

.admin-container .movie .right .btn {
  border: none;
  background: none;
  padding: 8px 13px;
  margin-right: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.admin-container .movie .right .btn:hover {
  cursor: pointer;
}

.admin-container .movie .right .btn:last-child {
  margin-right: 0;
}

.admin-container .movie .right .btn-edit {
  border: 1px solid black;
}

.admin-container .movie .right .btn-delete {
  border: 1px solid crimson;
  color: crimson;
}
</style>