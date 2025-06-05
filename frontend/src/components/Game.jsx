import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Game = ({ userId }) => {
  const [betAmount, setBetAmount] = useState(10);
  const queryClient = useQueryClient();

  // TanStack Mutation for placing bets
  const {
    mutate: placeBet,
    isPending,
    data,
  } = useMutation({
    mutationFn: async (amount) => {
      const res = await axios.post("/api/game/bet", { userId, amount });
      return res.data;
    },
    onSuccess: () => {
      // Refresh user balance after bet
      queryClient.invalidateQueries({ queryKey: ["userBalance"] });
    },
  });

  return (
    <div>
      <h1>50/50 Chance Game</h1>
      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        min="1"
      />
      <button onClick={() => placeBet(betAmount)} disabled={isPending}>
        {isPending ? "Processing..." : "Place Bet"}
      </button>

      {data && (
        <div>
          <p>
            Result: <strong>{data.result.toUpperCase()}</strong>
          </p>
          <p>Payout: {data.payout}</p>
          <p>New Balance: {data.newBalance}</p>
        </div>
      )}
    </div>
  );
};
export default Game;
