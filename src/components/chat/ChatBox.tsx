import { supabase } from "../../api/supabase";
import { getNextChat } from "../../modules/Chat/chat";
import useRoom from "../../store/room.store";
import { Chat } from "../../types/types";
import ChatInput from "./ChatInput";

interface ChatboxProps {
  roomId: number;
}

const ChatBox: React.FC<ChatboxProps> = ({ roomId }) => {
  const { room } = useRoom();
  const messages = room?.chats as Chat[];

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

  return (
    <div className='grid grid-rows-3 w-3xs h-96 m-4 border rounded-sm p-3'>
      <p>Room Name</p>
      <div className='overflow-scroll'>
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
