import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Container } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

const Game = ({ userId }) => {
  const [betAmount, setBetAmount] = useState(10);
  const queryClient = useQueryClient();

  const [delayedResult, setDelayedResult] = useState(null);

  // TanStack Mutation for placing bets
  const {
    mutate: placeBet,
    isPending,
    data,
  } = useMutation({
    mutationFn: async (amount) => {
      playSound(flipSound);
      const res = await axios.post("/api/game/bet", { userId, amount });
      return res.data;
    },
    onSuccess: (data) => {
      // Refresh user balance after bet

      setDelayedResult(null);

      setTimeout(() => {
        if (data.result === "win") playSound(winSound);
        else playSound(loseSound);
        setDelayedResult(data);
        queryClient.invalidateQueries({ queryKey: ["userBalance"] });
      }, 1000);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err.response.data.message || err.response.data.error);
    },
  });

  // Audio references with fallback
  const winSound = useRef(new Audio("/sounds/coin-win.mp3"));
  const loseSound = useRef(new Audio("/sounds/coin-loss.mp3"));
  const flipSound = useRef(new Audio("/sounds/coin-flip.mp3"));

  // Preload sounds
  useEffect(() => {
    [winSound.current, loseSound.current, flipSound.current].forEach(
      (audio) => {
        audio.load();
      }
    );
  }, []);

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

  return (
    <Container className="game-container">
      <h1>Flip a coin</h1>
      <input
        className="bg-stone-800 p-1 w-20 text-center"
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        min="1"
      />
      <Button
        className="mx-2"
        variant="success"
        onClick={() => placeBet(betAmount)}
        disabled={isPending}
      >
        {isPending ? "Processing..." : "Place Bet"}
      </Button>

      {delayedResult && (
        <Container>
          <p>
            Result: <strong>{delayedResult.result.toUpperCase()}</strong>
          </p>
          <p>Payout: {delayedResult.payout}</p>
          <p>New Balance: {delayedResult.newBalance}</p>
        </Container>
      )}
    </Container>
  );
};
export default Game;
