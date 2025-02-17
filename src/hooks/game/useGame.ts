import { PostgrestError } from "@supabase/supabase-js";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurPlayer, initGame, play, turnEnd } from "../../modules/Game";
import { getError } from "../../modules/Game/error";
import { ToastPopUp } from "../../modules/Toast";
import useRoom from "../../store/room.store";
import useGameQuery from "./useGameQuery";

const useGame = () => {
  const { id } = useParams();
  const roomId = Number(id!);
  const [dropCard, setDropCard] = useState(-1);
  const [dropBoardIdx, setDropIdx] = useState(-1);

  const { room } = useRoom();
  const navigate = useNavigate();
  const { gameState, updateGameState, isLoading, getGameStateError } =
    useGameQuery(roomId);

  const participants = room?.participant;

  if (getGameStateError) {
    const errMessage = getError(getGameStateError as PostgrestError);
    ToastPopUp({ type: "error", message: errMessage });
    navigate("/");
  }

  const currentPlayer = gameState ? getCurPlayer(gameState!) : null;

  const handlePlay = (dropCard: number, dropBoardIdx: number) => {
    if (dropCard === -1 || dropBoardIdx === -1) return;

    try {
      updateGameState(play(gameState!, Number(dropCard), Number(dropBoardIdx)));
    } catch (err: unknown) {
      const error = err as Error;
      ToastPopUp({
        type: "error",
        message: error.message,
      });
    }
  };

  const handleTurnEnd = () => {
    updateGameState(turnEnd(gameState!));
  };

  const handleDropCard = (card: number) => {
    return () => {
      setDropCard(card);
    };
  };

  const handleDropIdx = (idx: number) => {
    return () => {
      setDropIdx(idx);
    };
  };

  const handleStartGame = () => {
    updateGameState(
      initGame(participants?.map((nickname) => ({ nickname, cards: [] })) || [])
    );
  };

  return {
    currentPlayer,
    isLoading,
    gameState,
    dropCard,
    dropBoardIdx,
    participants,
    handleTurnEnd,
    handleDropCard,
    handleDropIdx,
    handleStartGame,
    handlePlay,
  };
};

export default useGame;
