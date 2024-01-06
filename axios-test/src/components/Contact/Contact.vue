<script setup>

</script>

<template>
  <main>
    <div class="wrapper">
      <div class="title">
        <h1>Kontakt</h1>
      </div>
      <div class="header">
        <img src="../../assets/img/logo.png" alt="logo">
        <span class="name">Screenix Łódź</span>
      </div>
      <div class="description">
        <div class="text">
          Kino Screenix zlokalizowane jest w Manufakturze w Łodzi. Posiada 10 klimatyzowanych sal wyposażonych w wysokiej klasy sprzęt nagłaśniający, dźwięk cyfrowy Dolby ATMOS oraz DOLBY 7.1, a także srebrne ekrany najwyższej światowej jakości 4K. Wyróżniające się nowoczesnym designem, wyposażone w wygodne, skórzane fotele z regulacją siedzeń, system dźwięku Dolby Atmos i obraz w rozdzielczości 4K sale, wyznaczają nowe standardy odbioru filmu w kinie.
          Poza regularnym repertuarem, w którym prezentowane są największe hity światowej kinematografii, Screenix oferuje Widzom także seanse specjalne takie jak: Nocne Maratony Filmowe i Screenix dla Dzieci.
          <br><br>
          W kinie funkcjonuje także Screenix Café, w której można napić się aromatycznej kawy w wielu smakach oraz bar kinowy, który oferuje Widzom świeży popcorn, napoje oraz duży wybór słodyczy.
        </div>
        <div class="img">

        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main .wrapper {
  padding-inline: 1rem;
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

.header{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
}

.header img{
  width: 40px;
  filter: invert(9%) sepia(82%) saturate(3259%) hue-rotate(260deg) brightness(119%) contrast(100%);
}
 .header .name{
   font-weight: 600;
   margin-left: 10px;
 }
 .text{
   font-size: 16px;
 }

hr {
  border: 0.5px solid #686868;
  margin: 10px 0;
}


</style>