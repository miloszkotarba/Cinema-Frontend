<script setup>
import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';

import { createCustomError, handleErrors } from "../../..//errors/ErrorHandler.js";
import { useRoute, useRouter } from "vue-router";

const steps = ref([
  { number: 1, description: 'WYBIERZ BILETY', active: false, done: true },
  { number: 2, description: 'WYBIERZ MIEJSCA', active: false, done: true },
  { number: 3, description: 'DANE OSOBOWE', active: true, done: false },
  { number: 3, description: 'PŁATNOŚĆ', active: true, done: false },
  { number: 4, description: 'PODSUMOWANIE', active: true, done: false },
]);

const fetchError = ref(null);

const router = useRoute();
const Router = useRouter();
const loading = ref(true);

import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import alertService from "@/components/alerts/AlertService.js";

function formatDate(inputDate) {
  const parsedDate = parseISO(inputDate);
  const formattedDate = format(parsedDate, "EEEE MM/dd/yyyy, HH:mm", { locale: pl });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

const store = inject('store');

const personalData = ref({
  firstName: '',
  lastName: '',
  email: '',
  repeatedEmail: '',
})

const handleButtonClick = () => {
  const personalDataToStore = { ...personalData.value };

  if (personalDataToStore.email !== personalDataToStore.repeatedEmail) {
    alertService.addAlert("Adresy e-mail się różnią.", "error")
    return
  }

  store.dispatch('updatePersonalData', personalDataToStore);

  Router.push({ path: '/repertuar/platnosc' })
  /*
    console.log('Personal Data from Store:', store.getters.getPersonalData);
  */
};

const dataFromStore = ref(null)
const getData = async () => {
  try {
    dataFromStore.value = store.getters.getFormData;
    if (!dataFromStore.value) {
      await Router.push({ path: '/repertuar' });
    }
  } catch (error) {
    handleErrors(error, fetchError)
  } finally {
    loading.value = false
  }
}

onMounted(getData)
</script>

<template>
  <main>
    <AlertDisplay/>
    <link rel="stylesheet"
          href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">
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
            <span
                style="display: block; font-weight: 300; font-size: 1.5rem">{{
                dataFromStore && dataFromStore.screeningData ? formatDate(dataFromStore.screeningData.date) : ''
              }}</span>
            <span class="title">{{
                dataFromStore && dataFromStore.screeningData && dataFromStore.screeningData.movie
                    ? dataFromStore.screeningData.movie.title : ''
              }}/2D</span>
          </div>
          <div class="right">
            <span style="font-size: 2rem; font-weight: 300">Sala: {{
                dataFromStore && dataFromStore.screeningData && dataFromStore.screeningData.room
                    ? dataFromStore.screeningData.room.name : ''
              }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="personal-data-wrapper">
        <div class="container">
          <div v-if="loading" class="load">
            <div class="one"></div>
            <div class="two"></div>
            <div class="three"></div>
          </div>
          <div v-else style="padding-top: 2.5rem">
            <form @submit.prevent="handleButtonClick()">
              <h1>Wybierz bilety</h1>
              <div class="table-personal-data">
                <div class="fields-group">
                  <div class="field">
                    <label for="imie">
                      <span class="left"><i class="las la-user"></i></span>
                      <span class="right">imię</span>
                    </label>
                    <input v-model="personalData.firstName" type="text" required>
<!--                    @TODO add required to all inputs -->
                  </div>
                  <div class="field">
                    <label for="nazwisko">
                      <span class="left"><i class="las la-user"></i></span>
                      <span class="right">nazwisko</span>
                    </label>
                    <input v-model="personalData.lastName" type="text" required>
                  </div>
                </div>
                <div class="fields-group">
                  <div class="field">
                    <label for="email">
                      <span class="left"><i class="las la-envelope"></i></span>
                      <span class="right">e-mail</span>
                    </label>
                    <input v-model="personalData.email" type="email" required>
                  </div>
                  <div class="field">
                    <label for="email">
                      <span class="left"><i class="las la-envelope"></i></span>
                      <span class="right">powtórz e-mail</span>
                    </label>
                    <input v-model="personalData.repeatedEmail" type="email" required>
                  </div>
                </div>
              </div>
              <button class="btn-action" type="submit">PRZEJDŹ DO PŁATNOŚCI ></button>
            </form>
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

.table-personal-data {
  margin-top: 2rem;
}

.table-personal-data .fields-group {
  display: flex;
  justify-content: space-around;
  max-width: 1300px;
  width: 100%;
  margin-inline: auto;
  flex-wrap: wrap;
}

.table-personal-data .fields-group .field {
  display: flex;
  width: 520px;
  height: 45px;
  margin-bottom: 4rem;
  margin-right: 1rem;
}

.table-personal-data .fields-group .field label {
  background: #4d1b8f;
  color: #fff;
  padding: 0.7rem 2rem;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.table-personal-data .fields-group .field label i {
  font-size: 1.8rem;
}

.table-personal-data .fields-group .field input {
  border-radius: 0 !important;
  border: 1px solid black;
  flex: 1;
  font-size: 1.2rem;
  padding: 0 0.8rem;
  font-weight: 300;
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
  width: 360px;
  font-weight: 300;
  padding: 14px 0;
  text-align: center;
  color: #fff;
  border-radius: 8px;
  border: none;
  font-size: 1.6rem;
  margin-top: 2rem;
  float: right;
  transition: all ease .2s;
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