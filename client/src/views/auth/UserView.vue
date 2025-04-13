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

            <div class="text-end fs-6">
              <button
                type="button"
                class="btn btn-link text-secondary pe-0"
                @click="isEditMode = !isEditMode"
              >
                <small>
                  {{ isEditMode? 'Cancel' : 'Edit Details' }}
                </small>
              </button>
            </div>

            <form @submit.prevent="editUser()">
              <!-- Profile Details -->
              <ul class="list-group list-group-flush text-start">
                <li class="list-group-item">
                  <strong>Email: </strong>

                  <span v-show="isEditMode">
                    <small class="text-muted">
                      <i>
                        (Email address cannot be changed)
                      </i>
                    </small>
                  </span>

                  <span v-if="isEditMode">
                    <input
                      v-model="userData.email"
                      type="text"
                      class="form-control form-control-sm"
                      disabled
                    >
                  </span>

                  <span v-else>{{ userData.email }}</span>
                </li>

                <li class="list-group-item">
                  <strong>First Name: </strong>
                  <span v-if="isEditMode">
                    <input
                      v-model="userData.firstName"
                      type="text"
                      class="form-control form-control-sm"
                      required
                    >
                  </span>

                  <span v-else>{{ userData.firstName }}</span>
                </li>

                <li class="list-group-item">
                  <strong>Last Name: </strong>
                  
                  <span v-if="isEditMode">
                    <input
                      v-model="userData.lastName"
                      type="text"
                      class="form-control form-control-sm"
                      required
                    >
                  </span>

                  <span v-else>{{ userData.lastName }}</span>
                </li>

                <li
                  v-if="isEditMode"
                  class="list-group-item pe-0"
                >
                  <div class="text-end mt-1">
                    <button
                      type="button"
                      class="btn btn-sm btn-secondary"
                      @click="isEditMode = false"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      class="btn btn-sm btn-success ms-2"
                    >
                      Save Changes
                    </button>
                  </div>
                </li>
              </ul>
            </form>
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
import { ref, reactive, computed, onMounted } from "vue";

const authStore = useAuthStore();

const isEditMode = ref(false);
const userData = reactive({
  email: "",
  firstName: "",
  lastName: "",
})

const user = computed(() => {
  return authStore.userDetail;
});

async function getUser() {
  await authStore.getUser();
}

async function editUser() {
  // If any of the user info are changed, update the user
  if(userData.email !== user.value.email
    || userData.firstName !== user.value.first_name
    || userData.lastName !== user.value.last_name
  ) {
    console.log("TODO")
  }

  isEditMode.value = false;
}

onMounted(async () => {
  await getUser();

  userData.email = user.value.email;
  userData.firstName = user.value.first_name;
  userData.lastName = user.value.last_name;
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
