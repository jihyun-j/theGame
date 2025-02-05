import React, { useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import { supabase } from "../../api/supabase";
import { ToastPopUp } from "../../modules/Toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSetGlobalModal } from "../../store/store";

type RoomInfo = {
  roomTitle: string;
};

export default function CreateRoomForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { closeModal } = useSetGlobalModal();
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    roomTitle: "",
  });

  const handleRoomInfoChange = (type: keyof RoomInfo, value: string) => {
    setRoomInfo((prev) => ({ ...prev, [type]: value }));
  };

  const createRoom = async () => {
    const { error } = await supabase
      .from("rooms")
      .insert([{ roomTitle: roomInfo.roomTitle, participant: [user?.id] }])
      .select();

    if (error) {
      return ToastPopUp({
        type: "error",
        message: "게임 생성 실패",
      });
    }

    ToastPopUp({
      type: "success",
      message: "게임 생성 완료",
    });
    queryClient.invalidateQueries({ queryKey: ["home", "get-room-list"] });
    closeModal();
  };

  return (
    <React.Fragment>
      <form
        onSubmit={(e) => e.preventDefault()}
        className=" min-w-[24rem] max-w-[36rem] border-2 border-amber-600 h-[15rem] rounded-[1rem] bg-[#ebebeb90] flex flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl">방 만들기</h1>

        <div className="flex items-center gap-3">
          <label className="w-[5rem]" htmlFor="roomTitle">
            방 제목:
          </label>
          <input
            type="text"
            id="roomTitle"
            className="bg-[#fff] rounded-[.4rem] px-2"
            onChange={(e) => {
              const { value } = e.target;
              handleRoomInfoChange("roomTitle", value);
            }}
          />
        </div>

        <button
          className="w-full text-black max-w-[18rem] rounded-[.2rem] bg-amber-100 py-1 hover:bg-amber-700 hover:text-amber-50 cursor-pointer"
          onClick={() => {
            createRoom();
          }}>
          방 생성
        </button>
      </form>
    </React.Fragment>
  );
}
