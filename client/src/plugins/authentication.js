import { useAuthStore } from "@/store/auth"

export const authentication = {
  async install(){
    const store = useAuthStore()
    try {
      await store.attempt()
      return
    } catch (error) {
        console.error("Authentication attempt failed:", error);
        return
    }
  }
}