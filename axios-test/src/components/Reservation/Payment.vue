<script setup>
import AlertDisplay from "@/components/alerts/AlertDisplay.vue";
import ProgressBar from "@/components/ProgressBar.vue";
import { ref, onMounted, inject } from 'vue';
import { watch } from "vue";
import axios from 'axios';

import { createCustomError, handleErrors } from "../../..//errors/ErrorHandler.js";
import { useRoute, useRouter } from "vue-router";

const steps = ref([
  { number: 1, description: 'WYBIERZ BILETY', active: false, done: true },
  { number: 2, description: 'WYBIERZ MIEJSCA', active: false, done: true },
  { number: 3, description: 'DANE OSOBOWE', active: false, done: true },
  { number: 3, description: 'PŁATNOŚĆ', active: true, done: false },
  { number: 4, description: 'PODSUMOWANIE', active: true, done: false },
]);

const fetchError = ref(null);

const router = useRoute();
const Router = useRouter();
const loading = ref(true);

import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import alertService from "@/components/alerts/AlertService.js";

function formatDate(inputDate) {
  const parsedDate = parseISO(inputDate);
  const formattedDate = format(parsedDate, "EEEE MM/dd/yyyy, HH:mm", { locale: pl });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

const store = inject('store');

const dataFromStore = ref(null)
const getData = async () => {
  try {
    dataFromStore.value = store.getters.getFormData;
    if (!dataFromStore.value) {
      await Router.push({ path: '/repertuar' });
    }
  } catch (error) {
    handleErrors(error, fetchError)
  } finally {
    loading.value = false
  }
}

const cardNumber = ref('');
const handleCardNumberChange = () => {
  // Usuń spacje i ewentualne inne znaki niż cyfry
  const sanitizedCardNumber = cardNumber.value.replace(/\D/g, '');

  // Grupowanie numeru karty w formie 4-4-4-4
  const formattedCardNumber = sanitizedCardNumber.replace(/(\d{4})/g, '$1 ').trim();

  if (sanitizedCardNumber.length > 16) {
    cardNumber.value = cardNumber.value.slice(0, -1)
    return
  }

  // Ustawienie sformatowanego numeru karty w modelu Vue
  cardNumber.value = formattedCardNumber;

  // Zaktualizuj zawartość elementu SVG z numerem karty
  const svgNumberElement = document.getElementById('svgnumber');
  if (svgNumberElement) {
    svgNumberElement.textContent = formattedCardNumber;
  }
};

const cardOwner = ref('');
const handleCardOwner = () => {
  // Usuń cyfry z wartości cardOwner
  const sanitizedCardOwner = cardOwner.value.replace(/\d/g, '');

  // Ustawienie zsanityzowanej wartości w modelu Vue
  cardOwner.value = sanitizedCardOwner;

  // Zaktualizuj zawartość elementu SVG z nazwą właściciela karty
  const svgCardOwnerElement = document.getElementById('svgname');
  if (svgCardOwnerElement) {
    svgCardOwnerElement.textContent = sanitizedCardOwner;
  }

  watch(cardOwner, checkCardDetailsAndSuccess);
};

const cardExpiration = ref('')
const handleCardExpiration = () => {
  // Usuń wszystko, co nie jest cyfrą
  const sanitizedExpiration = cardExpiration.value.replace(/\D/g, '');

  if (sanitizedExpiration.length > 4) {
    cardExpiration.value = cardExpiration.value.slice(0, -1)
    return
  }

  // Podziel wprowadzoną wartość na dwie części: MM i YY
  const formattedExpiration = sanitizedExpiration.replace(/(\d{2})(\d{0,2})/, (match, month, year) => {
    // Zwróć sformatowaną datę
    return year ? `${month}/${year}` : month;
  });

  // Ustawienie sformatowanej wartości w modelu Vue
  cardExpiration.value = formattedExpiration;

  // Zaktualizuj zawartość elementu SVG z datą ważności karty
  const svgCardExpirationElement = document.getElementById('svgexpire');
  if (svgCardExpirationElement) {
    svgCardExpirationElement.textContent = formattedExpiration;
  }

  watch(cardExpiration, checkCardDetailsAndSuccess);
};

const cardSecurityNumber = ref('')
const handleCardSecurityNumber = () => {
  const sanitizedSecurityNumber = cardSecurityNumber.value.replace(/\D/g, '');
  if (sanitizedSecurityNumber.length > 3) {
    cardSecurityNumber.value = cardSecurityNumber.value.slice(0, -1)
  } else {
    cardSecurityNumber.value = sanitizedSecurityNumber
  }

  watch(cardSecurityNumber, checkCardDetailsAndSuccess);
}

const swapColor = (basecolor) => {
  document.querySelectorAll('.lightcolor')
      .forEach((input) => {
        input.setAttribute('class', '');
        input.setAttribute('class', 'lightcolor ' + basecolor);
      });
  document.querySelectorAll('.darkcolor')
      .forEach((input) => {
        input.setAttribute('class', '');
        input.setAttribute('class', 'darkcolor ' + basecolor + 'dark');
      });
};

const visa_single = ref('')
const visa = ref('')
const CardSuccess = () => {
  validate.value = true
  visa_single.value = '<svg version="1.1" id="Layer_1" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100px" viewBox="0 0 750 471" enable-background="new 0 0 750 471" xml:space="preserve"><title>Slice 1</title><desc>Created with Sketch.</desc><g id="visa" sketch:type="MSLayerGroup"><path id="Shape" sketch:type="MSShapeGroup" fill="#0E4595" d="M278.198,334.228l33.36-195.763h53.358l-33.384,195.763H278.198L278.198,334.228z"/><path id="path13" sketch:type="MSShapeGroup" fill="#0E4595" d="M524.307,142.687c-10.57-3.966-27.135-8.222-47.822-8.222c-52.725,0-89.863,26.551-90.18,64.604c-0.297,28.129,26.514,43.821,46.754,53.185c20.77,9.597,27.752,15.716,27.652,24.283c-0.133,13.123-16.586,19.116-31.924,19.116c-21.355,0-32.701-2.967-50.225-10.274l-6.877-3.112l-7.488,43.823c12.463,5.466,35.508,10.199,59.438,10.445c56.09,0,92.502-26.248,92.916-66.884c0.199-22.27-14.016-39.216-44.801-53.188c-18.65-9.056-30.072-15.099-29.951-24.269c0-8.137,9.668-16.838,30.559-16.838c17.447-0.271,30.088,3.534,39.936,7.5l4.781,2.259L524.307,142.687"/><path id="Path" sketch:type="MSShapeGroup" fill="#0E4595" d="M661.615,138.464h-41.23c-12.773,0-22.332,3.486-27.941,16.234l-79.244,179.402h56.031c0,0,9.16-24.121,11.232-29.418c6.123,0,60.555,0.084,68.336,0.084c1.596,6.854,6.492,29.334,6.492,29.334h49.512L661.615,138.464L661.615,138.464z M596.198,264.872c4.414-11.279,21.26-54.724,21.26-54.724c-0.314,0.521,4.381-11.334,7.074-18.684l3.607,16.878c0,0,10.217,46.729,12.352,56.527h-44.293V264.872L596.198,264.872z"/><path id="path16" sketch:type="MSShapeGroup" fill="#0E4595" d="M232.903,138.464L180.664,271.96l-5.565-27.129c-9.726-31.274-40.025-65.157-73.898-82.12l47.767,171.204l56.455-0.064l84.004-195.386L232.903,138.464"/><path id="path18" sketch:type="MSShapeGroup" fill="#F2AE14" d="M131.92,138.464H45.879l-0.682,4.073c66.939,16.204,111.232,55.363,129.618,102.415l-18.709-89.96C152.877,142.596,143.509,138.896,131.92,138.464"/></g></svg>';

  visa.value = '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="visa" fill-rule="nonzero"> <rect id="Rectangle-1" fill="#0E4595" x="0" y="0" width="750" height="471" rx="40"></rect> <polygon id="Shape" fill="#FFFFFF" points="278.1975 334.2275 311.5585 138.4655 364.9175 138.4655 331.5335 334.2275"></polygon> <path d="M524.3075,142.6875 C513.7355,138.7215 497.1715,134.4655 476.4845,134.4655 C423.7605,134.4655 386.6205,161.0165 386.3045,199.0695 C386.0075,227.1985 412.8185,242.8905 433.0585,252.2545 C453.8275,261.8495 460.8105,267.9695 460.7115,276.5375 C460.5795,289.6595 444.1255,295.6545 428.7885,295.6545 C407.4315,295.6545 396.0855,292.6875 378.5625,285.3785 L371.6865,282.2665 L364.1975,326.0905 C376.6605,331.5545 399.7065,336.2895 423.6355,336.5345 C479.7245,336.5345 516.1365,310.2875 516.5505,269.6525 C516.7515,247.3835 502.5355,230.4355 471.7515,216.4645 C453.1005,207.4085 441.6785,201.3655 441.7995,192.1955 C441.7995,184.0585 451.4675,175.3575 472.3565,175.3575 C489.8055,175.0865 502.4445,178.8915 512.2925,182.8575 L517.0745,185.1165 L524.3075,142.6875" id="path13" fill="#FFFFFF"></path> <path d="M661.6145,138.4655 L620.3835,138.4655 C607.6105,138.4655 598.0525,141.9515 592.4425,154.6995 L513.1975,334.1025 L569.2285,334.1025 C569.2285,334.1025 578.3905,309.9805 580.4625,304.6845 C586.5855,304.6845 641.0165,304.7685 648.7985,304.7685 C650.3945,311.6215 655.2905,334.1025 655.2905,334.1025 L704.8025,334.1025 L661.6145,138.4655 Z M596.1975,264.8725 C600.6105,253.5935 617.4565,210.1495 617.4565,210.1495 C617.1415,210.6705 621.8365,198.8155 624.5315,191.4655 L628.1385,208.3435 C628.1385,208.3435 638.3555,255.0725 640.4905,264.8715 L596.1975,264.8715 L596.1975,264.8725 Z" id="Path" fill="#FFFFFF"></path> <path d="M232.9025,138.4655 L180.6625,271.9605 L175.0965,244.8315 C165.3715,213.5575 135.0715,179.6755 101.1975,162.7125 L148.9645,333.9155 L205.4195,333.8505 L289.4235,138.4655 L232.9025,138.4655" id="path16" fill="#FFFFFF"></path> <path d="M131.9195,138.4655 L45.8785,138.4655 L45.1975,142.5385 C112.1365,158.7425 156.4295,197.9015 174.8155,244.9525 L156.1065,154.9925 C152.8765,142.5965 143.5085,138.8975 131.9195,138.4655" id="path18" fill="#F2AE14"></path> </g> </g>';

  const ccicon = document.getElementById('ccicon');
  ccicon.innerHTML = visa.value

  const ccsingle = document.getElementById('ccsingle');
  ccsingle.innerHTML = visa_single.value

  swapColor('green');
}

const CardReset = () => {
  validate.value = false
  const ccicon = document.getElementById('ccicon');
  ccicon.innerHTML = ""

  const ccsingle = document.getElementById('ccsingle');
  ccsingle.innerHTML = ""

  swapColor('grey');
}

const validate = ref(false)
const screeningID = ref(null)
const handleButtonClick = async () => {
  if (validate.value === false) {
    alertService.addAlert("Uzupełnij wszystkie dane", "error")
    return
  }
  /*Router.push({ path: '/repertuar/podsumowanie' })*/

  const allData = getAllDataFromStore();
  const seatsJSON = createSeatsJSON(allData.formData, allData.selectedSeats);

  const clientObject = {
    lastName: allData.personalData.lastName,
    firstName: allData.personalData.firstName,
    email: allData.personalData.email
  };

  const mergedObject = {
    seats: seatsJSON,
    client: clientObject
  };

  screeningID.value = allData.formData.screeningData._id
  await addReservation(mergedObject)
}

const getAllDataFromStore = () => {
  return store.getters.getAllData;
}

const URL = import.meta.env.VITE_BACKEND_URI + 'screenings/'

const addReservation = async (object) => {
  try {
    const NEW_URL = URL + screeningID.value + '/reservations'
    const response = await axios.post(NEW_URL, object);
    alertService.addAlert("Kupiono bilety.", "success", "/repertuar/podsumowanie");
  } catch (error) {
    alertService.addAlert(error, "error")
    handleErrors(error, fetchError);
  }
};


function createSeatsJSON(formData, selectedSeats) {
  const seatsJSON = [];

  for (const seatIndex in selectedSeats) {
    const seatNumber = selectedSeats[seatIndex];
    const seatType = findSeatType(formData, seatNumber);

    seatsJSON.push({
      "seatNumber": seatNumber,
      "typeOfSeat": seatType,
    });
  }

  return seatsJSON;
}

function findSeatType(formData, seatNumber) {
  const ulgowyCount = formData.ulgowy || 0;
  const normalnyCount = formData.normalny || 0;

  if (ulgowyCount > 0) {
    formData.ulgowy -= 1;
    return "ulgowy";
  } else if (normalnyCount > 0) {
    formData.normalny -= 1;
    return "normalny";
  } else {
    // In case there are no more available seats of either type
    return null;
  }
}

const checkCardDetailsAndSuccess = () => {
  // Sprawdź, czy cardOwner nie jest pusty
  if (cardOwner.value.trim() === '') {
    // Jeśli cardOwner jest pusty, zakończ funkcję
    CardReset()
    return;
  }

  // Sprawdź, czy cardSecurityNumber składa się tylko z 3 cyfr
  const sanitizedSecurityNumber = cardSecurityNumber.value.replace(/\D/g, '');
  if (sanitizedSecurityNumber.length !== 3) {
    // Jeśli cardSecurityNumber nie składa się z 3 cyfr, zakończ funkcję
    CardReset()
    return;
  }

  // Sprawdź, czy cardNumber składa się z 16 cyfr
  const sanitizedCardNumber = cardNumber.value.replace(/\D/g, '');
  if (sanitizedCardNumber.length !== 16) {
    // Jeśli cardNumber nie składa się z 16 cyfr, zakończ funkcję
    CardReset()
    return;
  }

  // Jeśli wszystkie warunki są spełnione, wywołaj funkcję CardSuccess
  CardSuccess();
};

onMounted(getData)
</script>

<template>
  <main>
    <AlertDisplay/>
    <link rel="stylesheet"
          href="https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css">
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
            <span
                style="display: block; font-weight: 300; font-size: 1.5rem">{{
                dataFromStore && dataFromStore.screeningData ? formatDate(dataFromStore.screeningData.date) : ''
              }}</span>
            <span class="title">{{
                dataFromStore && dataFromStore.screeningData && dataFromStore.screeningData.movie
                    ? dataFromStore.screeningData.movie.title : ''
              }}/2D</span>
          </div>
          <div class="right">
            <span style="font-size: 2rem; font-weight: 500">Sala: {{
                dataFromStore && dataFromStore.screeningData && dataFromStore.screeningData.room
                    ? dataFromStore.screeningData.room.name : ''
              }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper">
      <div class="personal-data-wrapper">
        <div class="container2">
          <div v-if="loading" class="load">
            <div class="one"></div>
            <div class="two"></div>
            <div class="three"></div>
          </div>
          <div v-else style="padding-top: 2.5rem">
            <form @submit.prevent="handleButtonClick()">
              <h1>Proces płatności</h1>
              <div class="payment-table-container">
                <div class="container-card preload">
                  <div class="creditcard">
                    <div class="front">
                      <div id="ccsingle"></div>
                      <svg version="1.1" id="cardfront" xmlns="http://www.w3.org/2000/svg"
                           xmlns:xlink="http://www.w3.org/1999/xlink"
                           x="0px" y="0px" viewBox="0 0 750 471" style="enable-background:new 0 0 750 471;"
                           xml:space="preserve">
                    <g id="Front">
                        <g id="CardBackground">
                            <g id="Page-1_1_">
                                <g id="amex_1_">
                                    <path id="Rectangle-1_1_" class="lightcolor grey" d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                            C0,17.9,17.9,0,40,0z"/>
                                </g>
                            </g>
                          <path class="darkcolor greydark"
                                d="M750,431V193.2c-217.6-57.5-556.4-13.5-750,24.9V431c0,22.1,17.9,40,40,40h670C732.1,471,750,453.1,750,431z"/>
                        </g>
                      <text transform="matrix(1 0 0 1 60.106 295.0121)" id="svgnumber" class="st2 st3 st4">0123 4567 8910 1112</text>
                      <text transform="matrix(1 0 0 1 54.1064 428.1723)" id="svgname"
                            class="st2 st5 st6" style="">JAN KOWALSKI</text>
                      <text transform="matrix(1 0 0 1 54.1074 389.8793)" class="st7 st5 st8">cardholder name</text>
                      <text transform="matrix(1 0 0 1 479.7754 388.8793)" class="st7 st5 st8">expiration</text>
                      <text transform="matrix(1 0 0 1 65.1054 241.5)" class="st7 st5 st8">card number</text>
                      <g>
                            <text transform="matrix(1 0 0 1 574.4219 433.8095)" id="svgexpire"
                                  class="st2 st5 st9">01/23</text>
                        <text transform="matrix(1 0 0 1 479.3848 417.0097)" class="st2 st10 st11">VALID</text>
                        <text transform="matrix(1 0 0 1 479.3848 435.6762)" class="st2 st10 st11">THRU</text>
                        <polygon class="st2" points="554.5,421 540.4,414.2 540.4,427.9 		"/>
                        </g>
                      <g id="cchip">
                            <g>
                                <path class="st2" d="M168.1,143.6H82.9c-10.2,0-18.5-8.3-18.5-18.5V74.9c0-10.2,8.3-18.5,18.5-18.5h85.3
                        c10.2,0,18.5,8.3,18.5,18.5v50.2C186.6,135.3,178.3,143.6,168.1,143.6z"/>
                            </g>
                        <g>
                                <g>
                                    <rect x="82" y="70" class="st12" width="1.5" height="60"/>
                                </g>
                          <g>
                                    <rect x="167.4" y="70" class="st12" width="1.5" height="60"/>
                                </g>
                          <g>
                                    <path class="st12" d="M125.5,130.8c-10.2,0-18.5-8.3-18.5-18.5c0-4.6,1.7-8.9,4.7-12.3c-3-3.4-4.7-7.7-4.7-12.3
                            c0-10.2,8.3-18.5,18.5-18.5s18.5,8.3,18.5,18.5c0,4.6-1.7,8.9-4.7,12.3c3,3.4,4.7,7.7,4.7,12.3
                            C143.9,122.5,135.7,130.8,125.5,130.8z M125.5,70.8c-9.3,0-16.9,7.6-16.9,16.9c0,4.4,1.7,8.6,4.8,11.8l0.5,0.5l-0.5,0.5
                            c-3.1,3.2-4.8,7.4-4.8,11.8c0,9.3,7.6,16.9,16.9,16.9s16.9-7.6,16.9-16.9c0-4.4-1.7-8.6-4.8-11.8l-0.5-0.5l0.5-0.5
                            c3.1-3.2,4.8-7.4,4.8-11.8C142.4,78.4,134.8,70.8,125.5,70.8z"/>
                                </g>
                          <g>
                                    <rect x="82.8" y="82.1" class="st12" width="25.8" height="1.5"/>
                                </g>
                          <g>
                                    <rect x="82.8" y="117.9" class="st12" width="26.1" height="1.5"/>
                                </g>
                          <g>
                                    <rect x="142.4" y="82.1" class="st12" width="25.8" height="1.5"/>
                                </g>
                          <g>
                                    <rect x="142" y="117.9" class="st12" width="26.2" height="1.5"/>
                                </g>
                            </g>
                        </g>
                    </g>
                        <g id="Back">
                    </g>
                </svg>
                    </div>
                    <div class="back">
                      <svg version="1.1" id="cardback" xmlns="http://www.w3.org/2000/svg"
                           xmlns:xlink="http://www.w3.org/1999/xlink"
                           x="0px" y="0px" viewBox="0 0 750 471" style="enable-background:new 0 0 750 471;"
                           xml:space="preserve">
                    <g id="Front">
                        <line class="st0" x1="35.3" y1="10.4" x2="36.7" y2="11"/>
                    </g>
                        <g id="Back">
                        <g id="Page-1_2_">
                            <g id="amex_2_">
                                <path id="Rectangle-1_2_" class="darkcolor greydark" d="M40,0h670c22.1,0,40,17.9,40,40v391c0,22.1-17.9,40-40,40H40c-22.1,0-40-17.9-40-40V40
                        C0,17.9,17.9,0,40,0z"/>
                            </g>
                        </g>
                          <rect y="61.6" class="st2" width="750" height="78"/>
                          <g>
                            <path class="st3" d="M701.1,249.1H48.9c-3.3,0-6-2.7-6-6v-52.5c0-3.3,2.7-6,6-6h652.1c3.3,0,6,2.7,6,6v52.5
                    C707.1,246.4,704.4,249.1,701.1,249.1z"/>
                            <rect x="42.9" y="198.6" class="st4" width="664.1" height="10.5"/>
                            <rect x="42.9" y="224.5" class="st4" width="664.1" height="10.5"/>
                            <path class="st5"
                                  d="M701.1,184.6H618h-8h-10v64.5h10h8h83.1c3.3,0,6-2.7,6-6v-52.5C707.1,187.3,704.4,184.6,701.1,184.6z"/>
                        </g>
                          <text transform="matrix(1 0 0 1 621.999 227.2734)" id="svgsecurity" class="st6 st7">985</text>
                          <g class="st8">
                            <text transform="matrix(1 0 0 1 518.083 280.0879)" class="st9 st6 st10">security code</text>
                        </g>
                          <rect x="58.1" y="378.6" class="st11" width="375.5" height="13.5"/>
                          <rect x="58.1" y="405.6" class="st11" width="421.7" height="13.5"/>
                          <text transform="matrix(1 0 0 1 59.5073 228.6099)" id="svgnameback"
                                class="st12 st13">John Doe</text>
                    </g>
                </svg>
                    </div>
                  </div>
                </div>
                <div class="form-container">
                  <div class="field-container">
                    <label for="name">Imię i nazwisko</label>
                    <input id="name" maxlength="20" type="text" @input="handleCardOwner" v-model="cardOwner">
                  </div>
                  <div class="field-container">
                    <label for="cardnumber">Numer karty</label>
                    <input id="cardnumber" type="text" inputmode="numeric" v-model="cardNumber"
                           @input="handleCardNumberChange">
                    <svg id="ccicon" class="ccicon" width="750" height="471" viewBox="0 0 750 471" version="1.1"
                         xmlns="http://www.w3.org/2000/svg"
                         xmlns:xlink="http://www.w3.org/1999/xlink">

                    </svg>
                  </div>
                  <div class="field-container">
                    <label for="expirationdate">Data wygaśnięcia (mm/yy)</label>
                    <input id="expirationdate" type="text" inputmode="numeric" v-model="cardExpiration"
                           @input="handleCardExpiration">
                  </div>
                  <div class="field-container">
                    <label for="securitycode">Kod CCV</label>
                    <input id="securitycode" type="text" inputmode="numeric"
                           v-model="cardSecurityNumber" @input="handleCardSecurityNumber">
                  </div>
                </div>
              </div>
              <button type="submit" class="btn-action">ZAPŁAĆ ></button>
              <!-- @TODO Walidacja danych czy niepuste itp... -->
            </form>
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

.payment-table-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}

.btn-action {
  background: #62369c;
  width: 360px;
  font-weight: 300;
  padding: 14px 0;
  text-align: center;
  color: #fff;
  border-radius: 8px;
  border: none;
  font-size: 1.6rem;
  margin-top: 2rem;
  float: right;
  transition: all ease .2s;
}

.btn-action:hover {
  background: #4d1b8f;
  cursor: pointer;
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

.payment-title {
  width: 100%;
  text-align: center;
}

.form-container .field-container:first-of-type {
  grid-area: name;
}

.form-container .field-container:nth-of-type(2) {
  grid-area: number;
}

.form-container .field-container:nth-of-type(3) {
  grid-area: expiration;
}

.form-container .field-container:nth-of-type(4) {
  grid-area: security;
}

.field-container input {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.field-container {
  position: relative;
}

.payment-table-container .form-container {
  display: grid;
  grid-column-gap: 10px;
  grid-template-columns: auto auto;
  grid-template-rows: 90px 90px 90px;
  grid-template-areas: "name name""number number""expiration security";
  max-width: 400px;
  padding: 20px;
  color: #707070;
}

.payment-table-container label {
  padding-bottom: 5px;
  font-size: 13px;
}

.payment-table-container input {
  margin-top: 3px;
  padding: 15px;
  font-size: 16px;
  width: 100%;
  border-radius: 3px;
  border: 1px solid #dcdcdc;
}

.ccicon {
  height: 38px;
  position: absolute;
  right: 8px;
  top: calc(50% - 10px);
  width: 60px;
}

/* CREDIT CARD IMAGE STYLING */
.preload * {
  -webkit-transition: none !important;
  -moz-transition: none !important;
  -ms-transition: none !important;
  -o-transition: none !important;
}

.container-card {
  width: 100%;
  max-width: 400px;
  max-height: 251px;
  height: 54vw;
  padding: 20px;
}

@media screen and (max-width: 750px) {
  .payment-table-container {
    flex-direction: column;
  }
}

@media screen and (max-width: 500px) {
  html {
    font-size: 10px;
  }
}

@media screen and (max-width: 200px) {
  .payment-table-container .container-card {
    display: none;
  }
}

#ccsingle {
  position: absolute;
  right: 15px;
  top: 20px;
}

#ccsingle svg {
  width: 100px;
  max-height: 60px;
  display: none;
}

.creditcard svg#cardfront,
.creditcard svg#cardback {
  width: 100%;
  -webkit-box-shadow: 1px 5px 6px 0px black;
  box-shadow: 1px 5px 6px 0px black;
  border-radius: 22px;
}

