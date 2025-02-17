import { Json } from "../../types/supabase";
import { Chat } from "../../types/types";

export const getNextChat = (
  prevChat: Json,
  newChat: Omit<Chat, "createdAt">,
) => {
  const prevChats: Chat[] = Array.isArray(prevChat) ? (prevChat as Chat[]) : [];

  return [...prevChats, { ...newChat, createdAt: new Date().toISOString() }];
};
