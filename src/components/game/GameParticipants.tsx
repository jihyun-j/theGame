import useGame from "../../hooks/game/useGame";

const GameParticipantList = () => {
  const { participants } = useGame();

  return (
    <article className='w-50 h-auto border-2 border-black p-5'>
      <h1>참가자 목록</h1>
      <div className='w-full h-2 border-t-2 border-black' />
      <ul>
        {participants?.map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
    </article>
  );
};

export default GameParticipantList;
