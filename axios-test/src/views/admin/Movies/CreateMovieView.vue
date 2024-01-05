<script setup>
import CreateMovie from "@/components/admin/Movies/CreateMovie.vue";
import MainPage from "@/components/admin/MainPage.vue";
</script>

<template>
  <MainPage>
    <template #PageContent>
      <CreateMovie/>
    </template>
  </MainPage>
</template>

<style>

</style>