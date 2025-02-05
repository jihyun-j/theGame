import React from "react";
import { useSetGlobalModal } from "../../store/store";

export default function GlobalModal() {
  const { component, closeModal } = useSetGlobalModal();

  if (!component) return;

  return (
    <React.Fragment>
      <div className="w-fit max-w-[36rem] h-fit max-h-[24rem] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-20">
        {component}
      </div>
      <div
        onClick={closeModal}
        className="w-dvw bg-[#00000090] h-dvh absolute inset-0 z-10"></div>
    </React.Fragment>
  );
}
