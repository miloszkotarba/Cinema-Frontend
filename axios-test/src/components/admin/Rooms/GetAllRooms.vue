<template>
  <AlertDisplay/>
  <div class="admin-container">
    <header>
      <h1>Sale kinowe</h1>
      <div class="icon"><img src="../../../assets/img/rooms.svg" alt="Rooms Icon"></div>
    </header>

    <div class="indent">
      <RouterLink :to="{ name: 'adminSaleCreate'}" class="btn-add"
                  style="text-decoration: none">
        <img src="../../../assets/img/add.svg" alt="Button add">
      </RouterLink>

      <div v-if="fetchError">{{ fetchError }}</div>
      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div v-for="room in rooms" :key="room._id" class="room">
          <div class="left">
            <span class="name">{{ room.name }}</span>
            <span class="quantity">Ilość miejsc: {{ room.numberOfSeats }}</span>
          </div>
          <div class="right">
            <RouterLink :to="{ name: 'EditRoom', params: { id: room._id }}" class="btn btn-edit"
                        style="text-decoration: none; color: black">
              Edytuj
            </RouterLink>
            <button @click="deleteRoom(room._id)" class="btn btn-delete">Usuń</button>
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

const deleteRoom = async (roomID) => {
  try {
    await axios.delete(URL + `/${roomID}`);
    await fetchRoomData();
    alertService.addAlert("Usunięto salę kinową.", "success", "/admin/sale")
  } catch (error) {
    handleErrors(error, fetchError);
  }
}

onMounted(fetchRoomData);
</script>

<style scoped>
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

.admin-container .room {
  position: relative;
  display: flex;
  width: clamp(200px, 100%, 500px);
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
}

.admin-container .room:after {
  position: absolute;
  content: "";
  left: 0;
  bottom: -25px;
  width: 100%;
  height: 1px;
  background: #ccc;
  border-radius: 7px;
}

.admin-container .room .left {
  display: flex;
  flex-direction: column;
  font-size: 1.1rem;
}

.admin-container .room .left .name {
  font-weight: 500;
}

.admin-container .room .left .quantity {
  font-weight: 300;
}

.admin-container .room .right .btn {
  border: none;
  background: none;
  padding: 8px 13px;
  margin-right: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.admin-container .room .right .btn:hover {
  cursor: pointer;
}

.admin-container .room .right .btn:last-child {
  margin-right: 0;
}

.admin-container .room .right .btn-edit {
  border: 1px solid black;
}

.admin-container .room .right .btn-delete {
  border: 1px solid crimson;
  color: crimson;
}
</style>

<!-- @TODO komunikat gdy sal jest zero i wygląd -->
<!-- @TODO slider ładowania -->