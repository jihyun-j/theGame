import { useDraggable } from "@dnd-kit/core";
import { cardClass } from "../../../css/game/card";
import useGame from "../../../hooks/game/useGame";

type Props = {
  cardNumber: number;
};

const DragCard = ({ cardNumber }: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `cardNumber-${cardNumber}`,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: 0.5,
      }
    : undefined;

  const { handleDropCard } = useGame();
  return (
    <li
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cardClass}
      onClick={handleDropCard(cardNumber)}
      style={style}
      key={`card-${cardNumber}`}>
      {cardNumber}
    </li>
  );
};

export default DragCard;
