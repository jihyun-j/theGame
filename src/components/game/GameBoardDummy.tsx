import { cardClass } from "../../css/game/card";
import useGame from "../../hooks/game/useGame";

const GameBoardDummy = () => {
  const { gameState, handleDropIdx } = useGame();

  return (
    <div className=''>
      <h2>보드 게임 카드 목록</h2>
      <ul className='grid grid-cols-2 grid-rows-2 gap-30'>
        {gameState!.board.map((v, i) => (
          <li
            className={cardClass}
            onClick={handleDropIdx(i)}
            key={`board-${v + i}`}>
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameBoardDummy;
