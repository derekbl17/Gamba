import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import UserBalance from "../components/UserBalance";
import { useAuth } from "../context/authContext";

const BlackjackGame = () => {
  const { user } = useAuth();
  const [betAmount, setBetAmount] = useState(10);
  const [gameState, setGameState] = useState(null);
  const [delayedResult, setDelayedResult] = useState(null);
  const queryClient = useQueryClient();

  const { data: existingGame } = useQuery({
    queryKey: ["blackjackGame", user._id],
    queryFn: async () => {
      const res = await axios.get("/api/blackjack/status");
      return res.data;
    },
    enabled: !!user._id,
  });

  useEffect(() => {
    if (existingGame) {
      setGameState(existingGame.gameState);
      setBetAmount(existingGame.betAmount);
    }
  }, [existingGame]);

  // Audio references
  const dealSound = useRef(new Audio("/sounds/card-deal.mp3"));
  const winSound = useRef(new Audio("/sounds/coin-win.mp3"));
  const loseSound = useRef(new Audio("/sounds/coin-loss.mp3"));
  const shuffleSound = useRef(new Audio("/sounds/card-shuffle.mp3"));

  useEffect(() => {
    [
      dealSound.current,
      winSound.current,
      loseSound.current,
      shuffleSound.current,
    ].forEach((audio) => {
      audio.load();
    });
  }, []);

  // Sound playback function matching coin toss example
  const playSound = (soundRef) => {
    const audio = soundRef?.current;
    if (!audio || typeof audio.play !== "function") return;

    if (audio.readyState >= 2) {
      try {
        audio.currentTime = 0;
        audio.play().catch((error) => {
          console.warn("Playback prevented:", error);
        });
      } catch (error) {
        console.error("Sound play failed:", error);
      }
    } else {
      console.warn("Audio not ready:", audio.src);
    }
  };

  // Start new game mutation
  const { mutate: startGame, isPending: isStarting } = useMutation({
    mutationFn: async (amount) => {
      playSound(shuffleSound);
      const res = await axios.post("/api/blackjack/bet", {
        amount,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setGameState(data.gameState);
      queryClient.invalidateQueries({ queryKey: ["userBalance"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to start game");
    },
  });

  // Player action mutation
  const { mutate: playerAction, isPending: isActionPending } = useMutation({
    mutationFn: async (action) => {
      playSound(dealSound);
      const res = await axios.post("/api/blackjack/action", {
        action,
      });
      return res.data;
    },
    onSuccess: (data) => {
      setDelayedResult(null);

      setTimeout(() => {
        setGameState(data.gameState);
        if (data.result) {
          if (data.result === "win") playSound(winSound);
          else if (data.result === "lose") playSound(loseSound);
          setDelayedResult(data);
        }
        queryClient.invalidateQueries({ queryKey: ["userBalance"] });
      }, 1000);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Action failed");
    },
  });

  // Render card
  const renderCard = (card, index, isDealer = false) => {
    if (isDealer && index === 1 && gameState?.status === "active") {
      return (
        <div key="hidden" className="Bj-card hidden">
          🂠
        </div>
      );
    }

    const valueMap = { 1: "A", 11: "J", 12: "Q", 13: "K" };
    const suitSymbols = { H: "♥", D: "♦", C: "♣", S: "♠" };
    const value = valueMap[card.value] || card.value;
    const suit = suitSymbols[card.suit] || card.suit;

    return (
      <div
        key={`${card.suit}-${card.value}-${index}`}
        className={`Bj-card ${card.suit}`}
      >
        <div className="card-value">{value}</div>
        <div className="card-suit">{suit}</div>
      </div>
    );
  };

  return (
    <Container className="game-container">
      <h1>Blackjack</h1>

      {!gameState ? (
        <div className="new-game">
          <input
            className="bg-stone-800 p-1 w-20 text-center"
            type="number"
            value={betAmount}
            onChange={(e) =>
              setBetAmount(Math.max(1, parseInt(e.target.value) || 1))
            }
          />
          <Button
            className="mx-2"
            variant="success"
            onClick={() => startGame(betAmount)}
            disabled={isStarting}
          >
            {isStarting ? "Starting..." : "Place Bet"}
          </Button>
        </div>
      ) : (
        <>
          {/* Dealer Area */}
          <div className="dealer-area">
            <h2>
              Dealer {gameState.dealerValue && `(${gameState.dealerValue})`}
            </h2>
            <div className="hand">
              {gameState.dealerHand
                .filter(
                  (card, i) =>
                    !(
                      card.suit === "X" &&
                      card.value === 0 &&
                      (i !== 1 || gameState.status !== "active")
                    )
                )
                .map((card, i) => renderCard(card, i, true))}
            </div>
          </div>

          {/* Player Area */}
          <div className="player-area">
            <h2>You ({gameState.playerValue})</h2>
            <div className="hand">
              {gameState.playerHand.map((card, i) => renderCard(card, i))}
            </div>
          </div>

          {/* Controls */}
          <div className="controls">
            {gameState.status === "active" ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => playerAction("hit")}
                  disabled={isActionPending}
                >
                  Hit
                </Button>
                <Button
                  variant="warning"
                  onClick={() => playerAction("stand")}
                  disabled={isActionPending}
                >
                  Stand
                </Button>
              </>
            ) : (
              <Button
                variant="success"
                onClick={() => {
                  setGameState(null);
                  setDelayedResult(null);
                }}
              >
                New Game
              </Button>
            )}
          </div>
        </>
      )}

      {/* Result Display */}
      {delayedResult ? (
        <div className="result-message">
          {delayedResult.result === "win" && (
            <div className="win">You Win!</div>
          )}
          {delayedResult.result === "lose" && (
            <div className="lose">You Lose</div>
          )}
          {delayedResult.result === "push" && <div className="push">Push</div>}
          <div>Payout: {delayedResult.payout}</div>
          <div>New Balance: {delayedResult.newBalance}</div>
        </div>
      ) : (
        gameState === null && <UserBalance />
      )}
    </Container>
  );
};

export default BlackjackGame;
