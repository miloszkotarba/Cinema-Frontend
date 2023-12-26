<script setup>
import Movies from "@/components/admin/Movies/GetAllMovies.vue";
import MainPage from "@/components/admin/MainPage.vue";
</script>

<template>
  <MainPage>
    <template #PageContent>
      <Movies/>
    </template>
  </MainPage>
</template>

<style scoped>

</style>