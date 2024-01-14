<template>
  <AlertDisplay/>
  <div>
    <div class="admin-container">
      <div class="indent">
        <header>Edycja seansu</header>
        <div v-if="isLoading">Loading...</div>
        <div v-else>
          <form @submit.prevent="updateScreening">
            <div class="field">
              <label for="datetime">data seansu</label>
              <input
                  type="datetime-local"
                  v-model="editedScreening.date"
                  :min="getCurrentDateTime()"
                  required
              />
            </div>

            <div class="field">
              <label for="movie">Wybierz film</label>
              <select v-model="editedScreening.movie._id">
                <option
                    v-for="movie in movies"
                    :key="movie._id"
                    :value="movie._id">
                  {{ movie.title }}
                </option>
              </select>
            </div>

            <div class="field">
              <label for="room">Wybierz salę</label>
              <select v-model="editedScreening.room._id">
                <option v-for="room in rooms" :key="room._id" :value="room._id">
                  {{ room.name }}
                </option>
              </select>
            </div>

            <div class="field">
              <label for="advertisementsDuration">długość reklam (min)</label>
              <input
                  type="number"
                  v-model="editedScreening.advertisementsDuration"
                  required
              />
            </div>

            <button type="submit" class="submit-btn">Zapisz zmiany</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import {onMounted, ref} from "vue";

import {
  createCustomError,
  handleErrors,
} from "../../../../errors/ErrorHandler.js";
import alertService from "@/components/alerts/AlertService.js";
import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import {useRoute} from "vue-router";

const URL = import.meta.env.VITE_BACKEND_URI + "screenings";
const URL_MOVIES = import.meta.env.VITE_BACKEND_URI + "movies";
const URL_ROOMS = import.meta.env.VITE_BACKEND_URI + "rooms";

const router = useRoute();
const screeningID = router.params.id;

const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const fetchError = ref(null);
const isLoading = ref(true)

const editedScreening = ref({
  date: getCurrentDateTime(),
  advertisementsDuration: "",
  movie: null,
  room: null,
});

const movies = ref([]);
const rooms = ref([]);


const fetchScreeningData = async () => {
  try {
    const response = await axios.get(`${URL}/${screeningID}`);
    editedScreening.value = response.data;
  } catch (error) {
    handleErrors(error, fetchError);
  } finally {
    isLoading.value = false;
  }
}

const updateScreening = async () => {
  try {
    if (editedScreening.value.advertisementsDuration < 0) {
      return alertService.addAlert("Nieprawidłowa długość reklam", "error");
    }

    const selectedMovieId = editedScreening.value.movie;
    const selectedRoomId = editedScreening.value.room;

    editedScreening.value.movie = {_id: selectedMovieId};
    editedScreening.value.room = {_id: selectedRoomId};

    await axios.patch(`${URL}/${screeningID}`, editedScreening.value);

    alertService.addAlert("Edytowano seans.", "success", "/admin/seanse");
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
  await fetchScreeningData();
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
