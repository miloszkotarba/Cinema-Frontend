<script setup>
import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import { computed, inject, onMounted, ref } from 'vue';
import axios from 'axios';

import { handleErrors } from "../../..//errors/ErrorHandler.js";
import { useRouter } from "vue-router";
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import alertService from "@/components/alerts/AlertService.js";

const steps = ref([
  { number: 1, description: 'WYBIERZ BILETY', active: false, done: true },
  { number: 2, description: 'WYBIERZ MIEJSCA', active: false, done: true },
  { number: 3, description: 'DANE OSOBOWE', active: false, done: true },
  { number: 3, description: 'PŁATNOŚĆ', active: false, done: true },
  { number: 4, description: 'PODSUMOWANIE', active: false, done: true },
]);

const fetchError = ref(null);

const Router = useRouter();

const loading = ref(true);

const URL = import.meta.env.VITE_BACKEND_URI + "screenings";

function formatDate(inputDate) {
  const parsedDate = parseISO(inputDate);
  const formattedDate = format(parsedDate, "EEEE MM/dd/yyyy, HH:mm", { locale: pl });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

const store = inject('store');
const dataFromStore = ref(null)

const getData = async () => {
  try {
    dataFromStore.value = store.getters.getFormData;
    if (dataFromStore.value?.screeningData?.room?.numberOfSeats) {
      totalSeats.value = dataFromStore.value.screeningData.room.numberOfSeats
    }

    if (!dataFromStore.value) {
      await Router.push({ path: '/repertuar' });
      return
    }
  } catch (error) {
    handleErrors(error, fetchError)
  } finally {
    loading.value = false
  }
}

const handleButtonClick = () => {

}

onMounted(() => getData());
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
                dataFromStore && formatDate(dataFromStore.screeningData.date)
              }}</span>
            <span class="title">{{
                dataFromStore && dataFromStore.screeningData ? dataFromStore.screeningData.movie.title : ''
              }}/2D</span>

          </div>
          <div class="right">
            <span style="font-size: 2rem; font-weight: 300">Sala: {{
                dataFromStore && dataFromStore.screeningData.room ? dataFromStore.screeningData.room.name : ''
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
          <div class="content">
            <div class="text">
              <div>Płatność przebiegła pomyślnie</div>
              <img src="../../assets/img/confirm.svg" alt="confirmIcon">
            </div>
            <div class="text2">
              Potwierdzenie płatności wraz z biletem zostało wysłane na adres e-mail.
            </div>
            <div class="text2">
              Dziękujemy za wybór naszego kina i życzymy udanego seansu.
            </div>
            <RouterLink :to="{ name: 'repertuar'}" class="btn-action" style="text-decoration: none">
              POWRÓT DO REPERTUARU
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.alert {
  top: 100px !important;
}

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
  width: 355px;
  padding: 14px 0;
  text-align: center;
  color: #fff;
  border-radius: 8px;
  border: none;
  font-size: 1.6rem;
  margin-top: 3rem;
  float: right;
  transition: all ease .2s;
  margin-bottom: 2rem;
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
.content{
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}
.text{
  display: flex;
  font-size: 36px;
  font-weight: 600;
  margin-top: 150px;
  padding: 30px 0;
  align-content: center;
}
.text img{
  width: 45px;
  margin-left: 12px;
}
.text2{
  padding: 8px 0;
  font-size: 24px;
  font-weight: 300;
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