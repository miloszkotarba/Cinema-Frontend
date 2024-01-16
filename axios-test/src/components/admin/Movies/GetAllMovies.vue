<template>
  <AlertDisplay/>
  <div class="admin-container">
    <header>
      <h1>Filmy</h1>
      <div class="icon"><img src="../../../assets/img/movie.svg" alt="Movie Icon"></div>
    </header>

    <div class="indent">
        <RouterLink :to="{ name: 'adminFilmyCreate'}" class="btn-add"
                    style="text-decoration: none">
          <img src="../../../assets/img/add.svg" alt="Button add">
        </RouterLink>
      <div v-if="fetchError">{{ fetchError }}</div>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div v-for="movie in movies" :key="movie._id" class="movie">
          <div class="helper">
            <div class="left">
              <span class="name">{{ movie.title }}</span>
              <span class="genres" v-if="movie.genres && movie.genres.length > 0" id="movieGenres">
                <span>Gatunek: </span>
                <span v-for="(genre, index) in movie.genres" :key="index" class="light">
                  {{ genre }}<span v-if="index !== movie.genres.length - 1">, </span>
                </span>
              </span>

              <span class="director" v-if="movie.director">Reżyser: <span class="light">{{
                  movie.director
                }}</span></span>
              <span class="releaseDate" v-if="movie.release && movie.release.year">Data wydania: <span
                  class="light">{{ movie.release.year }}</span></span>
              <span class="releaseCountry" v-if="movie.release && movie.release.country">Kraj wydania: <span
                  class="light">{{ movie.release.country }}</span></span>
              <span class="duration" v-if="movie.duration">Czas trwania: <span class="light">{{
                  movie.duration
                }} min</span></span>

              <span class="ageRestriction">
                Ograniczenia wiekowe: <span class="light">{{ movie.ageRestriction ? movie.ageRestriction : `-` }}</span>
              </span>

              <span class="cast" v-if="movie.cast && movie.cast.length > 0" id="movieCast">
                <span>Aktorzy: </span>
                <span v-for="(actor, index) in movie.cast" :key="index" class="light">{{ actor }}<span
                    v-if="index !== movie.cast.length - 1">, </span>
                </span>
              </span>

              <span class="description" v-if="movie.description">Opis: <span class="light">{{
                  movie.description
                }}</span></span>

              <div class="photo" style="margin: 1rem 0">
                <img :src="movie.posterUrl" alt="Movie poster" style="max-width: 200px">
              </div>
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
  </div>
</template>


<script setup>
import axios from 'axios';
import { onMounted, ref } from "vue";

import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import { handleErrors } from '../../../../errors/ErrorHandler.js';
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
    alertService.addAlert("Usunięto film.", "success", "/admin/filmy")
  } catch (error) {
    handleErrors(error, fetchError);
  }
}

const getMovieImage = (movieID) => {
  return `${import.meta.env.BASE_URL}posters/${movieID}.jpeg`
}

onMounted(fetchMovieData);
</script>

<style scoped>
.light {
  font-weight: 200;
  margin-left: 2px;
}

.admin-container header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-container header h1 {
  font-size: 35px;
  font-weight: 600;
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
  flex-direction: column;
  gap: 1rem;
  width: clamp(200px, 100%, 800px);
  margin-bottom: 4rem;
}

.admin-container .movie:after {
  position: absolute;
  content: "";
  left: 0;
  bottom: -35px;
  width: 100%;
  height: 1.7px;
  background: #ccc;
  border-radius: 7px;
}

.admin-container .movie .left {
  display: flex;
  flex-direction: column;
  font-size: 1.05rem;
  line-height: 1.9rem;
}

.admin-container .movie .left .description {
  margin-top: 0.5rem;
  text-align: justify;
}

.admin-container .movie .left .name {
  font-weight: 500;
  font-size: 1.3rem;
  margin-bottom: 10px;
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