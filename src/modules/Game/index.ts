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
    };
  }

  initGame(players: Player[]) {
    const gameState: GameState = this.gameState;
    const playerCnt = players.length;
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
}
