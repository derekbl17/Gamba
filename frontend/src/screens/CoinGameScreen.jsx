import { Game } from "../components";
import { useAuth } from "../context/authContext";

function CoinGameScreen() {
  const { user } = useAuth();
  return (
    <div>
      <Game userId={user._id} />
    </div>
  );
}

export default CoinGameScreen;
