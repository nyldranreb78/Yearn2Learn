<template>
  <div id="app">
    <div v-if="!isInUserManagement">
      <NavBar />
    </div>

    <RouterView />
  </div>
</template>

<script setup lang="js">
import { useRouter, RouterView } from "vue-router";
import { computed } from "vue";
import NavBar from "./components/NavBar.vue";

const router = useRouter();

const isInUserManagement = computed(() => {
  const currentPath = router.currentRoute.value.name;

  return currentPath === "login" || currentPath === "register";
});
</script>

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
