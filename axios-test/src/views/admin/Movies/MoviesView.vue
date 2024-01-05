<script setup>
import GetAllMovies from "@/components/admin/Movies/GetAllMovies.vue";
import MainPage from "@/components/admin/MainPage.vue";
</script>

<template>
  <MainPage>
    <template #PageContent>
      <GetAllMovies/>
    </template>
  </MainPage>
</template>

<style scoped>

</style>