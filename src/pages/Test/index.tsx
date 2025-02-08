import { useEffect, useState } from "react";
import {
  canTurnEnd,
  getCurPlayer,
  initGame,
  play,
  turnEnd,
} from "../../modules/Game";
import { ToastPopUp } from "../../modules/Toast";
import { GameState } from "../../types/types";

const Test = () => {
  const players = Array.from({ length: 5 }, (_, i) => ({
    cards: [],
    nickname: i.toString(),
  }));
  const [game, setGame] = useState<GameState>(initGame(players));

  const currentPlayer = getCurPlayer(game);
  const [dropCard, setDropCard] = useState(-1);
  const [dropBoardIdx, setDropIdx] = useState(-1);

  const handlePlay = () => {
    if (dropCard === -1 || dropBoardIdx === -1) return;

    try {
      setGame(play(game, Number(dropCard), Number(dropBoardIdx)));
    } catch (err: unknown) {
      const error = err as Error;
      ToastPopUp({
        type: "error",
        message: error.message,
      });
    }
  };

  const handleTurnEnd = () => {
    setGame(turnEnd(game));
  };

  const handleDropCard = (card: number) => {
    return () => {
      setDropCard(card);
    };
  };

  const handleDropIdx = (idx: number) => {
    return () => {
      setDropIdx(idx);
    };
  };

  useEffect(() => {
    console.log(game);
  }, [game]);

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
          {game.board.map((v, i) => (
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
        <button onClick={handleTurnEnd} disabled={!canTurnEnd(game)}>
          턴넘기기
        </button>
      </div>
    </div>
  );
};

export default Test;
