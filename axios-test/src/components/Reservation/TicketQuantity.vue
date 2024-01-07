<script setup>
import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { ref, onMounted } from 'vue';
import axios from 'axios';

import { createCustomError, handleErrors } from "../../..//errors/ErrorHandler.js";
import { useRoute } from "vue-router";

const URL = import.meta.env.VITE_BACKEND_URI + "screenings";

const steps = ref([
  { number: 1, description: 'WYBIERZ BILETY', active: true, done: false },
  { number: 2, description: 'WYBIERZ MIEJSCA', active: true, done: false },
  { number: 3, description: 'DANE OSOBOWE', active: true, done: false },
  { number: 3, description: 'PŁATNOŚĆ', active: true, done: false },
  { number: 4, description: 'PODSUMOWANIE', active: true, done: false },
]);

const fetchError = ref(null);

const router = useRoute();
const screeningID = router.params.id;
const loading = ref(true);

const screening = ref(null)

import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

function formatDate(inputDate) {
  const parsedDate = parseISO(inputDate);
  const formattedDate = format(parsedDate, "EEEE MM/dd/yyyy, HH:mm", { locale: pl });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

const fetchScreeningData = async () => {
  try {
    const response = await axios.get(URL + `/${screeningID}`);
    screening.value = response.data;
  } catch (error) {
    handleErrors(error, fetchError);
  } finally {
    loading.value = false
  }
};

onMounted(fetchScreeningData)
</script>

<template>
  <main>
    <AlertDisplay/>
    <div class="booking-box-top">
      <div class="container">
        <div id="steps">
          <div v-for="(step, index) in steps" :key="index"
               :class="{ 'step': true, 'active': step.active, 'done': step.done }" :data-desc="step.description">
            {{ step.number }}
          </div>
        </div>
        <div class="info-wrapper">
          <div class="left">
            <span style="display: block; font-weight: 300; font-size: 1.5rem">{{
                screening && formatDate(screening.date)
              }}</span>
            <span class="title">{{ screening && screening.movie ? screening.movie.title : '' }}/2D/DUB</span>
          </div>
          <div class="right">
            <span style="font-size: 2rem; font-weight: 500">Sala: {{
                screening && screening.room ? screening.room.name : ''
              }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="ticket-wrapper">
        <div class="container">
          <div v-if="loading" class="load">
            <div class="one"></div>
            <div class="two"></div>
            <div class="three"></div>
          </div>
          <div v-else style="padding-top: 1.5rem">
            <h1>Wybierz bilety</h1>
            <div class="table-ticket">
              <div class="row">
                <div class="ticket-type">Rodzaj biletu</div>
                <div class="ticket-price">Cena</div>
                <div class="ticket-quantity">Ilość</div>
              </div>
              <div class="row">
                <div class="ticket-type">bilet ulgowy</div>
                <div class="ticket-price">20zł</div>
                <div class="ticket-quantity"><input type="text"></div>
              </div>
              <div class="row">
                <div class="ticket-type">bilet normalny</div>
                <div class="ticket-price">10zł</div>
                <div class="ticket-quantity"><input type="text"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  background: #f8f8f8;
  min-height: calc(100vh - 80px);
}

main .wrapper {
  padding-inline: 1rem;
  width: clamp(300px, 100%, 1370px);
  margin-inline: auto;
  padding-bottom: 2rem;
}

main .title {
  padding-top: 27px;
  font-weight: 600;
  font-size: 2rem;
}

.container {
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 1rem;
}

.table-ticket {
  border: 1px solid black;
  margin-top: 1.5rem;
}

.table-ticket .row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid black;
  padding: 10px 5%;
  padding-right: 7%;
}

.table-ticket .row .ticket-quantity input {
  padding: 5px;
  width: clamp(30px, 100%, 70px);
  font-size: 1.5rem;
  text-align: center;
}

.table-ticket .row:last-child {
  border-bottom: none;
}

.table-ticket .row div {
  padding: 10px;
  width: calc(100% / 3);
  text-align: center;
}

.booking-box-top {
  background: #fff;
  padding-top: 1.2rem;
  padding-bottom: 1.2rem;
  border-bottom: 1.3px solid #dfdfdf;
}

.booking-box-top .container .info-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

/* LOADING */
.load {
  display: flex;
  justify-content: center;
  margin: 200px auto;
}

.load div {
  width: 20px;
  height: 20px;
  background-color: rgb(9, 145, 183);
  border-radius: 50%;
  margin: 0 5px;
  animation-name: up-and-down;
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
}

.load .two {
  animation-delay: 0.3s;
}

.load .three {
  animation-delay: 0.6s;
}

@keyframes up-and-down {

  to {
    opacity: 0.2;
    transform: translateY(-20px);

  }
}

@media screen and (max-width: 600px) {
  nav {
    max-height: 800px;
    padding-bottom: 1.3rem;
  }

  nav .nav-wrapper {
    flex-direction: column;
  }
}
</style>