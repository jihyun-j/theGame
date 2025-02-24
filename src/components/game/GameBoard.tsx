import { DndContext, DragEndEvent } from "@dnd-kit/core";
import useGame from "../../hooks/game/useGame";
import GameBoardDummy from "./GameBoardDummy";
import DragCard from "./card/DragCard";

const GameBoard = () => {
  const { currentPlayer, dropBoardIdx, dropCard, handlePlay } = useGame();

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    const overId = over?.id as string;
    const activeId = active.id as string;
    if (over && overId.includes("droppable")) {
      // active.id는 "cardNumber-<숫자>" 형태로 가정합니다.
      const cardNumberStr = activeId.split("-")[1];
      const cardNumber = Number(cardNumberStr);
      const dropIdx = Number(overId.split("-")[1]);

      handlePlay(cardNumber, dropIdx);
    } else {
      console.log("Dropped outside a droppable target");
    }
  };

  return (
    <div className='inset-0 absolute'>
      <DndContext onDragEnd={handleDragEnd}>
        <div>
          <h2>카드 목록</h2>
          <h2>player name: {currentPlayer?.nickname}</h2>
          <ul style={{ display: "flex", gap: 30 }}>
            {currentPlayer?.cards.map((v) => (
              <DragCard cardNumber={v} key={`dragcard-${v}`} />
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
      </DndContext>
    </div>
  );
};

export default GameBoard;
