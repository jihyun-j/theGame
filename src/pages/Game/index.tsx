import { useParams } from "react-router-dom";
import ChatBox from "../../components/chat/ChatBox";
import Test from "../Test";

export default function Game() {
  const { id } = useParams();

  return (
    <div>
      <ChatBox roomId={Number(id)} />
      <Test />
    </div>
  );
}
