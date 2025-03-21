import { defineStore } from "pinia";
import { useApi, useApiPrivate } from "../composables/useAPI";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {},
    accessToken: "",
    authReady: false,
  }),

  getters: {
    userDetail: (state) => state.user,
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    async attempt() {
      try {
        await this.refresh();
        await this.getUser();
      } catch (error) {
        return;
      }
    },

    async login(payload) {
      try {
        const { data } = await useApi().post(`/api/auth/login`, payload);
        this.accessToken = data.access_token;
        await this.getUser();
        return data;
      } catch (error) {
        throw error.message;
      }
    },

    async register(payload) {
      try {
        const { data } = await useApi().post(`/api/auth/register`, payload);
        return data;
      } catch (error) {
        throw error.message;
      }
    },

    async getUser() {
      try {
        const { data } = await useApiPrivate().get(`/api/auth/user`);
        this.user = data;
        return data;
      } catch (error) {
        throw error.message;
      }
    },

    async logout() {
      try {
        const { data } = await useApiPrivate().post(`/api/auth/logout`);
        this.accessToken = "";
        this.user = {};
        return data;
      } catch (error) {
        throw error.message;
      }
    },

    async refresh() {
      try {
        const { data } = await useApi().post(`/api/auth/refresh`);
        this.accessToken = data.access_token;
        return data;
      } catch (error) {
        throw error.message;
      }
    },

    async getNoteByID(id) {
      try {
        const { data } = await useApiPrivate().get(`/api/note/${id}`);
        return data;
      } catch (error) {
        console.error(
          "Error getting note:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async createNote(noteData) {
      try {
        const { data } = await useApiPrivate().post(
          `/api/note/create`,
          noteData
        );
        return data;
      } catch (error) {
        console.error(
          "Error creating note:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async getFolder() {
      try {
        const { data } = await useApiPrivate().get(`/api/folder`);
        return data;
      } catch (error) {
        console.error(
          "Error getting folders:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async createFolder(folderData) {
      try {
        const { data } = await useApiPrivate().post(
          `/api/folder/create`,
          folderData
        );
        return data;
      } catch (error) {
        console.error(
          "Error creating folder:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async updateFolder(folderId, folderData) {
      try {
        const { data } = await useApiPrivate().patch(
          `/api/folder/${folderId}`,
          folderData
        );
        return data;
      } catch (error) {
        console.error(
          "Error updating folder:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async createNoteInFolder(folderId, noteData) {
      try {
        const { data } = await useApiPrivate().post(
          `/api/note/${folderId}/create`,
          noteData
        );
        return data;
      } catch (error) {
        console.error(
          "Error creating note in folder:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async getNotesInFolder(folderId) {
      try {
        const { data } = await useApiPrivate().get(
          `/api/note/${folderId}/notes`
        );
        return data;
      } catch (error) {
        console.error(
          "Error getting note in folder:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async updateNote(noteId, noteData) {
      try {
        const { data } = await useApiPrivate().patch(
          `/api/note/${noteId}`,
          noteData
        );
        return data;
      } catch (error) {
        console.error(
          "Error updating note in folder:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async deleteNote(noteId) {
      try {
        const { data } = await useApiPrivate().delete(`/api/note/${noteId}`);
        return data;
      } catch (error) {
        console.error(
          "Error getting note in folder:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async deleteFolder(folderId) {
      try {
        const { data } = await useApiPrivate().delete(
          `/api/folder/${folderId}`
        );
        return data;
      } catch (error) {
        console.error(
          "Error getting note in folder:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async createTask(taskData) {
      try {
        const { data } = await useApiPrivate().post(
          `/api/task/create`,
          taskData
        );
        return data;
      } catch (error) {
        console.error(
          "Error creating task:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async getTasks() {
      try {
        const { data } = await useApiPrivate().get(`/api/task`);
        return data;
      } catch (error) {
        console.error(
          "Error getting tasks:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async updateTask(taskId, taskData) {
      try {
        const { data } = await useApiPrivate().patch(
          `/api/task/${taskId}`,
          taskData
        );
        return data;
      } catch (error) {
        console.error(
          "Error updating task:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async deleteTask(taskId) {
      try {
        const { data } = await useApiPrivate().delete(`/api/task/${taskId}`);
        return data;
      } catch (error) {
        console.error(
          "Error deleting task:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async getAllFlashcards() {
      try {
        const { data } = await useApiPrivate().get("/api/flashcard/");
        return data;
      } catch (error) {
        console.error(
          "Error fetching all flashcards:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async getUserFlashcards() {
      try {
        const { data } = await useApiPrivate().get("/api/flashcard/user");
        return data;
      } catch (error) {
        console.error(
          "Error fetching user flashcards:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async createFlashcard(flashcardData) {
      try {
        const { data } = await useApiPrivate().post(
          `/api/flashcard/`,
          flashcardData
        );
        return data;
      } catch (error) {
        console.error(
          "Error creating flashcard:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async updateFlashcard(flashcardId, flashcardData) {
      try {
        const { data } = await useApiPrivate().patch(
          `/api/flashcard/${flashcardId}`,
          flashcardData
        );
        return data;
      } catch (error) {
        console.error(
          "Error updating flashcard:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async deleteFlashcard(flashcardId) {
      try {
        await useApiPrivate().delete(`/api/flashcard/${flashcardId}`);
      } catch (error) {
        console.error(
          "Error deleting flashcard:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },

    async getFlashcardsBySetName(setName) {
      try {
        const { data } = await useApiPrivate().get(
          `/api/flashcard/set/${encodeURIComponent(setName)}`
        );
        return data;
      } catch (error) {
        console.error(
          "Error fetching flashcards by setName:",
          error.response?.data || error.message
        );
        throw error.message;
      }
    },
  },
});
