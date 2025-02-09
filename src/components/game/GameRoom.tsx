import { useParams } from "react-router-dom";
import useGame from "../../hooks/game/useGame";
import { canTurnEnd } from "../../modules/Game";

const GameRoom = () => {
  const { id } = useParams();

  const {
    currentPlayer,
    gameState,
    isLoading,
    dropBoardIdx,
    dropCard,
    handleDropCard,
    handleDropIdx,
    handlePlay,
    handleStartGame,
    handleTurnEnd,
  } = useGame(Number(id!));

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <div>
        <h2>카드 목록</h2>
        <h2>player name: {currentPlayer.nickname}</h2>
        <ul style={{ display: "flex", gap: 30 }}>
          {currentPlayer.cards.map((v) => (
            <li
              onClick={handleDropCard(v)}
              style={{ width: 25, height: 25, border: "1px solid black" }}
              key={`card-${v}`}>
              {v}
            </li>
          ))}
        </ul>
      </div>
      <div
        style={{
          width: "100%",
          height: "1px",
          backgroundColor: "black",
        }}></div>
      <div>
        <h2>보드 게임 카드 목록</h2>
        <ul style={{ display: "flex", gap: 30 }}>
          {gameState!.board.map((v, i) => (
            <li
              onClick={handleDropIdx(i)}
              style={{ width: 25, height: 25, border: "1px solid black" }}
              key={`board-${v + i}`}>
              {v}
            </li>
          ))}
        </ul>
      </div>
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
      <div style={{ display: "flex", gap: "35px" }}>
        <button onClick={handlePlay}>제출</button>
        <button onClick={handleTurnEnd} disabled={!canTurnEnd(gameState!)}>
          턴넘기기
        </button>
        {!gameState && <button onClick={handleStartGame}>게임시작</button>}
      </div>
    </div>
  );
};

export default GameRoom;
