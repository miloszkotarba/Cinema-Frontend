<script setup>

</script>

<template>
  <footer>
    <div class="wrapper">
      <div class="left">
        <ul>
          <li>Informacje</li>
          <li>Regulacje</li>
          <li>Polityka prywatności</li>
          <li>Zarządzanie polityką Cookies</li>
        </ul>
      </div>
      <div class="right"></div>
    </div>
  </footer>
</template>

<style>
main {
  min-height: calc(100vh - 220px);
  width: clamp(300px, 100%, 1400px);
  margin-inline: auto;
}

footer {
  padding: 1rem;
  display: flex;
  align-items: center;
  background-color: #333;
  color: #fff;
  min-height: 140px;
  height: 100%;
}

footer .wrapper {
  margin-inline: auto;
  width: clamp(300px, 100%, 1400px);
}

footer .left ul {
  list-style: none;
}
</style>