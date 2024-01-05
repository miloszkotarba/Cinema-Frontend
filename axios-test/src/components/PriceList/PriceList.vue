<script setup>
import axios from 'axios';
import { onMounted, ref } from "vue";

import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import { createCustomError, handleErrors } from '../../../errors/ErrorHandler.js';

const fetchError = ref(null);

const URL = import.meta.env.VITE_BACKEND_URI + "tickets";

const tickets = ref([]);
const isLoading = ref(true);

const fetchTicketsData = async () => {
  try {
    const response = await axios.get(URL)
    tickets.value = response.data.tickets;
  } catch (error) {
    handleErrors(error, fetchError)
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchTicketsData);
</script>

<template>
  <main>
    <div class="wrapper">
      <div class="title">
        <h1>Cennik</h1>
      </div>

      <div v-if="fetchError">{{ fetchError }}</div>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div v-for="ticket in tickets" :key="ticket._id" class="ticket">
          <div class="ticket-title">
            <div class="icon"><img src="../../assets/img/ticket-icon.svg" alt="Ticket Icon"></div>
            <div class="name">Bilet {{ ticket.name }}</div>
          </div>
          <hr>
          <div class="ticket-details">
            <div class="price">{{ ticket.price }} zł</div>
            <div class="info">
              <p v-if="ticket.name === 'normalny'">Obowiązuje na wszystkie seanse 2D i 3D</p>
              <p v-if="ticket.name === 'ulgowy'">Obowiązuje na wszystkie seanse 2D i 3D. Przeznaczony dla osób
                uprawnionych do ulgi.</p>
              <p>*Nie dotyczy specjalnych ofert takich jak maratony filmowe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main .wrapper {
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

.ticket {
  margin: 3rem 0;
}

.ticket:last-child {
  margin-bottom: 0;
}

.ticket .ticket-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ticket .ticket-details {
  margin-top: 20px;
  text-indent: 4rem;
  display: flex;
}

.ticket-details p:first-child {
  margin-bottom: 1.2rem;
}

.ticket-details p:last-child {
  font-weight: 200;
}

.ticket .ticket-details .price {
  font-size: 1.4rem;
}

hr {
  border: 0.5px solid #686868;
  margin: 10px 0;
}

.ticket .ticket-title .icon {
  width: 40px;
  filter: invert(9%) sepia(82%) saturate(3259%) hue-rotate(260deg) brightness(119%) contrast(100%);
}


</style>