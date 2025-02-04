import React, { createContext, useContext, useState } from "react";
import { supabase } from "../api/supabase";
import { ToastPopUp } from "../modules/Toast";
import Login from "../components/auth";
import { useAuthStore } from "../store/store";

interface AuthProviderType {
  user: User | null;
  signUp: () => Promise<unknown>;
  login: () => Promise<unknown>;
  userInput: User;
  handleUserInput: (type: keyof User, value: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthProviderType | undefined>(undefined);

type User = {
  nickname: string;
  password: string;
  room?: number | null;
};

type Props = {
  children: React.ReactNode;
};

// 로그인 상태에 따라 보여지는 페이지가 다릅니당
export default function AuthProvider({ children }: Props) {
  const {
    user,
    login: handleLoginState,
    setUser,
    logout: userSessionClear,
    isLogined,
  } = useAuthStore();

  const [userInput, setUserInput] = useState<User>({
    nickname: "",
    password: "",
  });

  const handleUserInput = (type: keyof User, value: string) => {
    setUserInput((prev) => ({ ...prev, [type]: value }));
  };

  const signUp = async () => {
    const { nickname, password } = userInput;
    try {
      await supabase.from("users").insert([{ nickname, password }]).select();

      ToastPopUp({
        type: "success",
        message: "회원가입 성공",
      });
    } catch (error) {
      ToastPopUp({
        type: "error",
        message: `백엔드 잘못입니다.`,
      });
      return error;
    }
  };

  const login = async () => {
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("password", userInput.password);

      if (data) {
        const { nickname, password, room } = data[0] as User;
        setUser({ nickname, password, room });
        handleLoginState();
        ToastPopUp({
          type: "success",
          message: "로그인 성공",
        });

        return data;
      }
    } catch (error) {
      ToastPopUp({
        type: "error",
        message: "로그인 실패",
      });
      return error;
    }
  };

  const logout = () => {
    userSessionClear();
    ToastPopUp({
      type: "success",
      message: "로그아웃 성공",
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, userInput, handleUserInput, signUp, login, logout }}>
      {isLogined ? children : <Login />}
    </AuthContext.Provider>
  );
}

// auth 훅
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    ToastPopUp({ type: "error", message: "유저 정보가 없습니다." });
    return {} as AuthProviderType;
  }

  return context as AuthProviderType;
};
