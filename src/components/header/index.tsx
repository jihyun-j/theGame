import React from "react";
import { useAuth } from "../../provider/AuthProvider";

/**
 * 임시 헤더입니당
 * @returns
 */
export default function Header() {
  const { logout } = useAuth();
  return (
    <div className="w-dvw h-[3rem] bg-sky-100 flex items-center justify-end px-3">
      <button
        onClick={logout}
        className="w-[9rem] rounded-[.4rem] bg-slate-700 text-white py-1 5">
        로그아웃
      </button>
    </div>
  );
}
