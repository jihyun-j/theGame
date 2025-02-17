import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserInfo = {
  id: string;
  nickname: string;
  room: number | null | undefined;
  password: string;
};

type AuthStore = {
  isLogined: boolean;
  user: {
    id: string;
    nickname: string;
    password: string;
    room: number | null;
  };
  setUser: (data: UserInfo) => void;
  logout: () => void;
  login: () => void;
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      isLogined: false,
      user: { id: "", nickname: "", password: "", room: null },
      setUser: (data: UserInfo) =>
        set({
          user: {
            id: data.id,
            nickname: data.nickname,
            password: "",
            room: data.room || null,
          },
        }),
      login: () => set({ isLogined: true }),
      logout: () =>
        set({
          isLogined: false,
          user: { id: "", nickname: "", password: "", room: null },
        }),
    }),
    {
      name: "userStorage",
    },
  ),
);

type GlobalModalStore = {
  isOpened: boolean;
  setModal: (component: JSX.Element) => void;
  closeModal: () => void;
  component: JSX.Element | null;
};

export const useSetGlobalModal = create<GlobalModalStore>((set) => ({
  isOpened: false,
  setModal: (component: JSX.Element) =>
    set({ component: component, isOpened: true }),
  closeModal: () => set({ component: null, isOpened: false }),
  component: null,
}));
