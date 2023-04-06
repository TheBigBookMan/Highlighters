import UserPosts from "@/components/user/UserPosts";
import UserBio from "@/components/user/UserBio";

// ? Get the params from the URL which has the userId
const User = ({ params }: Params) => {
  return (
    <div className="flex flex-col p-4 gap-4">
      <UserBio params={params} />
      <UserPosts params={params} />
    </div>
  );
};

export default User;
