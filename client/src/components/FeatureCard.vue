<template>
    <router-link :to="{ name: props.routeName }" class="card text-reset text-decoration-none h-100">
        <div class="card-header">
            <i :class="'me-1 bi bi-' + props.bootstrapIconCode"></i>
            {{ props.featureName }}
        </div>
        <div class="card-body">
            <p class="card-text">{{ props.description }}</p>
        </div>
    </router-link>
</template>

<script setup>
    const props = defineProps(['bootstrapIconCode', 'featureName', 'routeName', 'description'])
</script>