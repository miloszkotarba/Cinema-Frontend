<script setup>
import axios from 'axios';
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { createCustomError, handleErrors } from "../../..//errors/ErrorHandler.js";

const URL = import.meta.env.VITE_BACKEND_URI + "movies";

const fetchError = ref(null);
const movie = ref({
  title: '',
  director: '',
  release: {
    year: 0,
    country: '',
  },
  duration: 0,
  ageRestriction: 0,
  cast: '',
  genres: '',
  description: '',
  posterUrl: '',
  posterPublicId: '',
});

const router = useRoute();
const movieId = router.params.id;
const isLoading = ref(true);

const fetchMovieData = async () => {
  try {
    const response = await axios.get(`${URL}/${movieId}`);
    movie.value = response.data;
  } catch (error) {
    handleErrors(error, fetchError);
  }
  finally {
  isLoading.value = false;
  }
};

onMounted(fetchMovieData);
</script>

<template>
  <main>
    <div class="wrapper">

      <div v-if="fetchError">{{ fetchError }}</div>
      <div v-if="isLoading">Loading...</div>
      <div class="content" v-else>

        <div class="left">
          <div class="title">
            <h1>{{ movie.title }}</h1>
          </div>
            <span>{{ movie.genres }}</span>
          <div class="iconSection">
              <div class="clock">
                <img src="../../assets/img/clock.svg" alt="clockIcon">
                <span>czas trwania: <br>{{ movie.duration }} min</span>
              </div>
              <div class="calendar">
                <img src="../../assets/img/calendar.svg" alt="calendarIcon">
                <span>rok premiery (Polska):<br> {{ movie.release.year }}</span>
              </div>
          </div>
          <div class="description">
            od lat: {{movie.ageRestriction}} / Produkcja: {{movie.release.country}}<br>
            Reżyseria: {{movie.director}}<br>
            Obsada: {{movie.cast}}<br>
          </div>
          <div class="description">
            <b>Opis filmu:</b><br>
            {{ movie.description }}
          </div>
        </div>
        <div class="right">
          <img :src="movie.posterUrl" alt="moviePoster">
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  main .wrapper {
    padding-inline: 1rem;
    width: clamp(300px, 100%, 1370px);
    margin-inline: auto;
  }

  main .title h1 {
    font-weight: 600;
    font-size: 2.3rem;
  }

  hr {
    border: 0.5px solid #686868;
    margin: 10px 0;
  }
  .wrapper .content{
    display: flex;
    justify-content: space-between;
    padding-top: 45px;

  }

  .content .right img{
    max-width: 350px;
    padding-left: 5px;
  }

  .iconSection{
    display: flex;
    gap: 20px;
    margin-top: 30px;
    margin-bottom: 10px;
  }

  .clock{
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .calendar{
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .iconSection img{
    width: 40px;
    filter: invert(9%) sepia(82%) saturate(3259%) hue-rotate(260deg) brightness(119%) contrast(100%);
  }

  .description{
    line-height: 25px;
    margin-top: 30px;
    text-align: justify;
    max-width: 800px;
    padding: 8px;
  }

  @media only screen and (max-width: 1150px) {
    .wrapper .content{
      display: block;
      align-items: center;
    }
    .content .right {
      align-items: center;
    }
  }

</style>