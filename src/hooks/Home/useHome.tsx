import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";
import { ToastPopUp } from "../../modules/Toast";
import { Database } from "../../types/supabase";

export default function useHome() {
  // 수파베이스에서 방 목록 가져오깅
  const getRooms = async () => {
    const { data, error } = await supabase.from("rooms").select("*");
    if (error) {
      return ToastPopUp({
        type: "error",
        message: "방 목록을 못 가져왔어요",
      });
    }
    return data;
  };

  const updateRoomWithSupabase = async ({
    roomId,
    updateRoom,
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

  const { data } = useQuery({
    queryKey: ["home", "get-room-list"],
    queryFn: () => {
      return getRooms();
    },
  });

  const { mutate: updateRoom } = useMutation({
    mutationKey: ["home", "patch-room"],
    mutationFn: updateRoomWithSupabase,
  });
  return { data, getRooms, updateRoom };
}
