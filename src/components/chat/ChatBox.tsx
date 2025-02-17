import { useEffect, useRef, useState } from "react";
import { supabase } from "../../api/supabase";
import { getNextChat } from "../../modules/Chat/chat";
import { Chat } from "../../types/types";
import ChatInput from "./ChatInput";

interface ChatboxProps {
  roomId: number;
}

const ChatBox: React.FC<ChatboxProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // 유저의 정보 가져오기
  const getUserInfo = async () => {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, nickname");

    if (error) {
      console.log("User fetching error");
    }

    const userObj = users?.reduce((acc, user) => {
      acc[user.id] = user.nickname;
      return acc;
    }, {} as { [key: string]: string });

    if (userObj) setUsersMap(userObj);
  };

  // 방에 입장 했을 때, 메세지 가져오기
  const fetchMessage = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("chats")
      .eq("id", roomId)
      .single();

    if (!error && data.chats) {
      setMessages((data.chats as Chat[]) || []);
    }
  };

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

    await supabase
      .from("rooms")
      .update({ chats: updatedChats })
      .eq("id", roomId);
  };

  useEffect(() => {
    fetchMessage();
    getUserInfo();

    const subscription = supabase
      .channel(`game-room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          setMessages(payload.new.chats || []);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [roomId]);

  // 시간 포맷
  const formattedTime = (time: string) => {
    return new Date(time).toLocaleTimeString("kr-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="bg-gray-400 flex flex-col w-3xs h-96 m-4 border rounded-sm p-3">
      <p className="border-2">Messages</p>
      <div className="overflow-scroll border-2 flex-1">
        {messages.map((message, index) => (
          <div className="text-sm my-2 ">
            <div className="font-semibold">
              <span className="mr-2">{formattedTime(message.createdAt)}</span>
              <span>{usersMap[message.who]} </span>
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
