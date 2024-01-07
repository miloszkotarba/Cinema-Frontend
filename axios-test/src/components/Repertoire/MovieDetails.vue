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
      <div class="title">
        <h1>Szczegóły filmu</h1>
      </div>

      <div v-if="fetchError">{{ fetchError }}</div>
      <div v-if="isLoading">Loading...</div>

      <div v-else>
        <div class="movie"></div>
        {{ movie.title }}
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

  main .title {
    padding-top: 45px;
  }

  main .title h1 {
    font-weight: 500;
    font-size: 2.3rem;
  }

  hr {
    border: 0.5px solid #686868;
    margin: 10px 0;
  }

</style>