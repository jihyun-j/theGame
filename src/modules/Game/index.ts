import { GameState, Player } from "../../types/types";
import { initDummy, popDummy } from "./deck";

export function createInitialState(): GameState {
  return {
    board: [1, 1, 100, 100],
    curPlayerIdx: 0,
    dummy: initDummy(),
    players: [],
    curPlayerTimes: 0,
    state: "pending",
  };
}

export function initGame(players: Player[]): GameState {
  const dummy = initDummy();
  const playerCnt = players.length;
  const cardCountPerPlayer = playerCnt >= 3 ? 6 : playerCnt >= 2 ? 7 : 8;

  let currentDummy = dummy;

  const newPlayers = players.map((player) => {
    const [cards, updatedDummy] = drawCards(currentDummy, cardCountPerPlayer);
    currentDummy = updatedDummy;
    return { ...player, cards };
  });

  return {
    board: [1, 1, 100, 100],
    curPlayerIdx: 0,
    dummy: currentDummy,
    players: newPlayers,
    curPlayerTimes: 0,
    state: "pending",
  };
}

function drawCards(dummy: number[], count: number): [number[], number[]] {
  const cards: number[] = [];
  let currentDummy = dummy;

  for (let i = 0; i < count; i++) {
    const [card, newDummy] = popDummy(currentDummy);
    if (card === null) break;
    cards.push(card);
    currentDummy = newDummy;
  }
  return [cards, currentDummy];
}

export function curPlayer(state: GameState): Player {
  return state.players[state.curPlayerIdx];
}

export function playerCount(state: GameState): number {
  return state.players.length;
}

export function isEnd(state: GameState): boolean {
  const player = curPlayer(state);
  const board = state.board;
  return !player.cards.some(
    (card) =>
      board[0] < card || board[1] < card || board[2] > card || board[3] > card,
  );
}

export function canTurnEnd(state: GameState): boolean {
  return state.dummy.length === 0
    ? state.curPlayerTimes >= 1
    : state.curPlayerTimes >= 2;
}

export function isFinish(state: GameState): boolean {
  return state.players.every((player) => player.cards.length === 0);
}

export function canDrop(
  state: GameState,
  card: number,
  boardIdx: number,
): boolean {
  const board = state.board;
  const boardCard = board[boardIdx];
  const SPECIAL_DIFF = 10;

  const ascendCard = boardCard < card;
  const descendCard = boardCard > card;

  const ascendCard10 = boardCard - SPECIAL_DIFF === card;
  const descendCard10 = boardCard + SPECIAL_DIFF === card;

  if (boardIdx < 2) {
    return ascendCard || ascendCard10;
  }
  return descendCard || descendCard10;
}

export function dropCard(
  state: GameState,
  card: number,
  boardIdx: number,
): GameState {
  const player = curPlayer(state);
  const newCards = player.cards.filter((c) => c !== card);
  const newPlayers = state.players.map((p) =>
    p.nickname === player.nickname ? { ...p, cards: newCards } : p,
  );
  const newBoard = [...state.board];
  newBoard[boardIdx] = card;
  return {
    ...state,
    board: newBoard,
    players: newPlayers,
    curPlayerTimes: state.curPlayerTimes + 1,
  };
}

export function drawCard(state: GameState): GameState {
  const [card, newDummy] = popDummy(state.dummy);
  if (card === null) return state;
  const player = curPlayer(state);
  const newPlayers = state.players.map((p) =>
    p.nickname === player.nickname ? { ...p, cards: [...p.cards, card] } : p,
  );
  return { ...state, dummy: newDummy, players: newPlayers };
}

export function play(
  state: GameState,
  card: number,
  boardIdx: number,
): GameState {
  if (!canDrop(state, card, boardIdx)) {
    throw new Error("drop-error");
  }
  if (isEnd(state)) {
    return { ...state, state: "lose" };
  }
  if (isFinish(state)) {
    return { ...state, state: "win" };
  }
  const stateAfterDrop = dropCard(state, card, boardIdx);
  const stateAfterDraw = drawCard(stateAfterDrop);
  return stateAfterDraw;
}

export function turnEnd(state: GameState): GameState {
  if (!canTurnEnd(state)) {
    return { ...state };
  }
  return {
    ...state,
    curPlayerIdx: (state.curPlayerIdx + 1) % playerCount(state),
    curPlayerTimes: 0,
  };
}
