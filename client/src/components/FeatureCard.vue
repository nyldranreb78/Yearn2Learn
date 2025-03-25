<template>
  <router-link
    :to="{ name: routeName }"
    class="card text-reset text-decoration-none h-100"
  >
    <div v-if="featureName" class="card-header">
      <i :class="'me-1 bi bi-' + bootstrapIconCode" />
      {{ featureName }}
    </div>

    <div class="card-body">
      <p class="card-text">
        <span class="">{{ description }}</span>
      </p>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  bootstrapIconCode: { type: String, default: "question-circle" },
  featureName: { type: String },
  routeName: { type: String, default: "home" },
  description: { type: String, default: "No description available." },
});
</script>