#generatecard {
  cursor: pointer;
  float: right;
  font-size: 12px;
  color: #fff;
  padding: 2px 4px;
  background-color: #909090;
  border-radius: 4px;
  cursor: pointer;
  float: right;
}

/* CHANGEABLE CARD ELEMENTS */
.creditcard .lightcolor,
.creditcard .darkcolor {
  -webkit-transition: fill .5s;
  transition: fill .5s;
}

.creditcard .lightblue {
  fill: #03A9F4;
}

.creditcard .lightbluedark {
  fill: #0288D1;
}

.creditcard .red {
  fill: #ef5350;
}

.creditcard .reddark {
  fill: #d32f2f;
}

.creditcard .purple {
  fill: #ab47bc;
}

.creditcard .purpledark {
  fill: #7b1fa2;
}

.creditcard .cyan {
  fill: #26c6da;
}

.creditcard .cyandark {
  fill: #0097a7;
}

.creditcard .green {
  fill: #66bb6a;
}

.creditcard .greendark {
  fill: #388e3c;
}

.creditcard .lime {
  fill: #d4e157;
}

.creditcard .limedark {
  fill: #afb42b;
}

.creditcard .yellow {
  fill: #ffeb3b;
}

.creditcard .yellowdark {
  fill: #f9a825;
}

