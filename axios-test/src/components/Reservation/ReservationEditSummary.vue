<script setup>
import { onMounted, ref } from 'vue';

import { handleErrors } from "../../..//errors/ErrorHandler.js";
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import alertService from "@/components/alerts/AlertService.js";
import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import store from "@/store/index.js";
import { useRouter } from "vue-router";


const fetchError = ref(null)
const reservation = ref(null)
const Router = useRouter();

function formatDate(inputDate) {
  const parsedDate = parseISO(inputDate);
  const formattedDate = format(parsedDate, "EEEE dd/MM/yyyy, HH:mm", { locale: pl });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

const getData = () => {
  try {
    const data = store.getters.getReservationData
    reservation.value = data._id
    if (reservation.value === null) {
      Router.push({ path: '/repertuar' });
    }
  } catch (error) {
    handleErrors(error, fetchError)
    alertService.addAlert(error, "error")
  }
}


onMounted(getData)
</script>

<template>
  <AlertDisplay/>
  <main>
    <div class="wrapper">
      <div class="main-title">
        <div class="left">ID rezerwacji: {{ reservation }}</div>
        <div class="right"><img src="../../assets/img/appointment.svg" alt="Appointment"></div>
      </div>
      <div>
        <div class="alert-box">
          <div class="content">
            <div class="text">
              <div>Rezerwacja została zmodyfikowana</div>
              <img src="../../assets/img/confirm.svg" alt="confirmIcon">
            </div>
            <div class="text2">
              Pomyślnie zmieniono miejsca zajmowane podczas seansu.
            </div>
            <div class="text2">
              Potwierdzenie tej operacji zostało wysłane na adres e-mail.
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
  width: clamp(300px, 100%, 900px);
  margin-inline: auto;
  padding-bottom: 2rem;
  padding-top: 5rem;
}

main .wrapper .main-title {
  font-weight: 600;
  font-size: 2rem;
  display: flex;
  gap: 1.5rem;
}

main .wrapper .main-title img {
  width: 45px;
}

.container {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3.5rem;
}

.container .title {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}

.container .content {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 1.2rem;
  font-weight: 300;
  text-align: justify;
}

b {
  font-style: italic;
  margin-right: 3px;
  font-weight: 300;
}

.buttons {
  margin-top: 4rem;
  display: flex;
  justify-content: center;
  text-align: center;
  margin-inline: auto;
}

.buttons button {
  font-size: 1.9rem;
  text-transform: uppercase;
  padding: 1rem;
  max-width: 370px;
  width: 100%;
  display: block;
  margin-inline: auto;
  border-radius: 5px;
  border: none;
  color: #fff;
  font-weight: 300;
  box-shadow: 0 0 2px 0.3px #ccc;
  cursor: pointer;
}

.buttons button:first-child {
  margin-right: 5rem;
  background: #751111;
}

.buttons button:nth-child(2) {
  background: #4d1b8f;
}

.not-found .title {
  font-size: 1.6rem;
  margin-top: 0.5rem;
}

@media screen and (max-width: 795px) {
  .container .right,
  .container .right .content {
    text-align: right;
  }

  .buttons button {
    font-size: 1.5rem;
  }
}

@media screen and (max-width: 600px) {
  .container {
    flex-direction: column;
    gap: 2.5rem;
  }

}

@media screen and (max-width: 500px) {
  .buttons {
    flex-direction: column;
  }

  .buttons button {
    width: 100%;
    margin-bottom: 25px;
  }

  .buttons button {
    margin-inline: auto;
  }

  .buttons button:first-child {
    margin-inline: auto;
  }
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

.alert-box .content {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}

.alert-box .text {
  display: flex;
  font-size: 36px;
  font-weight: 600;
  margin-top: 150px;
  padding: 30px 0;
  align-content: center;
}

.alert-box .text img {
  width: 45px;
  margin-left: 20px;
}

.alert-box .text2 {
  padding: 8px 0;
  font-size: 24px;
  font-weight: 300;
}
</style>