export type User = {
  nickname: string;
  room?: number;
};

export type Room = {
  id: number;
  gameState?: GameState;
  updatedAt: string;
  startAt?: string;
  chats?: Chat[];
};

export type GameState = {
  board: number[];
  dummy: number[];
  players: Player[];
  curPlayerIdx: number;
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
