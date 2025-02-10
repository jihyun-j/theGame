import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabase";
import useRoomMutate from "../../hooks/game/useRoomMutate";
import { ToastPopUp } from "../../modules/Toast";
import { useAuth } from "../../provider/AuthProvider";
import { useSetGlobalModal } from "../../store/store";

export default function InviteRoomModal({ roomId }: { roomId?: number }) {
  const navi = useNavigate();
  const { closeModal } = useSetGlobalModal();
  const [shareCode, setShareCode] = useState<string>("");
  const { updateRoom } = useRoomMutate();
  const { user } = useAuth();

  const handleRoomInfoChange = (value: string) => {
    setShareCode(value);
  };

  const findRoom = async () => {
    if (roomId) {
      return await supabase.from("rooms").select().eq("id", roomId).single();
    }
    return await supabase
      .from("rooms")
      .select("*")
      .eq("share_uuid", shareCode)
      .single();
  };

  const findAndEnter = async () => {
    const { data, error } = await findRoom();

    // 방이 존재하지 않을 때
    if (error) {
      return ToastPopUp({
        type: "info",
        message: "방이 존재하지 않습니다.",
      });
    }

    if (data && Number(data?.participant?.length) > 5) {
      return ToastPopUp({
        type: "info",
        message: "정원이 초과했습니다.",
      });
    }

    if (data) {
      ToastPopUp({
        type: "success",
        message: "게임에 입장했습니다.",
      });
      const curUser = user!;
      const nextParticipant = [...(data?.participant || []), curUser.id!];
      const currentChats = Array.isArray(data.chats)
        ? (data.chats as string[])
        : [];
      const newMessage = `${curUser.nickname}님이 입장하였습니다.`; // 사용자 닉네임 사용
      const updatedChats = [
        ...currentChats,
        { who: curUser.id, msg: newMessage },
      ];

      updateRoom(
        {
          roomId: data.id,
          updateRoom: { participant: nextParticipant, chats: updatedChats },
        },
        {
          onSuccess: () => {
            navi(`/game/${data?.id}`);
          },
          onSettled: () => {
            closeModal();
          },
          onError: (err) => {
            ToastPopUp({ type: "error", message: err.message });
          },
        },
      );
    }
  };

  return (
    <React.Fragment>
      <form
        onSubmit={(e) => e.preventDefault()}
        className=' min-w-[24rem] max-w-[36rem] border-2 border-amber-600 h-[15rem] rounded-[1rem] bg-[#ebebeb90] flex flex-col items-center justify-center gap-4'>
        <h1 className='font-bold text-2xl'>
          {roomId ? "입장하기" : "초대코드 입력"}
        </h1>
        {!roomId && (
          <React.Fragment>
            <div className='flex items-center gap-3'>
              <label className='w-[5rem]' htmlFor='roomTitle'>
                초대 코드:
              </label>
              <input
                type='text'
                id='roomTitle'
                className='bg-[#fff] rounded-[.4rem] px-2'
                onChange={(e) => {
                  const { value } = e.target;
                  handleRoomInfoChange(value);
                }}
              />
            </div>
          </React.Fragment>
        )}

        <button
          className='w-full text-black max-w-[18rem] rounded-[.2rem] bg-amber-100 py-1 hover:bg-amber-700 hover:text-amber-50 cursor-pointer'
          onClick={() => {
            findAndEnter();
          }}>
          입장하기
        </button>
      </form>
    </React.Fragment>
  );
}
