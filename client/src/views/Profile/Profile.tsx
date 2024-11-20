import { useParams } from "react-router-dom";
import { QuizSelection } from "../../components/reusable/QuizSelection";

function Profile() {
  const { userId } = useParams();

  return (
    <div>
      <QuizSelection userId={userId} />
    </div>
  );
}

export default Profile;
