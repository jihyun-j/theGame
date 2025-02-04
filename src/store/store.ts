import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserInfo = {
  nickname: string;
  room: number | null | undefined;
  password: string;
};

type AuthStore = {
  isLogined: boolean;
  user: { nickname: string; password: string; room: number | null };
  setUser: (data: UserInfo) => void;
  logout: () => void;
  login: () => void;
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      isLogined: false,
      user: { nickname: "", password: "", room: null },
      setUser: (data: UserInfo) =>
        set({
          user: {
            nickname: data.nickname,
            password: "",
            room: data.room || null,
          },
        }),
      login: () => set({ isLogined: true }),
      logout: () =>
        set({
          isLogined: false,
          user: { nickname: "", password: "", room: null },
        }),
    }),
    {
      name: "userStorage",
    }
  )
);
