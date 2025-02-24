import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../api/supabase";
import { getNextChat } from "../../modules/Chat/chat";
import useRoom from "../../store/room.store";
import { Chat } from "../../types/types";
import ChatInput from "./ChatInput";

interface ChatboxProps {
  roomId: number;
}

const ChatBox: React.FC<ChatboxProps> = ({ roomId }) => {
  const navi = useNavigate();
  const { room, updateRoom } = useRoom();
  const messages = room?.chats as Chat[];
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [userMap, setUserMap] = useState<{ [key: string]: string }>({});

  const getUserInfo = async () => {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, nickname");

    if (error) {
      console.log("유저 정보를 가져올 수 없습니다.");
      return;
    }

    const userObj = users.reduce((acc, user) => {
      acc[user.id] = user.nickname;
      return acc;
    }, {} as { [key: string]: string });

    if (userObj) setUserMap(userObj);
  };

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
    getUserInfo();
  }, []);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 날짜 형식
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col w-3xs h-96 m-4 border rounded-sm p-3">
      <p>Room Name</p>
      <div className="overflow-scroll flex-1">
        {messages?.map((message, index) => (
          <div key={message.createdAt}>
            <div className="text-sm font-semibold">
              <span className="mr-2">{formatTime(message.createdAt)}</span>
              <span>{userMap[message.who]}</span>
            </div>
            <p key={index}>{message.msg}</p>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div>
        <ChatInput sendMessage={sendMessageHandler} />
      </div>
    </div>
  );
};

export default ChatBox;
