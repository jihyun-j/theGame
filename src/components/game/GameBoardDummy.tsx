import useGame from "../../hooks/game/useGame";
import DropCard from "./card/DropCard";

const GameBoardDummy = () => {
  const { gameState } = useGame();

  return (
    <div className=''>
      <h2>보드 게임 카드 목록</h2>
      <ul className='grid grid-cols-2 grid-rows-2 gap-30'>
        {gameState!.board.map((v, i) => (
          <DropCard idx={i} cardNumber={v} />
        ))}
      </ul>
    </div>
  );
};

export default GameBoardDummy;
