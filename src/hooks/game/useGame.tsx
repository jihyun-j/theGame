import { PostgrestError } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurPlayer, initGame, play, turnEnd } from "../../modules/Game";
import { getError } from "../../modules/Game/error";
import { ToastPopUp } from "../../modules/Toast";
import useRoom from "../../store/room.store";
import { GameState, Player } from "../../types/types";
import useGameQuery from "./useGameQuery";

type GameContextType = {
  gameState: GameState | undefined;
  dropCard: number;
  dropBoardIdx: number;
  participants: string[] | null | undefined;
  isLoading: boolean;
  currentPlayer: Player | null;
  handleTurnEnd: () => void;
  handleDropCard: (card: number) => () => void;
  handleDropIdx: (idx: number) => () => void;
  handleStartGame: () => void;
  handlePlay: (cardNumber: number, dropIdx: number) => void;
};

type Props = {
  children: React.ReactNode;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: Props) => {
  const { id } = useParams();
  const roomId = Number(id!);
  const [dropCard, setDropCard] = useState(-1);
  const [dropBoardIdx, setDropIdx] = useState(-1);

  const { room, updateRoom } = useRoom();
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
    console.log("handle play", dropCard, dropBoardIdx);
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
        participants?.map((nickname) => ({ nickname, cards: [] })) || [],
      ),
    );
    updateRoom({ startAt: new Date().toISOString() });
  };

  const value = {
    gameState,
    dropCard,
    dropBoardIdx,
    participants,
    isLoading,
    currentPlayer,
    handleTurnEnd,
    handleDropCard,
    handleDropIdx,
    handleStartGame,
    handlePlay,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

const useGame = () => {
  const context = useContext(GameContext);

  if (!context) {
    ToastPopUp({ type: "error", message: "Game Context 정보가 없습니다." });
    return {} as GameContextType;
  }

  return context as GameContextType;
};

export default useGame;
