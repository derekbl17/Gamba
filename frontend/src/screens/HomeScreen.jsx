import { Hero, UserBalance } from "../components";
import { useAuth } from "../context/authContext";

const HomeScreen = () => {
  const { user } = useAuth();
  if (!user) return <Hero />;
  return (
    <>
      <div className="hello">
        <h1>Hello {user.name}!</h1>
        <UserBalance />
      </div>
    </>
  );
};

export default HomeScreen;
