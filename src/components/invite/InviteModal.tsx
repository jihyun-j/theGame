import React, { useState } from "react";
import { supabase } from "../../api/supabase";
import { ToastPopUp } from "../../modules/Toast";
import { useSetGlobalModal } from "../../store/store";
import { useNavigate } from "react-router-dom";

export default function InviteRoomModal() {
  const navi = useNavigate();
  const { closeModal } = useSetGlobalModal();
  const [shareCode, setShareCode] = useState<string>("");

  const handleRoomInfoChange = (value: string) => {
    setShareCode(value);
  };

  const findAndEnter = async () => {
    const { data } = await supabase
      .from("rooms")
      .select("*")
      .eq("share_uuid", shareCode);

    // 방이 존재하지 않을 때
    if (data?.length === 0) {
      return ToastPopUp({
        type: "info",
        message: "방이 존재하지 않습니다.",
      });
    }

    if (data && data[0]?.startAt !== null) {
      return ToastPopUp({
        type: "info",
        message: "게임이 진행 중인 방에 입장할 수 없습니다.",
      });
    }

    if (data && Number(data[0]?.participant?.length) > 5) {
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
      navi(`/game/${data[0]?.id}`);
      closeModal();
    }
  };

  return (
    <React.Fragment>
      <form
        onSubmit={(e) => e.preventDefault()}
        className=" min-w-[24rem] max-w-[36rem] border-2 border-amber-600 h-[15rem] rounded-[1rem] bg-[#ebebeb90] flex flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-2xl">초대코드 입력</h1>

        <div className="flex items-center gap-3">
          <label className="w-[5rem]" htmlFor="roomTitle">
            초대 코드:
          </label>
          <input
            type="text"
            id="roomTitle"
            className="bg-[#fff] rounded-[.4rem] px-2"
            onChange={(e) => {
              const { value } = e.target;
              handleRoomInfoChange(value);
            }}
          />
        </div>

        <button
          className="w-full text-black max-w-[18rem] rounded-[.2rem] bg-amber-100 py-1 hover:bg-amber-700 hover:text-amber-50 cursor-pointer"
          onClick={() => {
            findAndEnter();
          }}>
          입장하기
        </button>
      </form>
    </React.Fragment>
  );
}
