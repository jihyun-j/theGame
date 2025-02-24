import { useNavigate, useParams } from "react-router-dom";
import ChatBox from "../../components/chat/ChatBox";
import GameParticipantList from "../../components/game/GameParticipants";
import GameRoom from "../../components/game/GameRoom";
import useAccessGame from "../../hooks/game/useAccessGame";
import { GameProvider } from "../../hooks/game/useGame";
import useRoomChannel from "../../hooks/game/useRoomChannel";
import { ToastPopUp } from "../../modules/Toast";

export default function Game() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: room, exitRoom, handleShare } = useAccessGame();

  if (!id) {
    ToastPopUp({ type: "error", message: "올바르지 않은 접근입니다" });
    navigate("/");
  }
  useRoomChannel(id!);

  return (
    <GameProvider>
      <div className='h-full'>
        <button
          id={room ? String(room?.share_uuid) : ""}
          onClick={handleShare}
          className='w-[12rem] py-1 rounded-[.6rem] bg-amber-300 cursor-pointer'>
          공유하기
        </button>
        <button
          onClick={exitRoom}
          className='w-[12rem] py-1 rounded-[.6rem] bg-amber-700 text-white cursor-pointer'>
          퇴장하기
        </button>
        <ChatBox roomId={Number(id)} />
        <GameRoom />
        <GameParticipantList />
      </div>
    </GameProvider>
  );
}
