import { useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import { ToastPopUp } from "../../modules/Toast";

interface ChatInputProps {
  sendMessage: (text: string, userId: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ sendMessage }) => {
  const { user } = useAuth();
  const [text, setText] = useState<string>("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id)
      return ToastPopUp({ type: "error", message: "유저 정보가 없습니다." });
    else {
      sendMessage(text, user?.id);
      setText("");
    }
  };

  return (
    <form action="" onSubmit={submitHandler}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message..."
        className="border w-full rounded-sm"
      />
      <button type="submit" className="px-2 py-1 border rounded-sm">
        Send
      </button>
    </form>
  );
};

export default ChatInput;
