import useGame from "../../hooks/game/useGame";
import { canTurnEnd } from "../../modules/Game";

const GameButtonWrapper = () => {
  const { gameState, handleStartGame, handlePlay, handleTurnEnd } = useGame();

  const showStartBtn = gameState === null;

  return (
    <div className='absolute bottom-2.5 right-2.5'>
      {gameState && (
        <>
          <button onClick={handlePlay}>제출</button>
          <button onClick={handleTurnEnd} disabled={!canTurnEnd(gameState!)}>
            턴넘기기
          </button>
        </>
      )}
      {showStartBtn && <button onClick={handleStartGame}>시작하기</button>}
    </div>
  );
};

export default GameButtonWrapper;
