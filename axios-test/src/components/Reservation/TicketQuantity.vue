<script setup>
import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';

import { createCustomError, handleErrors } from "../../..//errors/ErrorHandler.js";
import { useRoute, useRouter } from "vue-router";

const URL = import.meta.env.VITE_BACKEND_URI + "screenings";
const URL_TICKETS = import.meta.env.VITE_BACKEND_URI + "tickets";

const steps = ref([
  { number: 1, description: 'WYBIERZ BILETY', active: true, done: false },
  { number: 2, description: 'WYBIERZ MIEJSCA', active: true, done: false },
  { number: 3, description: 'DANE OSOBOWE', active: true, done: false },
  { number: 3, description: 'PŁATNOŚĆ', active: true, done: false },
  { number: 4, description: 'PODSUMOWANIE', active: true, done: false },
]);

const fetchError = ref(null);

const router = useRoute();
const Router = useRouter();
const screeningID = router.params.id;

const loading = ref(true);

const screening = ref(null)
const tickets = ref(null)

import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';

function formatDate(inputDate) {
  const parsedDate = parseISO(inputDate);
  const formattedDate = format(parsedDate, "EEEE dd/MM/yyyy, HH:mm", { locale: pl });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

const ulgowyQuantity = ref(null);
const normalnyQuantity = ref(null);
const ulgowyPrice = ref(null)
const normalnyPrice = ref(null)

const store = inject('store');

const fetchScreeningData = async () => {
  try {
    if(!screeningID) {
      await Router.push({ path: '/repertuar' });
      return
    }

    const response = await axios.get(URL + `/${screeningID}`);
    screening.value = response.data;
  } catch (error) {
    handleErrors(error, fetchError);
  } finally {
    loading.value = false
    store.dispatch('reset');
  }
};
const fetchTicketsData = async () => {
  try {
    const response = await axios.get(URL_TICKETS);
    const ulgowyPrice = response.data.tickets.find(ticket => ticket.name === 'ulgowy').price;
    const normalnyPrice = response.data.tickets.find(ticket => ticket.name === 'normalny').price;

    return { ulgowyPrice, normalnyPrice };
  } catch (error) {
    handleErrors(error, fetchError);
    return { ulgowyPrice: 0, normalnyPrice: 0 }; // Domyślne wartości w przypadku błędu
  } finally {
    loading.value = false;
  }
};

const handleButtonClick = () => {
  const ulgowy = ulgowyQuantity.value;
  const normalny = normalnyQuantity.value;
  const screeningData = screening ? screening.value : null;

  const formData = {
    ulgowy,
    normalny,
    screeningData
  };

  store.dispatch('updateFormData', formData);

  Router.push({ path: '/repertuar/miejsca' });
};

const fetchData = async () => {
  await fetchScreeningData();
  const { ulgowyPrice: fetchedUlgowyPrice, normalnyPrice: fetchedNormalnyPrice } = await fetchTicketsData();
  ulgowyPrice.value = fetchedUlgowyPrice;
  normalnyPrice.value = fetchedNormalnyPrice;
};

onMounted(fetchData)
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
            <span class="title">{{ screening && screening.movie ? screening.movie.title : '' }}/2D</span>
          </div>
          <div class="right">
            <span style="font-size: 2rem; font-weight: 300">Sala: {{
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
          <div v-else style="padding-top: 2.5rem">
            <form @submit.prevent="handleButtonClick()">
              <h1>Wybierz bilety</h1>
              <div class="table-ticket">
                <div class="row header">
                  <div class="ticket-type">Rodzaj biletu</div>
                  <div class="ticket-price">Cena</div>
                  <div class="ticket-quantity">Ilość</div>
                </div>
                <div class="row">
                  <div class="ticket-type">bilet ulgowy</div>
                  <div class="ticket-price">{{ ulgowyPrice }} zł</div>
                  <div class="ticket-quantity"><input v-model="ulgowyQuantity" type="number" required></div>
                </div>
                <div class="row">
                  <div class="ticket-type">bilet normalny</div>
                  <div class="ticket-price">{{ normalnyPrice }} zł</div>
                  <div class="ticket-quantity"><input v-model="normalnyQuantity" type="number" required></div>
                </div>
              </div>
              <button class="btn-action" type="submit">WYBIERZ MIEJSCA ></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<!-- @TODO form validation -->
<!-- @TODO ticket availability -->

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
  border: 1px solid #bbb;
  margin-top: 3rem;
  margin-bottom: 2.5rem;
}

.table-ticket .row {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #bbb;
  padding: 10px 5%;
  padding-right: 7%;
  font-size: 1.2rem;
  font-weight: 300;
  background: #fff;
}

.table-ticket .row.header {
  background: #dedede;
  font-weight: 400;
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

.btn-action {
  background: #62369c;
  width: 300px;
  padding: 14px 0;
  text-align: center;
  color: #fff;
  border-radius: 8px;
  border: none;
  font-size: 1.6rem;
  margin-top: 2rem;
  float: right;
  transition: all ease .2s;
  font-weight: 300;
}

.btn-action:hover {
  background: #4d1b8f;
  cursor: pointer;
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