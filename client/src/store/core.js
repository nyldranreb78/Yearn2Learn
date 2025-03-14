import { defineStore } from "pinia";
import { useAuthStore } from "@/store/auth";

export const useCoreStore = defineStore("core", {
    state: () => ({
        folderList: [],
        authStore: useAuthStore()
    }),

    getters: {
        folders: (state) => state.folderList,
    },

    actions: {
        async fetchData() {
            try {
                const response = await this.authStore.getFolder();
                
                if (response) {
                    this.folderList = response.folders;
        
                    for (const folder of this.folderList) {
                        folder.notes = await Promise.all(folder.notes.map(async (noteId) => {
                            const noteDetails = await this.authStore.getNoteByID(noteId);
                            return noteDetails.note;
                        }));
                    }
                }
        
            } catch (error) {
                console.error("Error fetching folders:", error);
            }
        },

        // FOLDERS
        async addFolder(folderName, folderPriority){
            // Add the new folder to the list
            try{
                const folder = {
                    name: folderName,
                    priority: folderPriority,
                    notes: []
                }
            
                const response = await this.authStore.createFolder(folder);
                this.folderList.push(response.folder);
            } catch (error) {
                console.error("Error adding folder:", error);
            }
        },

        async editFolder(folderId, folderName, folderPriority){
            try {
                const updatedFolder = {
                    name: folderName,
                    priority: folderPriority
                };
        
                await this.authStore.updateFolder(folderId, updatedFolder);
        
                const folderIndex = this.folderList.findIndex(folder => folder._id === folderId);

                if (folderIndex !== -1) {
                    this.folderList[folderIndex] = { ...this.folderList[folderIndex], ...updatedFolder };
                }
            } catch (error) {
                console.error("Error updating folder:", error.response?.data || error.message);
            }
        },

        async deleteFolder(folderId){
            try {
                await this.authStore.deleteFolder(folderId);
        
                this.folderList = this.folderList.filter(folder => folder._id !== folderId);
        
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        },
    
        // NOTES
        async addNote(parentFolderId, noteTitle){
            // Find the folder the note is going to be associated with
            const folder = this.folderList.find(folder => folder._id === parentFolderId);
            if (!folder) {
                console.error("Error: Folder not found!");
                return;
            }
        
            if (!folder.notes) {
                folder.notes = [];
            }
        
            // Add the new note to the folder's list of notes
            const note = {
                title: noteTitle,
                content: "<p><br></p>" // Quill editor's definition of an "empty" editor
            }
        
            try {
                const savedNote = await this.authStore.createNoteInFolder(folder._id, note);
                folder.notes.push(savedNote.note);
                
                return savedNote.note;
            } catch (error) {
                console.error("Error saving note to backend:", error);
                return;
            }
        },

        async editNote(noteId, noteTitle, noteContent) {
            try {
                const updatedNote = {
                    title: noteTitle,
                    content: noteContent,
                };
        
                await this.authStore.updateNote(noteId, updatedNote);
            } catch (error) {
                console.error("Error updating note:", error.response?.data || error.message);
            }
        },

        async deleteNote(noteId){ 
            try {
                await this.authStore.deleteNote(noteId);
        
                this.folderList = this.folderList.map((folder) => {
                    return {
                        ...folder,
                        notes: folder.notes.filter((note) => note._id !== noteId), // Remove deleted note
                    };
                });
        
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        }
    },

    
});