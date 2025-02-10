import { useState } from "react";
import { useAuth } from "../../provider/AuthProvider";
import { ToastPopUp } from "../../modules/Toast";

interface ChatInputProps {
  sendMessage: (text: string, userId: string) => void;
}

const numberMap = {
  // 한국어 숫자
  영: 0,
  일: 1,
  이: 2,
  삼: 3,
  사: 4,
  오: 5,
  육: 6,
  칠: 7,
  팔: 8,
  구: 9,
  십: 10,
  백: 100,
  천: 1000,
  만: 10000,

  // 영어 숫자
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  hundred: 100,
  thousand: 1000,
};

const ChatInput: React.FC<ChatInputProps> = ({ sendMessage }) => {
  const { user } = useAuth();
  const [text, setText] = useState<string>("");

  // text에서 띄어쓰기와 특수 문자 제거
  const cleanText = (txt: string) => {
    return txt.replace(/[\s_\-]+/g, "");
  };

  // 영어로 된 숫자 차단
  const containNumberCharacters = (txt: string) => {
    const cleanTxt = cleanText(txt.toLowerCase() || txt.toUpperCase()); // 영어 대소문자로 된 숫자 차단 (one, ONE 모두 차단)

    for (const key in numberMap) {
      if (cleanTxt.includes(key)) {
        return true;
      }
    }
    return false;
  };

  // 숫자 차단
  const blockNumbers = (txt: string) => {
    const cleanMsg = cleanText(txt);

    // 숫자 자체 차단
    if (/\d+/.test(cleanMsg)) {
      return txt.replace(txt, "게임 규칙에 위반된 메세지 입니다.");
    }

    // 문자로된 숫자 차단
    if (containNumberCharacters(cleanMsg)) {
      return cleanMsg.replace(cleanMsg, "게임 규칙에 위반된 메세지 입니다.");
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id)
      return ToastPopUp({ type: "error", message: "유저 정보가 없습니다." });
    else {
      const filteredMsg = blockNumbers(text);
      sendMessage(filteredMsg || text, user?.id);
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
