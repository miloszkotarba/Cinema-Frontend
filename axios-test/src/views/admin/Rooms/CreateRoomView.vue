<script setup>
import CreateRoom from "@/components/admin/Rooms/CreateRoom.vue";
import MainPage from "@/components/admin/MainPage.vue";
</script>

<template>
  <MainPage>
    <template #PageContent>
      <CreateRoom/>
    </template>
  </MainPage>
</template>

<style>

</style>