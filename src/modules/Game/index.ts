import { GameState, Player } from "../../types/types";
import { initDummy, popDummy } from "./deck";

export class Game {
  public gameState: GameState;

  constructor() {
    this.gameState = {
      board: [],
      curPlayerIdx: 0,
      dummy: [],
      players: [],
      curPlayerTimes: 0,
      state: "pending",
    };
  }

  get curPlayer() {
    const { players, curPlayerIdx } = this.gameState;
    return players[curPlayerIdx];
  }

  get playerCnt() {
    const { players } = this.gameState;
    return players.length;
  }

  get isEnd() {
    const { board } = this.gameState;
    const curPlayer = this.curPlayer;

    return !curPlayer.cards.some(
      (v) => board[0] < v || board[1] < v || board[2] > v || board[3] > v,
    );
  }

  get canTurnEnd() {
    const { curPlayerTimes, dummy } = this.gameState;
    if (dummy.length === 0) return curPlayerTimes >= 1;
    return curPlayerTimes >= 2;
  }

  get isFinish() {
    const { players } = this.gameState;

    return players.every((player) => player.cards.length === 0);
  }

  initGame(players: Player[]) {
    const gameState: GameState = this.gameState;
    const playerCnt = this.playerCnt;
    const CardCntPerPlayer = playerCnt >= 3 ? 6 : playerCnt >= 2 ? 7 : 8;

    gameState.players = [...players];

    gameState.board = [1, 1, 100, 100];

    gameState.dummy = initDummy();

    gameState.players.forEach((player) => {
      for (let i = 0; i < CardCntPerPlayer; i++) {
        const [card, newDummy] = popDummy(gameState.dummy);
        if (!card) return;
        gameState.dummy = newDummy;
        player.cards.push(card);
      }
    });
  }

  canDrop(card: number, boardIdx: number) {
    const { board } = this.gameState;

    if (boardIdx < 2) return board[boardIdx] < card;
    return board[boardIdx] > card;
  }

  play(card: number, boardIdx: number) {
    if (!this.canDrop(card, boardIdx)) throw new Error("drop-error");

    if (this.isEnd) {
      this.gameState.state = "lose";
      return;
    }

    if (this.isFinish) {
      this.gameState.state = "win";
      return;
    }

    let newGameState = this.dropCard(card, boardIdx);
    newGameState = this.drawCard();

    this.gameState = newGameState;
  }

  dropCard(card: number, boardIdx: number) {
    const curPlayer = this.curPlayer;
    const { board, players } = this.gameState;
    const newBoard = [...board];
    const newCards = curPlayer.cards.filter((c) => c !== card);
    const newPlayers = players.map((player) => {
      if (player.nickname === curPlayer.nickname)
        return { ...curPlayer, cards: newCards };
      return player;
    });

    newBoard[boardIdx] = card;

    return {
      ...this.gameState,
      board: newBoard,
      players: newPlayers,
    };
  }

  drawCard() {
    const { dummy, players } = this.gameState;

    const [card, newDummy] = popDummy(dummy);
    if (!card) return { ...this.gameState };

    const newPlayers = players.map((player) => {
      if (this.curPlayer.nickname === player.nickname)
        return {
          cards: [...this.curPlayer.cards, card],
          nickname: player.nickname,
        };
      return player;
    });

    return { ...this.gameState, dummy: newDummy, players: newPlayers };
  }

  turnEnd() {
    if (!this.canTurnEnd)
      return {
        ...this.gameState,
        curPlayerTimes: this.gameState.curPlayerTimes + 1,
      };
    return {
      ...this.gameState,
      curPlayerIdx: (this.gameState.curPlayerIdx + 1) % this.playerCnt,
      curPlayerTimes: 0,
    };
  }
}
