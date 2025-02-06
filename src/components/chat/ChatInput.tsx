import { useState } from "react";

interface ChatInputProps {
  sendMessage: (text: string, userId: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ sendMessage }) => {
  const [text, setText] = useState<string>("");
  const userId = "b257aec3-d2b3-4093-b9b2-4f8d8b128c2b";

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(text, userId);
    setText("");
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
