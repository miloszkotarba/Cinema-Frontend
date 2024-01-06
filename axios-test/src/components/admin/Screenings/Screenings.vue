<template>
  <AlertDisplay/>
  <div class="admin-container">
    <header>
      <h1>Seanse</h1>
      <div class="icon"><img src="../../../assets/img/screenings.svg" alt="Screenings Icon"></div>
    </header>

    <div class="indent">
      <div class="btn-add">
        <a href="/admin/seanse/create">
          <img src="../../../assets/img/add.svg" alt="Button add">
        </a>
      </div>

      <div v-if="fetchError">{{ fetchError }}</div>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div v-for="screening in screenings" :key="screening._id" class="screening">
          <div class="left">
            <span class="name">Film: <span class="light">{{ screening.movie.title }}</span></span>
            <span class="name">Data rozpoczęcia: <span class="light">{{ screening.date }}</span></span>
            <span class="name">Sala: <span class="light">{{ screening.room.name }}</span></span>
            <span class="name">Czas reklam: <span class="light">{{ screening.advertisementsDuration}} min</span></span>
            <span class="name">Rezerwacje: <span class="light">{{ screening.reservation}}</span> </span>
          </div>
          <div class="right">
            <RouterLink :to="{ name: 'EditScreening', params: { id: screening._id }}" class="btn btn-edit"
                        style="text-decoration: none; color: black">
              Edytuj
            </RouterLink>
            <button @click="deleteScreening(screening._id)" class="btn btn-delete">Usuń</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from "vue";

import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import { createCustomError, handleErrors } from '../../../../errors/ErrorHandler.js';
import alertService from "@/components/alerts/AlertService.js";

const fetchError = ref(null);

const URL = import.meta.env.VITE_BACKEND_URI + "screenings";

const screenings = ref([]);
const isLoading = ref(true);

const fetchScreeningData = async () => {
  try {
    const response = await axios.get(URL);
    screenings.value = response.data.screenings;
  } catch (error) {
    handleErrors(error, fetchError);
  } finally {
    isLoading.value = false;
  }
};

const deleteScreening = async (screeningID) => {
  try {
    await axios.delete(URL + `/${screeningID}`);
    await fetchScreeningData();
    alertService.addAlert("Usunięto seans.", "success", "/admin/seanse")
  } catch (error) {
    handleErrors(error, fetchError);
  }
}

onMounted(fetchScreeningData);
</script>

<style scoped>

.light {
  font-weight: 200;
  margin-left: 2px;
}
.admin-container header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.admin-container header h1 {
  font-size: 35px;
  font-weight: 500;
}

.admin-container header .icon img {
  width: 45px;
}

.admin-container .btn-add img {
  width: 45px;
  margin-bottom: 1.5rem;
}

.admin-container .indent {
  margin-left: 3rem;
  margin-top: 3rem;
}

.admin-container .screening {
  position: relative;
  display: flex;
  width: clamp(200px, 100%, 600px);
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.admin-container .screening:after {
  position: absolute;
  content: "";
  left: 0;
  bottom: -25px;
  width: 100%;
  height: 1px;
  background: #ccc;
  border-radius: 7px;
}

.admin-container .screening .left {
  display: flex;
  flex-direction: column;
  font-size: 1.05rem;
  line-height: 1.9rem;
}

.admin-container .screening .left .name {
  font-weight: 500;
}

.admin-container .screening .left .quantity {
  font-weight: 300;
}

.admin-container .screening .right .btn {
  border: none;
  background: none;
  padding: 8px 13px;
  margin-right: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.admin-container .screening .right .btn:hover {
  cursor: pointer;
}

.admin-container .screening .right .btn:last-child {
  margin-right: 0;
}

.admin-container .screening .right .btn-edit {
  border: 1px solid black;
}

.admin-container .screening .right .btn-delete {
  border: 1px solid crimson;
  color: crimson;
}
</style>