import { useParams } from "react-router-dom";
import useGame from "../../hooks/game/useGame";

const GameButtonWrapper = () => {
  const { id } = useParams();
  const { gameState, handleStartGame } = useGame(Number(id));

  const showStartBtn = gameState === null;

  return (
    <div>
      {showStartBtn && <button onClick={handleStartGame}>시작하기</button>}
    </div>
  );
};

export default GameButtonWrapper;
