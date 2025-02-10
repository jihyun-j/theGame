import { useNavigate, useParams } from "react-router-dom";
import ChatBox from "../../components/chat/ChatBox";
import GameParticipantList from "../../components/game/GameParticipants";
import GameRoom from "../../components/game/GameRoom";
import { ToastPopUp } from "../../modules/Toast";

export default function Game() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    ToastPopUp({ type: "error", message: "올바르지 않은 접근입니다" });
    navigate("/");
  }

  return (
    <div>
      <ChatBox roomId={Number(id)} />
      <GameRoom />
      <GameParticipantList />
    </div>
  );
}
