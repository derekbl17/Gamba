import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
      queryClient.invalidateQueries({ queryKey: ["userBalance"] });

      setDelayedResult(null);

      setTimeout(() => {
        console.log(data);
        if (data.result === "win") playSound(winSound);
        else playSound(loseSound);

        setDelayedResult(data);
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
    <div className="bg-blue-900 border-2 border-slate-400 rounded-sm p-2">
      <h1>Flip a coin</h1>
      <input
        className="bg-stone-800 p-1 w-20 text-center"
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        min="1"
      />
      <button
        className="bg-emerald-700 rounded-xl mx-2 px-3"
        onClick={() => placeBet(betAmount)}
        disabled={isPending}
      >
        {isPending ? "Processing..." : "Place Bet"}
      </button>

      {delayedResult && (
        <div>
          <p>
            Result: <strong>{delayedResult.result.toUpperCase()}</strong>
          </p>
          <p>Payout: {delayedResult.payout}</p>
          <p>New Balance: {delayedResult.newBalance}</p>
        </div>
      )}
    </div>
  );
};
export default Game;
