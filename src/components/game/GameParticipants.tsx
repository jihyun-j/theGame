import { useParams } from "react-router-dom";
import useRoom from "../../hooks/game/useRoom";

const GameParticipantList = () => {
  const { id } = useParams();
  const { participantNicknames } = useRoom(Number(id!));

  return (
    <article className='w-50 h-auto border-2 border-black p-5'>
      <h1>참가자 목록</h1>
      <div className='w-full h-2 border-t-2 border-black' />
      <ul>
        {participantNicknames?.map((v) => (
          <li>{v}</li>
        ))}
      </ul>
    </article>
  );
};

export default GameParticipantList;
