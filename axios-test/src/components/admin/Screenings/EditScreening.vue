<template>
  <AlertDisplay/>
  <div>
    <div class="admin-container">
      <div class="indent">
        <header>Edycja seansu</header>
        <form @submit.prevent="updateScreening">
          <div class="field">
            <label for="datetime">data seansu</label>
            <input
                type="datetime-local"
                v-model="newScreening.date"
                :min="getCurrentDateTime()"
                required
            />
          </div>

          <div class="field">
            <label for="movie">Wybierz film</label>
            <select v-model="newScreening.movie">
              <option
                  v-for="movie in movies"
                  :key="movie._id"
                  :value="movie._id"
              >
                {{ movie.title }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="room">Wybierz salę</label>
            <select v-model="newScreening.room">
              <option v-for="room in rooms" :key="room._id" :value="room._id">
                {{ room.name }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="advertisementsDuration">długość reklam (min)</label>
            <input
                type="number"
                v-model="newScreening.advertisementsDuration"
                required
            />
          </div>

          <button type="submit" class="submit-btn">Zapisz zmiany</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";

import {
  createCustomError,
  handleErrors,
} from "../../../../errors/ErrorHandler.js";
import alertService from "@/components/alerts/AlertService.js";
import AlertDisplay from "@/components/alerts/AlertDisplay.vue";

const URL = import.meta.env.VITE_BACKEND_URI + "screenings";
const URL_MOVIES = import.meta.env.VITE_BACKEND_URI + "movies";
const URL_ROOMS = import.meta.env.VITE_BACKEND_URI + "rooms";

/*const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
};*/

const fetchError = ref(null);

const editedScreening = ref({
  date: getCurrentDateTime(),
  advertisementsDuration: "",
  movie: null,
  room: null,
});

const movies = ref([]);
const rooms = ref([]);

const addScreening = async () => {
  try {
    if (newScreening.value.advertisementsDuration < 0) {
      return alertService.addAlert("Nieprawidłowa długość reklam", "error");
    }

    const selectedMovieId = newScreening.value.movie;
    const selectedRoomId = newScreening.value.room;

    newScreening.value.movie = { _id: selectedMovieId };
    newScreening.value.room = { _id: selectedRoomId };

    const response = await axios.post(URL, newScreening.value);

    newScreening.value = {
      date: getCurrentDateTime(),
      advertisementsDuration: "",
      movie: null,
      room: null,
    };

    alertService.addAlert("Dodano seans.", "success", "/admin/seanse");
  } catch (error) {
    alertService.addAlert(error.response.data.error, "error")
    handleErrors(error, fetchError);
  }
};

const getAllMovies = async () => {
  try {
    const response = await axios.get(URL_MOVIES);
    movies.value = response.data.movies;
  } catch (error) {
    handleErrors(error, fetchError);
  }
};

const getAllRooms = async () => {
  try {
    const response = await axios.get(URL_ROOMS);
    rooms.value = response.data.rooms;
  } catch (error) {
    handleErrors(error, fetchError);
  }
};

const getAllRoomsAndMovies = async () => {
  await getAllRooms();
  await getAllMovies();
};

onMounted(getAllRoomsAndMovies);
</script>

<style scoped>
.admin-container {
  width: clamp(200px, 100%, 600px);
}

.admin-container header {
  font-size: 23px;
  text-transform: uppercase;
  margin-bottom: 3rem;
}

.admin-container .indent {
  margin-left: 3rem;
}

.admin-container form .field {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1.3rem;
}

.admin-container form .field input,
.admin-container form .field select {
  max-width: 350px;
  width: 100%;
  padding: 8px 15px;
  border-radius: 5px;
  border: 1px solid black;
  font-size: 1.05rem;
}

.admin-container form .field select {
  cursor: pointer;
}

.admin-container .submit-btn {
  float: right;
  background: #686868;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  text-transform: uppercase;
  cursor: pointer;
}
</style>
