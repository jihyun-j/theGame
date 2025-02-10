import React, { createContext, useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../api/supabase";
import Login from "../components/auth";
import { ToastPopUp } from "../modules/Toast";
import { useAuthStore } from "../store/store";

interface AuthProviderType {
  user: User | null;
  signUp: () => Promise<unknown>;
  login: () => Promise<unknown>;
  userInput: Partial<User>;
  handleUserInput: (type: keyof User, value: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthProviderType | undefined>(undefined);

export type User = {
  id: string;
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
    setUser,
    login: handleLoginState,
    logout: userSessionClear,
    isLogined,
  } = useAuthStore();

  const { pathname } = useLocation();

  const [userInput, setUserInput] = useState<Partial<User>>({
    nickname: "",
    password: "",
  });

  const handleUserInput = (type: keyof User, value: string) => {
    setUserInput((prev) => ({ ...prev, [type]: value }));
  };

  const signUp = async () => {
    const { nickname, password } = userInput;

    if (!nickname || !password) return;

    // 계정 조회 - 같은 닉네임이 있나 확인
    const { data: duplicateName } = await supabase
      .from("users")
      .select("*")
      .eq("nickname", nickname);

    // 같은 닉네임 존재하면 막음
    if (duplicateName && duplicateName.length > 0) {
      return ToastPopUp({
        type: "error",
        message: "계정이 이미 존재합니다",
      });
    }

    // 생성 시도
    const { error: createUserError } = await supabase
      .from("users")
      .insert([{ nickname, password }])
      .select();

    // 생성 에러 처리
    if (createUserError) {
      return ToastPopUp({
        type: "error",
        message: `백엔드 잘못입니다.`,
      });
    }

    // 생성 성공
    ToastPopUp({
      type: "success",
      message: "회원가입 성공",
    });
  };

  const login = async () => {
    const { nickname, password } = userInput;

    if (!nickname || !password) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("password", password)
      .eq("nickname", nickname);

    if (error) {
      return ToastPopUp({
        type: "error",
        message: "로그인 실패",
      });
    }

    if (data && data.length === 0) {
      return ToastPopUp({
        type: "error",
        message: "닉네임, 비밀번호를 확인해주세요",
      });
    }

    if (data && data.length === 1) {
      const { nickname, password, room, id } = data[0] as User;
      setUser({ id, nickname, password, room });
      handleLoginState();
      ToastPopUp({
        type: "success",
        message: "로그인 성공",
      });
      setUserInput({ nickname: "", password: "" });

      return data;
    }
  };

  const logout = () => {
    userSessionClear();
    ToastPopUp({
      type: "success",
      message: "로그아웃 성공",
    });
  };

  // authProvider에서 제외되는 페이지인가 확인
  // pages 배열 안에 경로를 추가해주세욥
  const getExceptAuthPage = () => {
    const pages = ["/test"];
    return pages.some((path) => path === pathname);
  };

  return (
    <AuthContext.Provider
      value={{ user, userInput, handleUserInput, signUp, login, logout }}>
      {isLogined || getExceptAuthPage() ? children : <Login />}
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
