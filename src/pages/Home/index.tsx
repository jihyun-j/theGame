import { ToastPopUp } from "../../modules/Toast";

export default function Home() {
  const test = () => {
    ToastPopUp({
      type: "info",
      message: "테스트 입니다,.",
    });
  };

  return (
    <div>
      <button onClick={test}>click</button>
    </div>
  );
}
