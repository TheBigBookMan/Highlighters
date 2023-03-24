import UserPosts from "@/components/user/UserPosts";
import UserBio from "@/components/user/UserBio";

const User = ({ params }: Params) => {
  console.log(params);
  // ? try the statiparams thing to learn it, might involve getting the user here and then passing that info through props
  return (
    <div className="flex flex-col p-4 gap-4">
      <UserBio params={params} />
      <UserPosts params={params} />
    </div>
  );
};

export default User;
