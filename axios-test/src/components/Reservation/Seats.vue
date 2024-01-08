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
  { number: 2, description: 'WYBIERZ MIEJSCA', active: true, done: false },
  { number: 3, description: 'DANE OSOBOWE', active: true, done: false },
  { number: 3, description: 'PŁATNOŚĆ', active: true, done: false },
  { number: 4, description: 'PODSUMOWANIE', active: true, done: false },
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

const totalSeats = ref(7);
const seatsPerRow = ref(10);

const getData = async () => {
  try {
    dataFromStore.value = store.getters.getFormData;
    if (dataFromStore.value?.screeningData?.room?.numberOfSeats) {
      totalSeats.value = dataFromStore.value.screeningData.room.numberOfSeats
    }

    if (!dataFromStore.value) {
      Router.push({ path: '/repertuar' });
    }

    await getAllReservedSeats()
  } catch (error) {
    handleErrors(error, fetchError)
  } finally {
    loading.value = false
  }
}

const reservedSeats = ref([]);
const getAllReservedSeats = async () => {
  try {
    let screeningID = "";
    if (dataFromStore.value?.screeningData?._id) {
      screeningID = dataFromStore.value?.screeningData?._id;
    }

    const response = await axios.get(URL + `/${screeningID}/reservations`);

    const { reservations } = response.data;
    if (reservations) {
      reservedSeats.value = reservations
          .flatMap(reservation => {
            const { seats } = reservation;
            return seats ? seats.map(seat => seat.seatNumber) : [];
          })
          .sort((a, b) => a - b);
    }
  } catch (error) {
    handleErrors(error, fetchError);
  }
};

const selectedSeats = ref([]);
const selectedTicketsQuantity = ref(0);
const definedTicketQuantity = ref(0)

const toggleSeatSelection = (seatNumber) => {
  definedTicketQuantity.value = dataFromStore.value?.normalny + dataFromStore.value?.ulgowy
  if (reservedSeats.value.includes(seatNumber)) {
    return
  }

  if (selectedSeats.value.includes(seatNumber)) {
    selectedSeats.value = selectedSeats.value.filter(seat => seat !== seatNumber);
  } else if (selectedTicketsQuantity.value < definedTicketQuantity.value) {
    selectedSeats.value = [...selectedSeats.value, seatNumber];
  }

  selectedTicketsQuantity.value = selectedSeats.value.length;
  console.log(selectedSeats.value);
};

const handleButtonClick = () => {
  definedTicketQuantity.value = dataFromStore.value?.normalny + dataFromStore.value?.ulgowy
  if (selectedTicketsQuantity.value !== definedTicketQuantity.value) {
    alertService.addAlert(`Zaznaczono za mało miejsc. Wybrano ${selectedTicketsQuantity.value}/${definedTicketQuantity.value}.`, "error")
  }
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
            <span style="font-size: 2rem; font-weight: 500">Sala: {{
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
          <div v-else style="padding-top: 2.5rem">
            <form @submit.prevent="handleButtonClick()">
              <div class="seats-box">
                <div class="screen"></div>
                <div v-for="rowIndex in Math.ceil(totalSeats / seatsPerRow)" :key="rowIndex" class="row">
                  <div class="seat-row-number">{{ rowIndex }}</div>
                  <div v-for="seatIndex in Math.min(seatsPerRow, totalSeats - (rowIndex - 1) * seatsPerRow)"
                       :key="seatIndex + (rowIndex - 1) * seatsPerRow" class="seat-container"
                       :class="{ 'booked': reservedSeats.includes(seatIndex + (rowIndex - 1) * seatsPerRow), 'selected': selectedSeats.includes(seatIndex + (rowIndex - 1) * seatsPerRow) }"
                       @click="toggleSeatSelection(seatIndex + (rowIndex - 1) * seatsPerRow)">
                    <div class="seat-number">
                      {{ seatIndex + (rowIndex - 1) * seatsPerRow }}
                    </div>
                    <img
                        v-if="reservedSeats.includes(seatIndex + (rowIndex - 1) * seatsPerRow) || !selectedSeats.includes(seatIndex + (rowIndex - 1) * seatsPerRow)"
                        src="../../assets/img/seat.svg"
                        alt="Seat img"/>
                    <img v-else
                         src="../../assets/img/seat_booked.png"
                         alt="Seat img"/>
                  </div>
                  <div class="seat-row-number">{{ rowIndex }}</div>
                </div>
              </div>
              <button class="btn-action" type="submit">PODAJ DANE OSOBOWE ></button>
            </form>
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
}

.btn-action:hover {
  background: #4d1b8f;
  cursor: pointer;
}

.seats-box {
  width: clamp(300px, 100%, 620px);
  margin-inline: auto;
  background: #fff;
  padding: 2rem 2.5rem;
  box-shadow: 0 0 3px 1px #cfcfcf;
  border-radius: 3px;
}

.seats-box .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
}

.seats-box .screen {
  background: #e8e8eb;
  width: 100%;
  height: 12px;
  border-radius: 7px;
  margin-bottom: 4rem;
  box-shadow: 0 0 1px 0.1px #777;
}

.seats-box .seat-container {
  position: relative;
  display: flex;
}

.seats-box .seat-container:hover {
  cursor: pointer;
}

.seat-container .seat-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
  z-index: 100;
  color: #fff;
}

.seats-box .seat-container:not(.selected) .seat-number {
  display: none
}

.seat-container.booked {
  opacity: 0.2;
}

.seats-box .row .seat-row-number {
  width: 75px;
  text-align: center;
  font-weight: 500;
  font-size: 1.1rem;
  color: #888;
}

.seats-box .row img {
  width: 30px;
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