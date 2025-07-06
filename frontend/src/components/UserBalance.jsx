import { useUserBalance } from "../api/balance";
import { useAuth } from "../context/authContext";

const UserBalance = () => {
  const { user } = useAuth();
  const { data: balance, isLoading, error } = useUserBalance(user?._id);

  if (isLoading) return <p>Loading balance...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>Your balance: {balance}</p>;
};

export default UserBalance;
