import { useQuery } from "@tanstack/react-query";
import { MouseEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../api/supabase";
import { getNextChat } from "../../modules/Chat/chat";
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
      .eq("id", Number(id))
      .single();

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
        data?.participant?.filter((userId) => userId !== user?.id) || [];
      const nextChat = getNextChat(data?.chats, {
        who: user?.id || "",
        msg: `${user?.nickname}이 퇴장하였습니다`,
      });

      await supabase
        .from("rooms")
        .update({ participant: newParticipants, chats: nextChat })
        .eq("id", Number(id))
        .select();
    }

    navi("/");
  };

  return { handleShare, exitRoom, data };
}
