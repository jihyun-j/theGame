import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabase";
import { getNextChat } from "../../modules/Chat/chat";
import useRoom from "../../store/room.store";
import { Chat } from "../../types/types";
import ChatInput from "./ChatInput";
import { useEffect, useState } from "react";

interface ChatboxProps {
  roomId: number;
}

const ChatBox: React.FC<ChatboxProps> = ({ roomId }) => {
  const navi = useNavigate();
  const { room, updateRoom } = useRoom();
  const messages = room?.chats as Chat[];

  const [isRoomDeleted, setIsRoomDeleted] = useState<boolean>(false);

  // 메세지 보내기
  const sendMessageHandler = async (text: string, userId: string) => {
    if (!text.trim()) return;

    // 새로운 메세지
    const newMessage = {
      who: userId,
      msg: text,
    };

    const { data } = await supabase
      .from("rooms")
      .select("chats")
      .eq("id", roomId)
      .single();

    const prevChats: Chat[] = Array.isArray(data?.chats)
      ? (data?.chats as Chat[])
      : [];

    const updatedChats = getNextChat(prevChats, newMessage);

    updateRoom({ chats: updatedChats });
  };

  useEffect(() => {
    supabase
      .channel(`game-room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        () => {
          const deleteNotice: Chat[] = [
            {
              createdAt: new Date().toISOString(),
              msg: "방폭됩니다.",
              who: "봇",
            },
          ];
          updateRoom({ chats: deleteNotice });

          setIsRoomDeleted(true);
        }
      )
      .subscribe();
  });

  //!TODO : 방장 퇴장 시 ChatBox에 방폭 알림 띄우기
  useEffect(() => {
    if (isRoomDeleted) {
      const deleteNotice: Chat[] = [
        { createdAt: new Date().toISOString(), msg: "방폭됩니다.", who: "봇" },
      ];
      updateRoom({ chats: deleteNotice });
      setTimeout(() => {
        navi("/");
      }, 3000);
    }
  }, [isRoomDeleted]);

  return (
    <div className="grid grid-rows-3 w-3xs h-96 m-4 border rounded-sm p-3">
      <p>Room Name</p>
      <div className="overflow-scroll">
        {messages?.map((message, index) => (
          <p key={index}>{message.msg}</p>
        ))}
      </div>
      <div>
        <ChatInput sendMessage={sendMessageHandler} />
      </div>
    </div>
  );
};

export default ChatBox;
