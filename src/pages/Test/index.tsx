import { Game } from "../../modules/Game";

const Test = () => {
  const game = new Game();

  game.initGame(
    Array.from({ length: 5 }, (_, i) => ({
      cards: [],
      nickname: i.toString(),
    })),
  );

  console.log(game.gameState);
  return <div></div>;
};

export default Test;
