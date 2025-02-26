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
        console.error("Error getting note:", error.response?.data || error.message);
        throw error.message;
      }
    },

    async createNote(noteData) {
      try {
        const { data } = await useApiPrivate().post(`/api/note/create`, noteData);
        return data;
      } catch (error) {
        console.error("Error creating note:", error.response?.data || error.message);
        throw error.message;
      }
    },

    async getFolder(){
      try {
        const { data } = await useApiPrivate().get(`/api/folder`);
        
        console.log(data);  

        return data;
      } catch (error) {
        console.error("Error getting folders:", error.response?.data || error.message);
        throw error.message;
      }
    },

    async createFolder(folderData) {
      try {
        const { data } = await useApiPrivate().post(`/api/folder/create`, folderData);
        return data;
      } catch (error) {
        console.error("Error creating folder:", error.response?.data || error.message);
        throw error.message;
      }
    },

    async createNoteInFolder(folderId, noteData) {
      try {
        const { data } = await useApiPrivate().post(`/api/note/${folderId}/create`, noteData);
        return data;
      } catch (error) {
        console.error("Error creating note in folder:", error.response?.data || error.message);
        throw error.message;
      }
    },

    async getNotesInFolder(folderId) {
      try {
        const { data } = await useApiPrivate().get(`/api/note/${folderId}/notes`);
        return data;
      } catch (error) {
        console.error("Error getting note in folder:", error.response?.data || error.message);
        throw error.message;
      }
    },

    async updateNote(noteId, noteData) {
      try {
        const { data } = await useApiPrivate().patch(`/api/note/${noteId}`, noteData);
        return data;
      } catch (error) {
        console.error("Error getting note in folder:", error.response?.data || error.message);
        throw error.message;
      }
    },
  },
});
