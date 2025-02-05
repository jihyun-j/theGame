import CreateRoomForm from "../../components/creatRoomForm/CreateRoomForm";
import { useSetGlobalModal } from "../../store/store";
import useHome from "../../hooks/Home/useHome";

export default function Home() {
  const { setModal } = useSetGlobalModal();
  const { data: roomList } = useHome();

  return (
    <div className="relative ">
      <table className="table-fixed w-full border-1 border-y-slate-600">
        <thead className="font-extrabold">
          <tr>
            <td className="border-1 border-y-slate-600 text-center py-0.5">
              방 제목
            </td>
            <td className="border-1 border-y-slate-600 text-center py-0.5">
              참여 인원
            </td>
            <td className="border-1 border-y-slate-600 text-center py-0.5">
              생성 시간
            </td>
          </tr>
        </thead>
        <tbody>
          {roomList?.map((room) => {
            return (
              <tr>
                <td className="border-1 border-y-slate-600 text-center py-1">
                  {room?.roomTitle}
                </td>
                <td className="border-1 border-y-slate-600 text-center py-1">
                  {room?.participants?.length || 0} 명
                </td>
                <td className="border-1 border-y-slate-600 text-center py-1">
                  {`${room?.startAt.split("T")[0]} - ${String(
                    room?.startAt.split("T")[1]
                  ).slice(0, 8)}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={() => {
          setModal(<CreateRoomForm />);
        }}
        className="min-w-[9rem] py-1 rounded-[.6rem] bg-amber-500 text-slate-50 cursor-pointer hover:bg-amber-700 hover:text-amber-300 fixed bottom-3.5 left-3.5">
        방 만들기
      </button>
    </div>
  );
}
