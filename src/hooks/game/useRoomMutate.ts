import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";
import { getNextChat } from "../../modules/Chat/chat";
import { Database } from "../../types/supabase";
import { Chat, User } from "../../types/types";
import { ToastPopUp } from "../../modules/Toast";

export type MutationHandler = {
  onSuccess?: () => void;
  onSettled?: () => void;
  onError?: (error: Error) => void;
};

const useRoomMutate = () => {
  const updateRoomWithSupabase = async ({
    updateRoom,
    roomId,
  }: {
    roomId: number;
    updateRoom: Database["public"]["Tables"]["rooms"]["Update"];
  }) => {
    const { error } = await supabase
      .from("rooms")
      .update({ ...updateRoom })
      .eq("id", roomId);

    if (error) throw error;
  };

  const { mutate: updateRoom } = useMutation({
    mutationKey: ["room", "patch-room"],
    mutationFn: updateRoomWithSupabase,
  });

  const handleExit = async (
    room: Database["public"]["Tables"]["rooms"]["Row"],
    user: User,
    mutationHandler: MutationHandler
  ) => {
    const newParticipants: string[] =
      room.participant?.filter((nickName) => nickName !== user?.nickname) || [];
    const nextChat = getNextChat(room.chats, {
      who: user?.id || "",
      msg: `${user?.nickname}이 퇴장하였습니다`,
    });

    // 방의 master가 현재 userId와 같다면 방폭
    if (user.id === room?.master) {
      const { error } = await supabase
        .from("rooms")
        .delete()
        .eq("master", user.id);

      if (!error) {
        ToastPopUp({
          type: "info",
          message: "방을 삭제합니다...",
        });
        return mutationHandler;
      }
    } else {
      updateRoom(
        {
          roomId: room.id,
          updateRoom: { participant: newParticipants, chats: nextChat },
        },
        mutationHandler
      );
    }
  };

  const handleEnter = (
    room: Database["public"]["Tables"]["rooms"]["Row"],
    user: User,
    mutationHandler: MutationHandler
  ) => {
    const curUser = user!;
    const nextParticipant = [...(room?.participant || []), curUser.nickname!];
    const currentChats = Array.isArray(room.chats)
      ? (room.chats as string[])
      : [];
    const newMessage = `${curUser.nickname}님이 입장하였습니다.`; // 사용자 닉네임 사용
    const updatedChats = [
      ...currentChats,
      { who: curUser.id, msg: newMessage },
    ];

    updateRoom(
      {
        roomId: room.id,
        updateRoom: { participant: nextParticipant, chats: updatedChats },
      },
      mutationHandler
    );
  };

  return { updateRoom, handleEnter, handleExit };
};

export default useRoomMutate;
