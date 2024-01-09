<script setup>
import axios from 'axios';
import { onMounted, ref } from "vue";

import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import { handleErrors } from "../../../errors/ErrorHandler.js";
import alertService from "@/components/alerts/AlertService.js";

const fetchError = ref(null);

const URL = import.meta.env.VITE_BACKEND_URI + "movies";
const URL_SCREENINGS = import.meta.env.VITE_BACKEND_URI + "screenings";

const movies = ref([]);
const currentDate = ref(new Date());
const loading = ref(true)

const getFormattedDate = () => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = String(currentDate.getFullYear());

  return `${day}-${month}-${year}`;
};

const selectedDay = ref(getFormattedDate());
const fetchSpecificMovieData = async (day) => {
  loading.value = true; // Pokaż animację ładowania
  selectedDay.value = day; // Update selectedDay when a day is clicked
  movies.value = []; // Clear existing movie data

  setTimeout(async () => {
    try {
      const response = await axios.get(URL);
      const moviesToFind = response.data.movies;

      for (const movie of moviesToFind) {
        const { _id: movieID } = movie;

        try {
          const reservationResponse = await axios.get(
              URL_SCREENINGS + `?movie=${movieID}&date=${day}`
          );

          if (reservationResponse.data.total > 0) {
            const screenings = reservationResponse.data.screenings;
            movies.value.push({
              ...movie,
              screenings: [...screenings],
            });
          }
        } catch (error) {
          console.error(`Błąd podczas pobierania rezerwacji dla filmu ${movie.title}:`, error);
        }
      }
    } catch (error) {
      handleErrors(error, fetchError);
    } finally {
      loading.value = false;
    }
  }, 500);
};


/**/
/*Day links*/
/**/

const days = ref([]);

const generateDays = () => {
  const today = new Date();
  today.setDate(today.getDate());
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const dayNames = ['ND', 'PN', 'WT', 'ŚR', 'CZ', 'PT', 'SO'];

  for (let i = 0; i < 9; i++) {
    const date = new Date(currentYear, currentMonth, currentDay + i);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const dayName = dayNames[date.getDay()];

    days.value.push({ id: formattedDate, name: dayName, date });
  }
};

import { format } from 'date-fns';
import locale from 'date-fns/locale/pl';

const getDataDetails = () => {
  const formattedDate = format(currentDate.value, "EEEE dd/MM/yyyy", { locale });
  return formattedDate.toLocaleUpperCase();
}

const setDataDetails = (dateString) => {
  const [day, month, year] = dateString.split('-').map(Number);

  if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
    currentDate.value = new Date(year, month - 1, day);
  } else {
    console.error('Invalid date format.');
  }
}

const formatScreeningDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'HH:mm');
};

onMounted(() => {
  generateDays();
  fetchSpecificMovieData(new Date());
});

</script>

<template>
  <main>
    <AlertDisplay/>
    <div class="booking-box-top">
      <div class="container">
        <span class="title">Repertuar Kina Screenix</span>
        <div class="calendar">
          <div class="days">
            <span v-for="day in days" :key="day.id" :id="day.id"
                  :class="{ 'now': selectedDay === day.id }"
                  @click="fetchSpecificMovieData(day.id); setDataDetails(day.id)"
            >{{ day.name }}</span>
          </div>
          <div class="icon">
            <img src="https://vps.miloszkotarba.pl/~vue/tst2/assets/calendar.png" alt="Calendar Icon"/>
          </div>
        </div>
        <div class="date">
          <span>{{ getDataDetails() }}</span>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="movie-wrapper">
        <div style="padding: 0.2rem"></div>
        <div class="container">
          <div v-if="loading" class="load">
            <div class="one"></div>
            <div class="two"></div>
            <div class="three"></div>
          </div>
          <div v-else>
            <div v-for="movie in movies" :key="movie._id" class="movie-box">
              <div class="left">
                <img :src="movie.posterUrl" alt="Poster image"/>
              </div>
              <div class="right">
                <RouterLink class="title" :to="{ name: 'repertuarId', params: { id: movie._id }}">{{
                    movie.title
                  }}
                </RouterLink>
                <div class="movie-details">
                <span class="type">{{
                    movie.genres && movie.genres.length > 0 ? movie.genres[0].replace(/"/g, '') : 'Brak gatunku'
                  }}</span>
                  <div class="dimension">2D</div>
                  <span class="duration">czas trwania: {{ movie.duration }} min</span>
                </div>
                <div class="booking">
                  <div v-for="screening in movie.screenings" :key="screening.date" class="box">
                  <span>
                    <RouterLink style="color: white; text-decoration: none"
                                :to="{ name: 'TicketQuantity', params: { id: screening._id }}">
                    {{ formatScreeningDate(screening.date) }}
                  </RouterLink>
                  </span>
                  </div>
                </div>
              </div>
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
}

.booking-box-top .calendar {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.booking-box-top .calendar .days {
  text-transform: uppercase;
  font-weight: 500;
  font-size: 1.2rem;
  width: 85%;
  display: flex;
  justify-content: space-around;
  flex: 1;
}

.booking-box-top .calendar .days span {
  cursor: pointer;
}

.booking-box-top .calendar .days .now {
  color: #4d1b8f;
  font-weight: 600;
}

.booking-box-top .calendar .icon img {
  width: 30px;
  display: none;
}

.booking-box-top .date {
  color: #333;
  font-size: 1.2rem;
  padding-bottom: 1rem;
}

.booking-box-top {
  border-bottom: 1.3px solid #dfdfdf;
}

.movie-wrapper .movie-box {
  display: flex;
  margin: 2rem 0;
  position: relative;
}

.movie-box::after {
  position: absolute;
  content: "";
  bottom: -0.85rem;
  width: 100%;
  height: 1px;
  background: lightgray;
  border-radius: 5px;
}

.movie-box:last-child::after {
  display: none;
}

.movie-box .left img {
  width: 155px;
  height: 225px;
}

.movie-box .right {
  margin-left: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 0.5rem;
}

.movie-box .right .title {
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 400;
  text-decoration: none;
  color: black;
}

.movie-box .right .movie-details {
  font-weight: 300;
}

.movie-box .right .booking {
  display: flex;
  gap: 1rem;
}

.movie-box .right .booking .box {
  background: #4d1b8f;
  border-radius: 5px;
  padding: 5px 20px;
  color: #fff;
  font-weight: 200;
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

  * {
    font-size: 14px;
  }
}
</style>

<!-- @TODO naprawa filtra czasu w endpoincie-->