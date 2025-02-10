import { useNavigate } from "react-router-dom";
import CreateRoomForm from "../../components/creatRoomForm/CreateRoomForm";
import InviteRoomModal from "../../components/invite/InviteModal";
import useHome from "../../hooks/Home/useHome";
import { useSetGlobalModal } from "../../store/store";

export default function Home() {
  const { setModal } = useSetGlobalModal();
  const { data: roomList } = useHome();

  // 지현추가 시작
  const navigate = useNavigate();

  return (
    <div className='relative '>
      <table className='table-fixed w-full border-1 border-y-slate-600'>
        <thead className='font-extrabold'>
          <tr>
            <td className='border-1 border-y-slate-600 text-center py-0.5'>
              방 제목
            </td>
            <td className='border-1 border-y-slate-600 text-center py-0.5'>
              참여 인원
            </td>
            <td className='border-1 border-y-slate-600 text-center py-0.5'>
              생성 시간
            </td>
          </tr>
        </thead>
        <tbody>
          {roomList?.map((room) => {
            return (
              <tr>
                <td className='border-1 border-y-slate-600 text-center py-1'>
                  {room?.roomTitle}
                </td>
                <td className='border-1 border-y-slate-600 text-center py-1'>
                  {room?.participant?.length || 0} 명
                </td>
                <td className='border-1 border-y-slate-600 text-center py-1'>
                  {`${room?.startAt?.split("T")[0]} - ${String(
                    room?.startAt?.split("T")[1],
                  ).slice(0, 8)}`}
                </td>
                {/* 지현추가 시작*/}
                <td className='border-1 border-y-slate-600 text-center py-1'>
                  <button
                    className='cursor-pointer bg-blue-500 text-white px-2 py-1 rounded-sm'
                    onClick={() => {
                      setModal(<InviteRoomModal roomId={room.id} />);
                    }}>
                    입장
                  </button>
                </td>
                {/* 지현추가 끝*/}
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={() => {
          setModal(<CreateRoomForm />);
        }}
        className='min-w-[9rem] py-1 rounded-[.6rem] bg-amber-500 text-slate-50 cursor-pointer hover:bg-amber-700 hover:text-amber-300 fixed bottom-3.5 left-3.5'>
        방 만들기
      </button>
      <button
        onClick={() => {
          setModal(<InviteRoomModal />);
        }}
        className='min-w-[9rem] py-1 rounded-[.6rem] bg-amber-500 text-slate-50 cursor-pointer hover:bg-amber-700 hover:text-amber-300 fixed bottom-3.5 left-45'>
        초대코드 입력
      </button>
    </div>
  );
}
