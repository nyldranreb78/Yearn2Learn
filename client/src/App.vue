<script setup lang="js">
import { RouterView } from "vue-router";
import { onBeforeMount } from "vue";
import { useCoreStore } from "./store/core";
import NavBar from "./components/NavBar.vue";

onBeforeMount(async () => {
  await useCoreStore().fetchData();
  await useCoreStore().fetchTasks();
  await useCoreStore().fetchFlashcards();
});
</script>

<template>
  <div id="app">
    <NavBar />
    <RouterView />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
