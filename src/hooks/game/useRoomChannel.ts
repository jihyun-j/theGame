import { useEffect } from "react";
import { supabase } from "../../api/supabase";
import { fetchRoom } from "../../modules/Supabase/room";
import useRoom from "../../store/room.store";
import { Room } from "../../types/types";

export const ROOM_KEY = "room";

// Room 최상단에서 불려야 함

const useRoomChannel = (roomId: string) => {
  const { setRoom } = useRoom();

  useEffect(() => {
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
        async (payload) => {
          const room = payload.new as Room;
          setRoom(room);
        },
      )
      .subscribe();

    const getRoom = async () => {
      const { data: room } = await fetchRoom(roomId);
      setRoom(room);
    };

    getRoom();

    return () => {
      supabase.removeChannel(subscription);
      setRoom(null);
    };
  }, []);
};

export default useRoomChannel;
