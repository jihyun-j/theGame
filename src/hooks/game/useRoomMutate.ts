import { useMutation } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";
import { Database } from "../../types/supabase";

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

  return { updateRoom };
};

export default useRoomMutate;
