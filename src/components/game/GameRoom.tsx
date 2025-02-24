import useGame from "../../hooks/game/useGame";
import GameBoard from "./GameBoard";
import GameButtonWrapper from "./GameButtonWrapper";
import NoGameState from "./NoGameState";

const GameRoom = () => {
  const { isLoading, gameState } = useGame();

  return (
    <div className='absolute inset-0 p-15 flex justify-center items-center'>
      {isLoading && <div>Loading</div>}
      {gameState === null && <NoGameState />}
      {gameState && <GameBoard />}
      <GameButtonWrapper />
    </div>
  );
};

export default GameRoom;
