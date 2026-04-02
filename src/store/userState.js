import { create } from 'zustand'

const useUserState = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

export default useUserState

