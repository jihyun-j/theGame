import _ from "lodash";
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
    const { board, curPlayerIdx, dummy, players } = this.gameState;
    if (!this.canDrop(card, boardIdx)) throw new Error("drop-error");

    const newGameState = _.cloneDeep(this.gameState);
    const curPlayer = this.curPlayer;

    if (this.isEnd) {
      this.gameState.state = "lose";
      return;
    }

    if (this.isFinish) {
      this.gameState.state = "win";
      return;
    }

    // 카드 내기
    if (dummy.length === 0) {
    } else {
    }

    newGameState.curPlayerIdx = (curPlayerIdx + 1) % this.playerCnt;
    this.gameState = newGameState;
  }
}
