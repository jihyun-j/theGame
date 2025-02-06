import ChatInput from "./ChatInput";

const ChatBox = () => {
  return (
    <div>
      <p>Room Name</p>
      {/* 유저이름, 메세지 보낸 시간/날짜, 메세지 내용 */}
      <ChatInput />
    </div>
  );
};

export default ChatBox;
