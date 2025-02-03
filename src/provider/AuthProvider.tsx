import React, { createContext, useContext, useState } from "react";
import { supabase } from "../api/supabase";
import { ToastPopUp } from "../modules/Toast";
import Login from "../components/auth";

interface AuthProviderType {
  user: User | null;
  signUp: (user: User) => Promise<unknown>;
  login: (password: string) => Promise<unknown>;
  userInput: User;
  handleUserInput: (type: keyof User, value: string) => void;
  // logout: () => Promise<unknown>;
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
  const [userInput, setUserInput] = useState<User>({
    nickname: "",
    password: "",
  });

  const [user, setUser] = useState<User>({
    nickname: "",
    password: "",
    room: null,
  });

  const handleUserInput = (type: keyof User, value: string) => {
    setUserInput((prev) => ({ ...prev, [type]: value }));
  };

  const signUp = async (userInput: User) => {
    const { nickname, password } = userInput;
    try {
      const { error } = await supabase
        .from("users")
        .insert([{ nickname, password }])
        .select();

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

  const login = async (password: string) => {
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("password", password);

      if (data) {
        ToastPopUp({
          type: "success",
          message: "로그인 성공",
        });

        setUser(data[0] as User);

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

  // const logout = async () => {
  //   try {
  //     //
  //   } catch (error) {
  //     //
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{ user, userInput, handleUserInput, signUp, login }}>
      {user ? children : <Login />}
    </AuthContext.Provider>
  );
}

// auth 훅
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    ToastPopUp({ type: "error", message: "유저 정보가 없습니다." });
  }

  return context;
};
