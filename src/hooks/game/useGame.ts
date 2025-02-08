import { useMutation, useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { supabase } from "../../api/supabase";
import { GameState } from "../../types/types";

const GAME_KEY = "game";

export const useGame = (roomId: string) => {
  const fetchGameState = async () => {
    const { data, error } = await supabase
      .from("rooms")
      .select("gameState")
      .eq("room", Number(roomId))
      .single();
    if (error) throw error;

    const gameState = data;

    return _.isString(gameState) ? JSON.parse(gameState) : gameState;
  };

  const updateGameStateWithSupabase = async (gameState: GameState) => {
    const { error } = await supabase
      .from("rooms")
      .update({ gameState: JSON.stringify(gameState) });

    if (error) throw error;
  };

  const { data: gameState, isLoading } = useQuery<GameState>({
    queryKey: [GAME_KEY],
    queryFn: fetchGameState,
  });

  const { mutate: updateGameState } = useMutation({
    mutationFn: updateGameStateWithSupabase,
    mutationKey: [GAME_KEY],
  });

  return { gameState, isLoading, updateGameState };
};
