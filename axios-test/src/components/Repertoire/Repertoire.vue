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
const isLoading = ref(true);

const fetchMovieData = async () => {
  try {
    const response = await axios.get(URL)
    const moviesToFind = response.data.movies

    for (const movie of moviesToFind) {
      const { _id: movieID } = movie

      try {
        const reservationResponse = await axios.get(
            URL_SCREENINGS + `?movie=${movieID}&date=06-01-2024`
        )

        if (reservationResponse.data.total > 0) {
          movies.value.push(movie)
        }
      } catch (error) {
        console.error(`Błąd podczas pobierania rezerwacji dla filmu ${movie.title}:`, error)
      }
    }
  } catch (error) {
    handleErrors(error, fetchError)
  } finally {
    isLoading.value = false
  }
}

const getFormattedDate = (char) => {
  const today = new Date();
  const day = today.getDate().toString().padStart(2, '0');
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const year = today.getFullYear();

  return `${day}${char}${month}${char}${year}`;
}

const selectedDay = ref("2023-01-06");
const fetchSpecificMovieData = async (day) => {
  selectedDay.value = day; // Update selectedDay when a day is clicked
  movies.value = []; // Clear existing movie data

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
          movies.value.push(movie);
        }
      } catch (error) {
        console.error(`Błąd podczas pobierania rezerwacji dla filmu ${movie.title}:`, error);
      }
    }
  } catch (error) {
    handleErrors(error, fetchError);
  }
};

function getPolishDayName() {
  const daysOfWeek = ['NIEDZIELA', 'PONIEDZIAŁEK', 'WTOREK', 'ŚRODA', 'CZWARTEK', 'PIĄTEK', 'SOBOTA'];
  const today = new Date();
  const dayIndex = today.getDay();
  return daysOfWeek[dayIndex];
}

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

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentYear, currentMonth, currentDay + i);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const dayName = dayNames[date.getDay()];

    days.value.push({ id: formattedDate, name: dayName, date });
  }
};

const isToday = (date) => {
  const today = new Date();
  return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
  );
};

generateDays();

onMounted(fetchMovieData);

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
                  @click="fetchSpecificMovieData(day.id)"
            >{{
                day.name
              }}</span>
          </div>
          <div class="icon">
            <img src="https://vps.miloszkotarba.pl/~vue/tst2/assets/calendar.png" alt="Calendar Icon"/>
          </div>
        </div>
        <div class="date">
          <span>{{ getPolishDayName() }} {{ getFormattedDate("/") }}</span>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="movie-wrapper">
        <div style="padding: 0.2rem"></div>
        <div class="container">
          <div v-for="movie in movies" :key="movie._id" class="movie-box">
            <div class="left">
              <img :src="movie.posterUrl" alt="Poster image"/>
            </div>
            <div class="right">

              <RouterLink class="title" :to="{ name: 'repertuarId', params: { id: movie._id }}">{{ movie.title }}</RouterLink>
              <div class="movie-details">
                <span class="type">{{
                    movie.genres && movie.genres.length > 0 ? movie.genres[0].replace(/"/g, '') : 'Brak gatunku'
                  }}</span>
                <div class="dimension">2D</div>
                <span class="duration">czas trwania: {{ movie.duration }} min</span>
              </div>
              <div class="booking">
                <div class="box">
                  <span>12:15</span>
                </div>
                <div class="box">19:10</div>
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
}

.booking-box-top .calendar .days span {
  cursor: pointer;
}

.booking-box-top .calendar .days .now {
  color: #4d1b8f;
}

.booking-box-top .calendar .icon img {
  width: 30px;
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