.creditcard .orange {
  fill: #ff9800;
}

.creditcard .orangedark {
  fill: #ef6c00;
}

.creditcard .grey {
  fill: #bdbdbd;
}

.creditcard .greydark {
  fill: #616161;
}

/* FRONT OF CARD */
#svgname {
  text-transform: uppercase;
}

#cardfront .st2 {
  fill: #FFFFFF;
}

#cardfront .st3 {
  font-family: 'Source Code Pro', monospace;
  font-weight: 600;
}

#cardfront .st4 {
  font-size: 54.7817px;
}

#cardfront .st5 {
  font-family: 'Source Code Pro', monospace;
  font-weight: 400;
}

#cardfront .st6 {
  font-size: 33.1112px;
}

#cardfront .st7 {
  opacity: 0.6;
  fill: #FFFFFF;
}

#cardfront .st8 {
  font-size: 24px;
}

#cardfront .st9 {
  font-size: 36.5498px;
}

#cardfront .st10 {
  font-family: 'Source Code Pro', monospace;
  font-weight: 300;
}

#cardfront .st11 {
  font-size: 16.1716px;
}

#cardfront .st12 {
  fill: #4C4C4C;
}

/* BACK OF CARD */
#cardback .st0 {
  fill: none;
  stroke: #0F0F0F;
  stroke-miterlimit: 10;
}

