import { MouseEvent } from "react";
import { supabase } from "../../api/supabase";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ToastPopUp } from "../../modules/Toast";
import { useAuth } from "../../provider/AuthProvider";

export default function useAccessGame() {
  const { id } = useParams();
  const { user } = useAuth();
  const navi = useNavigate();

  const getRoom = async () => {
    const { data: roomInfo } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", Number(id));

    return roomInfo;
  };

  const { data } = useQuery({
    queryKey: ["room-info", id],
    queryFn: () => {
      return getRoom();
    },
  });

  const handleShare = (e: MouseEvent<HTMLButtonElement>) => {
    const { id } = e.target as HTMLElement;
    if (!id)
      return ToastPopUp({
        type: "error",
        message: "초대 코드가 존재하지 않습니다.",
      });

    window.navigator.clipboard
      .writeText(id)
      .then(() => {
        ToastPopUp({
          type: "success",
          message: "초대 코드 복사 완료",
        });
      })
      .catch((err) => {
        ToastPopUp({
          type: "error",
          message: "초대 코드 복사 실패",
        });
      });
  };

  // 퇴장하기
  const exitRoom = async () => {
    if (data) {
      const newParticipants: string[] =
        data[0]?.participant?.filter((userId) => userId !== user?.id) || [];

      await supabase
        .from("rooms")
        .update({ participant: newParticipants })
        .eq("id", Number(id))
        .select();
    }

    navi("/");
  };

  return { handleShare, exitRoom, data };
}
