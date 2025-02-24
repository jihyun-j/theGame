import useGame from "../../hooks/game/useGame";
import GameBoardDummy from "./GameBoardDummy";

const GameBoard = () => {
  const { currentPlayer, dropBoardIdx, dropCard, handleDropCard } = useGame();

  return (
    <div className='inset-0 absolute'>
      <div>
        <h2>카드 목록</h2>
        <h2>player name: {currentPlayer?.nickname}</h2>
        <ul style={{ display: "flex", gap: 30 }}>
          {currentPlayer?.cards.map((v) => (
            <li
              onClick={handleDropCard(v)}
              style={{ width: 25, height: 25, border: "1px solid black" }}
              key={`card-${v}`}>
              {v}
            </li>
          ))}
        </ul>
      </div>
      <GameBoardDummy />
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "black",
        }}></div>
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "black",
        }}></div>
      <div>
        <p>낼 카드 번호 {dropCard}</p>
      </div>
      <div>
        <p>낼 보드 {dropBoardIdx}</p>
      </div>
      <div style={{ display: "flex", gap: "35px" }}></div>
    </div>
  );
};

export default GameBoard;
