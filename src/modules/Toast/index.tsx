import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ToastProps {
  type: "success" | "error" | "info" | "action";
  message?: string;
}

const toastOptions: ToastOptions = {
  position: "bottom-center",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  pauseOnFocusLoss: false,
  closeButton: false,
};

/**
 * 토스트 팝업 트리거 (타입, 메세지)
 * @param type(success, error, ...)
 * @param message(표기 될 메세지)
 * @constructor
 */
export const ToastPopUp = ({ type, message }: ToastProps) => {
  switch (type) {
    case "success":
      toast.success(message || "성공적으로 완료되었습니다", {
        ...toastOptions,
        position: "bottom-right",
        theme: "dark",
        // bodyStyle: { background: '#343a40'}
        // icon: TOAST.SUCCESS,
      });
      return;
    case "error":
      toast.error(message || "다시 한번 시도해주세요", {
        ...toastOptions,
        position: "bottom-right",
        theme: "dark",
        // icon: TOAST.ERROR,
      });
      return;
    case "info":
      toast.error(message || "", {
        ...toastOptions,
        position: "bottom-right",
        theme: "dark",
        // icon: TOAST.ERROR,
      });
  }
};

const Toast = () => {
  return <ToastContainer className={"z-10 w-[30rem]"} />;
};

export default Toast;
