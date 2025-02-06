import { useState } from "react";

interface ChatInputProps {
  sendMessage: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ sendMessage }) => {
  const [text, setText] = useState<string>("");

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(text);
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
