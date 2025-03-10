import type { Database } from "./supabase";
export type User = {
  id: string;
  nickname: string;
  password: string;
  room?: number | null;
};

export type Room = Database["public"]["Tables"]["rooms"]["Row"];

export type GameState = {
  board: number[];
  dummy: number[];
  players: Player[];
  curPlayerIdx: number;
  curPlayerTimes: number;
  state: "win" | "lose" | "pending";
};

export type Chat = {
  msg: string;
  who: string;
  createdAt: string;
};

export type Player = {
  nickname: string;
  cards: number[];
};
