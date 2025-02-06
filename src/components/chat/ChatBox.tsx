import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import { supabase } from "../../api/supabase";
import { useAuth } from "../../provider/AuthProvider";

interface ChatboxProps {
  roomId: number;
}

interface Chats {
  userId: string;
  messages: string;
  createdAt: Date;
}

const ChatBox: React.FC<ChatboxProps> = ({ roomId }) => {
  const { user } = useAuth();
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<Chats[]>([]);

  // 방에 입장 했을 때, 메세지 가져오기
  const fetchMessage = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("chats")
      .eq("id", roomId)
      .single();

    if (!error && data.chats) {
      setMessages(data.chats);
    }
  };

  // 메세지 보내기
  const sendMessageHandler = async (text: string, userId: string) => {
    if (!text.trim()) return;

    // 새로운 메세지
    const newMessage = {
      userId: userId,
      messages: text,
      createdAt: new Date(),
    };

    const { data } = await supabase
      .from("rooms")
      .select("chats")
      .eq("id", roomId)
      .single();

    const updatedChats = [...(data?.chats || []), newMessage];

    await supabase
      .from("rooms")
      .update({ chats: updatedChats })
      .eq("id", roomId);
  };

  useEffect(() => {
    fetchMessage();

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

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div className="grid grid-rows-3 w-3xs h-96 m-4 border rounded-sm p-3">
      <p>Room Name</p>
      <div className="overflow-scroll">
        {messages.map((message, index) =>
          message.userId === user?.id ? (
            <p className="text-right" key={index}>
              {message.messages}
            </p>
          ) : (
            <p className="text-left" key={index}>
              {message.messages}
            </p>
          )
        )}
        <div className="h-[0.1rem]" ref={messageEndRef}></div>
      </div>

      <div>
        <ChatInput sendMessage={sendMessageHandler} />
      </div>
    </div>
  );
};

export default ChatBox;
