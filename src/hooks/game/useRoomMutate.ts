import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";
import { getNextChat } from "../../modules/Chat/chat";
import { User } from "../../provider/AuthProvider";
import { Database } from "../../types/supabase";

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

  const handleExit = (
    room: Database["public"]["Tables"]["rooms"]["Row"],
    user: User,
    mutationHandler: MutationHandler,
  ) => {
    const newParticipants: string[] =
      room.participant?.filter((userId) => userId !== user?.id) || [];
    const nextChat = getNextChat(room.chats, {
      who: user?.id || "",
      msg: `${user?.nickname}이 퇴장하였습니다`,
    });

    updateRoom(
      {
        roomId: room.id,
        updateRoom: { participant: newParticipants, chats: nextChat },
      },
      mutationHandler,
    );
  };

  const handleEnter = (
    room: Database["public"]["Tables"]["rooms"]["Row"],
    user: User,
    mutationHandler: MutationHandler,
  ) => {
    const curUser = user!;
    const nextParticipant = [...(room?.participant || []), curUser.id!];
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
      mutationHandler,
    );
  };

  return { updateRoom, handleEnter, handleExit };
};

export default useRoomMutate;
