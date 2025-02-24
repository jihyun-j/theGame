import { useDroppable } from "@dnd-kit/core";
import { cardClass } from "../../../css/game/card";
import useGame from "../../../hooks/game/useGame";

type Props = {
  idx: number;
  cardNumber: number;
};

const DropCard = ({ idx, cardNumber }: Props) => {
  const { setNodeRef } = useDroppable({
    id: "droppable",
  });

  const { handleDropIdx } = useGame();

  return (
    <div ref={setNodeRef}>
      <li
        className={cardClass}
        onClick={handleDropIdx(idx)}
        key={`board-${cardNumber + idx}`}>
        {cardNumber}
      </li>
    </div>
  );
};

export default DropCard;
