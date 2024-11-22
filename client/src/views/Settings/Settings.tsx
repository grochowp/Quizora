import { UserCard } from "../../components/reusable/UserCard";
import { useLoggedUserContext } from "../../contexts/loggedUserContext";

const Settings = () => {
  const { loggedUserData } = useLoggedUserContext();
  return (
    <div>
      <UserCard user={loggedUserData}>
        <div></div>
      </UserCard>
    </div>
  );
};

export default Settings;
