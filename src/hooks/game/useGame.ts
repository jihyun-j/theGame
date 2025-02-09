import { useState } from "react";
import { getCurPlayer, initGame, play, turnEnd } from "../../modules/Game";
import { ToastPopUp } from "../../modules/Toast";
import useGameQuery from "./useGameQuery";
import useRoom from "./useRoom";

const useGame = (roomId: number) => {
  const [dropCard, setDropCard] = useState(-1);
  const [dropBoardIdx, setDropIdx] = useState(-1);

  const { gameState, updateGameState, isLoading } = useGameQuery(roomId);
  const { participantNicknames } = useRoom(roomId);

  const currentPlayer = getCurPlayer(gameState!);

  const handlePlay = () => {
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
      initGame(
        participantNicknames?.map((nickname) => ({ nickname, cards: [] })) ||
          [],
      ),
    );
  };

  return {
    currentPlayer,
    isLoading,
    gameState,
    dropCard,
    dropBoardIdx,
    handleTurnEnd,
    handleDropCard,
    handleDropIdx,
    handleStartGame,
    handlePlay,
  };
};

export default useGame;
