import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";

export const ROOM_KEY = "room";

const useRoom = (roomId: number) => {
  const fetchRoomParticipant = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("participant")
      .eq("id", roomId)
      .single();

    if (error) throw error;
    if (!data || !data.participant || data.participant.length === 0) return [];

    const { data: nicknames, error: getNicknameError } = await supabase
      .from("users")
      .select("nickname")
      .in("nickname", data.participant);

    if (getNicknameError) throw getNicknameError;

    return nicknames.map((v) => v.nickname);
  };

  const { data: participantNicknames } = useQuery({
    queryKey: [ROOM_KEY],
    queryFn: fetchRoomParticipant,
  });

  return { participantNicknames };
};

export default useRoom;
