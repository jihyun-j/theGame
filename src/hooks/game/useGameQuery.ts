import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { supabase } from "../../api/supabase";
import { GameState } from "../../types/types";

const GAME_KEY = "game";

/* 
  game state를 확인하기 위해 tanstack query 함수들을 모와둔 hook
 */
const useGameQuery = (roomId: number) => {
  const fetchGameState = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("gameState")
      .eq("id", roomId)
      .single();

    if (error) throw error;

    const gameState = data.gameState;

    return _.isString(gameState) ? JSON.parse(gameState) : gameState;
  };

  const updateGameStateWithSupabase = async (gameState: GameState) => {
    const { error } = await supabase
      .from("rooms")
      .update({ gameState: JSON.stringify(gameState) });

    if (error) throw error;
  };

  const {
    data: gameState,
    isLoading,
    error: getGameStateError,
  } = useQuery<GameState>({
    queryKey: [GAME_KEY],
    queryFn: fetchGameState,
  });

  const { mutate: updateGameState } = useMutation({
    mutationFn: updateGameStateWithSupabase,
    mutationKey: [GAME_KEY],
  });

  return { gameState, isLoading, updateGameState, getGameStateError };
};

export default useGameQuery;
