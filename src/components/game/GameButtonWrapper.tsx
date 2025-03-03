import { button } from "../../css/button";
import useGame from "../../hooks/game/useGame";
import { canTurnEnd } from "../../modules/Game";

const GameButtonWrapper = () => {
  const { gameState, handleStartGame, handleTurnEnd } = useGame();

  const showStartBtn = gameState === null;

  return (
    <div className='absolute bottom-2.5 right-2.5'>
      {gameState && (
        <>
          <button
            className={button("bg-red-500")}
            onClick={handleTurnEnd}
            disabled={!canTurnEnd(gameState!)}>
            턴넘기기
          </button>
        </>
      )}
      {showStartBtn && (
        <button className={button("bg-blue-300")} onClick={handleStartGame}>
          시작하기
        </button>
      )}
    </div>
  );
};

export default GameButtonWrapper;
