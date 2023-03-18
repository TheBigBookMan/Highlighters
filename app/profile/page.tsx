import Bio from "../../components/profile/Bio";
import MyPosts from "../../components/profile/MyPosts";

// ? users profile page and the can view their posts and make new posts

const Profile = () => {
  return (
    <div className="flex flex-col p-4 gap-4">
      <Bio />
      <MyPosts />
    </div>
  );
};

export default Profile;
