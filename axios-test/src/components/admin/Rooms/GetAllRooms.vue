<template>
  <AlertDisplay/>

  <h1>Sale</h1>
  <div v-if="fetchError">{{ fetchError }}</div>
  <div v-if="isLoading">Loading...</div>
  <div v-else>
    <div v-for="room in rooms" :key="room._id" style="margin-bottom: 1.3rem">
      <h2>{{ room.name }}</h2>
      <span>Number of Seats: {{ room.numberOfSeats }}</span>
    </div>
  </div>

  <a href="/admin/sale/create"
     style="padding: 0.8rem 1.5rem; background: #3A3B3C; color: #efefef">+</a>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from "vue";

import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import { createCustomError, handleErrors } from '../../../../errors/ErrorHandler.js';

const fetchError = ref(null);

const URL = import.meta.env.VITE_BACKEND_URI + "rooms";

const rooms = ref([]);
const isLoading = ref(true);

const fetchRoomData = async () => {
  try {
    const response = await axios.get(URL);
    rooms.value = response.data.rooms;
  } catch (error) {
    handleErrors(error, fetchError);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchRoomData);
</script>

<style scoped>
</style>

<!-- @TODO komunikat gdy sal jest zero i wygląd -->
<!-- @TODO slider ładowania -->