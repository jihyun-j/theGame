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
  if (playerCnt === 0) throw new Error("player not exists");
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

export function getCurPlayer(state: GameState): Player {
  return state.players[state.curPlayerIdx];
}

export function getPlayerCount(state: GameState): number {
  return state.players.length;
}

export function isEnd(state: GameState): boolean {
  const player = getCurPlayer(state);

  return !player.cards.some((card) =>
    [0, 1, 2, 3].some((boardIdx) => canDrop(state, card, boardIdx) === null),
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

export function canDrop(state: GameState, card: number, boardIdx: number) {
  const board = state.board;
  const boardCard = board[boardIdx];
  const player = getCurPlayer(state);
  if (player.cards.indexOf(card) === -1)
    return "해당 카드가 존재하지 않습니다.";
  const SPECIAL_DIFF = 10;

  const ascendCard = boardCard < card;
  const descendCard = boardCard > card;

  const ascendCard10 = boardCard - SPECIAL_DIFF === card;
  const descendCard10 = boardCard + SPECIAL_DIFF === card;

  if (boardIdx < 2) {
    return ascendCard || ascendCard10
      ? null
      : "해당 카드를 내려놓을 수 없습니다.";
  }
  return descendCard || descendCard10
    ? null
    : "해당 카드를 내려놓을 수 없습니다.";
}

export function dropCard(
  state: GameState,
  card: number,
  boardIdx: number,
): GameState {
  const player = getCurPlayer(state);
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
  const player = getCurPlayer(state);
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
  const err = canDrop(state, card, boardIdx);
  if (err) throw new Error(err);

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
    curPlayerIdx: (state.curPlayerIdx + 1) % getPlayerCount(state),
    curPlayerTimes: 0,
  };
}
