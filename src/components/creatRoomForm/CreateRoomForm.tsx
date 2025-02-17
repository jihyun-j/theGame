import React, { useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import { supabase } from "../../api/supabase";
import { ToastPopUp } from "../../modules/Toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSetGlobalModal } from "../../store/store";
import { useNavigate } from "react-router-dom";

type RoomInfo = {
  roomTitle: string;
};

export default function CreateRoomForm() {
  const navi = useNavigate();
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
    if (!user?.id) {
      return ToastPopUp({
        type: "error",
        message: "잠시 후 다시 시도해주십시오",
      });
    }
    if (!roomInfo.roomTitle) {
      return ToastPopUp({
        type: "error",
        message: "방 이름을 입력해주세요",
      });
    }

    const { data } = await supabase.from("rooms").select("*");
    const isParticipants = data?.some((room) =>
      room.participant?.includes(user?.nickname)
    );

    // 로그인 유저가 이미 만든 방이 존재한다면 생성 X
    if (isParticipants) {
      return ToastPopUp({
        type: "error",
        message: "방은 한 개만 만들 수 있어요",
      });
    }

    const { data: createdRoom, error } = await supabase
      .from("rooms")
      .insert([
        {
          roomTitle: roomInfo.roomTitle,
          participant: [user?.nickname],
          master: user?.id,
        },
      ])
      .select();

    // 에러 발생 시 생성 X
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

    const { id: roomId } = createdRoom[0];
    // 방 생성 완료되면 해당 룸으로 리다이렉트
    navi(`/game/${roomId}`);

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
