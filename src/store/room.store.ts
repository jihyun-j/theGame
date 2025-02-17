import { create } from "zustand";
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

  return {
    room,
    setRoom,
  };
};

export default useRoom;
