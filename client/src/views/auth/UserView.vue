<template>
  <div id="user">
    <div class="container">
      <Suspense>
        <template #default>
          <div
            v-if="user"
            class="card profile-card text-center"
          >
            <h4>{{ user.full_name }}</h4>
            <p class="text-muted">
              @{{ user.username }}
            </p>

            <!-- Profile Details -->
            <ul class="list-group list-group-flush text-start">
              <li class="list-group-item">
                <strong>Email:</strong> {{ user.email }}
              </li>
              <li class="list-group-item">
                <strong>First Name:</strong> {{ user.first_name }}
              </li>
              <li class="list-group-item">
                <strong>Last Name:</strong> {{ user.last_name }}
              </li>
            </ul>
          </div>
        </template>

        <template #fallback>
          <p>Loading...</p>
        </template>
      </Suspense>
    </div>
  </div>
</template>


<script setup lang="js">
import { useAuthStore } from "../../store/auth";
import { computed, onMounted } from "vue";

const authStore = useAuthStore();

const user = computed(() => {
  console.log(authStore.userDetail);
  return authStore.userDetail;
});

async function getUser() {
  await authStore.getUser();
}

onMounted(async () => {
  await getUser();
});
</script>

<style scoped>
#user {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.profile-card {
  max-width: 400px;
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

</style>
