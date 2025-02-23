import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabase";
import { ToastPopUp } from "../../modules/Toast";
import { useAuth } from "../../provider/AuthProvider";

export default function useHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  // 수파베이스에서 방 목록 가져오깅
  const getRooms = async () => {
    const { data, error } = await supabase.from("rooms").select("*");
    if (error) {
      return ToastPopUp({
        type: "error",
        message: "방 목록을 못 가져왔어요",
      });
    }
    return data;
  };

  const { data } = useQuery({
    queryKey: ["home", "get-room-list"],
    queryFn: () => {
      return getRooms();
    },
  });

  // 내가 참여하고 있는 방 확인
  const getRoom = async () => {
    const userId = user?.id;
    if (!userId) return Promise.reject(null);

    const { data, error } = await supabase
      .from("rooms")
      .select()
      .contains("participant", [userId])
      .single();

    console.log("get Room", data);
    if (error) return Promise.reject(error);

    return data;
  };

  useEffect(() => {
    getRoom()
      .then((res) => {
        navigate(`/game/${res.id}`);
      })
      .catch(() => console.log("not found"));
  }, []);

  return { data, getRooms, getRoom };
}
