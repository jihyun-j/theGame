import { useQuery } from "@tanstack/react-query";
import { ToastPopUp } from "../../modules/Toast";
import { supabase } from "../../api/supabase";

type Room = {
  id: number;
  roomTitle: string;
  gameStatue: object;
  updatedAt: string;
  chats: object[];
  startAt: string;
  participants: string[];
};

export default function useHome() {
  // 수파베이스에서 방 목록 가져오깅
  const getRooms = async (): Promise<Room[] | void> => {
    const { data, error } = await supabase.from("rooms").select("*");
    if (error) {
      return ToastPopUp({
        type: "error",
        message: "방 목록을 못 가져왔어요",
      });
    }
    return data;
  };

  const { data } = useQuery({
    queryKey: ["home", "get-room-list"],
    queryFn: () => {
      return getRooms();
    },
  });
  return { data, getRooms };
}
