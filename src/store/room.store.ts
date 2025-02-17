import { create } from "zustand";
import { supabase } from "../api/supabase";
import { Database } from "../types/supabase";
import { Room } from "../types/types";

type RoomState = {
  room: Room | null;
  setRoom: (room: Room | null) => void;
};

const useRoomStore = create<RoomState>()((set) => ({
  room: null,
  setRoom: (room: Room | null) => set({ room }),
}));

const useRoom = () => {
  const { room, setRoom } = useRoomStore();

  const updateRoom = async (
    updatedRoom: Database["public"]["Tables"]["rooms"]["Update"],
  ) => {
    if (!room) return;

    const { data, error } = await supabase
      .from("rooms")
      .update(updatedRoom)
      .eq("id", room.id)
      .select();

    if (error) {
      console.error("Error updating room:", error);
      return;
    }

    if (data && data.length > 0) {
      setRoom(data[0]);
    }
  };

  return {
    room,
    setRoom,
    updateRoom,
  };
};

export default useRoom;
