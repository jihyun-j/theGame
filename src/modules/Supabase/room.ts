import { supabase } from "../../api/supabase";

export const fetchRoom = async (roomId: string) => {
  return await supabase
    .from("rooms")
    .select("*")
    .eq("id", Number(roomId))
    .single();
};
