import React from "react";
import { useAuth } from "../../provider/AuthProvider";

export default function Login() {
  const { handleUserInput, userInput, signUp, login } = useAuth();

  return (
    <div className="w-full min-h-screen bg-amber-400 flex flex-col justify-center items-center">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full max-w-[24rem] border-2 border-amber-600 h-[15rem] rounded-[1rem] bg-[#ebebeb90] flex flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl">로그인</h1>

        <div className="flex items-center gap-3">
          <label className="w-[5rem]" htmlFor="nickname">
            닉네임:
          </label>
          <input
            type="text"
            id="nickname"
            className="bg-[#fff] rounded-[.4rem] px-2"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              handleUserInput("nickname", value);
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="w-[5rem]" htmlFor="password">
            비밀번호:
          </label>
          <input
            type="password"
            id="password"
            className="bg-[#fff] rounded-[.4rem] px-2"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              handleUserInput("password", value);
            }}
          />
        </div>
        <p className="text-[.8rem] ">
          계정이 있다면 비밀번호만 입력해도 로그인 됩니다.
        </p>
        <button
          className="w-full text-black max-w-[18rem] rounded-[.2rem] bg-amber-100 py-1 hover:bg-amber-700 hover:text-amber-50 cursor-pointer"
          onClick={() => {
            if (userInput.nickname) {
              return signUp();
            } else {
              return login();
            }
          }}>
          {userInput.nickname ? "회원가입" : "로그인"}
        </button>
      </form>
    </div>
  );
}
