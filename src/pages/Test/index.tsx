import { ChangeEvent, useEffect, useState } from "react";
import {
  canTurnEnd,
  getCurPlayer,
  initGame,
  play,
  turnEnd,
} from "../../modules/Game";
import { ToastPopUp } from "../../modules/Toast";
import { GameState } from "../../types/types";
const useInput = (): [string, (e: ChangeEvent<HTMLInputElement>) => void] => {
  const [value, setValue] = useState<string>("");
  const handler = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return [value, handler];
};

const Test = () => {
  const players = Array.from({ length: 5 }, (_, i) => ({
    cards: [],
    nickname: i.toString(),
  }));
  const [game, setGame] = useState<GameState>(initGame(players));

  const currentPlayer = getCurPlayer(game);
  const [dropCard, handleDropCard] = useInput();
  const [dropBoardIdx, handleDropIdx] = useInput();

  const handlePlay = () => {
    if (!dropCard || !dropBoardIdx) return;

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

  useEffect(() => {
    console.log(game);
  }, [game]);

  return (
    <div>
      <div>
        <h2>카드 목록</h2>
        <h2>player name: {currentPlayer.nickname}</h2>
        <ul>
          {currentPlayer.cards.map((v) => (
            <li key={`card-${v}`}>{v}</li>
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
        <ul>
          {game.board.map((v, i) => (
            <li key={`board-${v + i}`}>{v}</li>
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
        <p>낼 카드 번호</p>
        <input value={dropCard} onChange={handleDropCard} />
      </div>
      <div>
        <p>낼 보드</p>
        <input value={dropBoardIdx} onChange={handleDropIdx} />
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
