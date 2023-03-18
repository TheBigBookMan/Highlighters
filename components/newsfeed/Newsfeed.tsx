"use client";

import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Newsfeed = () => {
  const [user, loading] = useAuthState(auth);

  console.log(user);
  return (
    <div>
      <h1>newsfeed</h1>
    </div>
  );
};

export default Newsfeed;
