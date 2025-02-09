import { useParams } from "react-router-dom";
import useGame from "../../hooks/game/useGame";
import GameBoard from "./GameBoard";
import GameButtonWrapper from "./GameButtonWrapper";
import NoGameState from "./NoGameState";

const GameRoom = () => {
  const { id } = useParams();
  const { isLoading, gameState } = useGame(Number(id));

  return (
    <div>
      {isLoading && <div>Loading</div>}
      {gameState === null && <NoGameState />}
      {gameState && <GameBoard />}
      <GameButtonWrapper />
    </div>
  );
};

export default GameRoom;
