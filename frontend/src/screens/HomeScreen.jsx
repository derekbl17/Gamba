import { Hero } from "../components";
import { useAuth } from "../context/authContext";
import { UserBalance, Game } from "../components";

const HomeScreen = () => {
  const { user } = useAuth();
  console.log(user);
  if (!user) return <Hero />;
  return (
    <>
      <h1>Hello {user.name}!</h1>
      <UserBalance userId={user._id} />
      <Game userId={user._id} />
    </>
  );
};

export default HomeScreen;
