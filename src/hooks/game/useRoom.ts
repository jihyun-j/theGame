import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../api/supabase";

export const ROOM_KEY = "room";

const useRoom = (roomId: number) => {
  // TODO: 내가 참여한 사람인지 아닌지 확인하고 그에 따른 처리를 해야 함
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
      .in("id", data.participant);

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
