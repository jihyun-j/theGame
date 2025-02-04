import React from "react";
import { useAuth } from "../../provider/AuthProvider";

export default function Header() {
  const { logout } = useAuth();
  return (
    <div>
      <button
        onClick={logout}
        className="w-[9rem] rounded-[.4rem] bg-slate-700 text-white py-1 absolute top-1.5 right-1.5">
        로그아웃
      </button>
    </div>
  );
}
