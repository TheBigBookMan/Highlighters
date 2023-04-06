import Bio from "../../components/profile/Bio";
import MyPosts from "../../components/profile/MyPosts";

const Profile = () => {
  return (
    <div className="flex flex-col p-4 gap-4">
      <Bio />
      <MyPosts />
    </div>
  );
};

export default Profile;
