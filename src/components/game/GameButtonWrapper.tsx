import useGame from "../../hooks/game/useGame";

const GameButtonWrapper = () => {
  const { gameState, handleStartGame } = useGame();

  const showStartBtn = gameState === null;

  return (
    <div>
      {showStartBtn && <button onClick={handleStartGame}>시작하기</button>}
    </div>
  );
};

export default GameButtonWrapper;