#cardback .st2 {
  fill: #111111;
}

#cardback .st3 {
  fill: #F2F2F2;
}

#cardback .st4 {
  fill: #D8D2DB;
}

#cardback .st5 {
  fill: #C4C4C4;
}

#cardback .st6 {
  font-family: 'Source Code Pro', monospace;
  font-weight: 400;
}

#cardback .st7 {
  font-size: 27px;
}

#cardback .st8 {
  opacity: 0.6;
}

#cardback .st9 {
  fill: #FFFFFF;
}

#cardback .st10 {
  font-size: 24px;
}

#cardback .st11 {
  fill: #EAEAEA;
}

#cardback .st12 {
  font-family: 'Rock Salt', cursive;
}

#cardback .st13 {
  font-size: 37.769px;
}

/* FLIP ANIMATION */
.container-card {
  perspective: 1000px;
}

.creditcard {
  width: 100%;
  max-width: 400px;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  transition: -webkit-transform 0.6s;
  -webkit-transition: -webkit-transform 0.6s;
  transition: transform 0.6s;
  transition: transform 0.6s, -webkit-transform 0.6s;
  cursor: pointer;
}

.creditcard .front,
.creditcard .back {
  position: absolute;
  width: 100%;
  max-width: 400px;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  color: #47525d;
}

.creditcard .back {
  -webkit-transform: rotateY(180deg);
  transform: rotateY(180deg);
}

.creditcard.flipped {
  -webkit-transform: rotateY(180deg);
  transform: rotateY(180deg);
}
</style>