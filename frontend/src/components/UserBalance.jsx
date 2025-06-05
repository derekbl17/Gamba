import { useUserBalance } from "../api/balance";

const UserBalance = ({ userId }) => {
  const { data: balance, isLoading, error } = useUserBalance(userId);

  if (isLoading) return <p>Loading balance...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <p>Your balance: {balance}</p>;
};

export default UserBalance;
