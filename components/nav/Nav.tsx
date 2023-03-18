"use client";

import Link from "next/link";
import { auth } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Nav = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  console.log(user);

  const GoogleLogout = async () => {
    try {
      await signOut(auth);
      route.push("/auth");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="py-4 px-4 md:py-8 md:px-16 flex justify-between items-center w-auto">
      <Link href="/">
        <h1 className="font-lobster text-teal-500 md:text-3xl">Highlighters</h1>
      </Link>
      {!user ? (
        <button>
          <Link href="/auth">
            <p className="bg-teal-500 py-2 px-4 rounded-xl text-white hover:bg-teal-600">
              Sign In
            </p>
          </Link>
        </button>
      ) : (
        <ul className="flex items-center gap-4">
          <li>
            <Link href="/profile">
              <p>Profile</p>
            </Link>
          </li>
          <li>
            <Link href="/newsfeed">
              <p>Newsfeed</p>
            </Link>
          </li>
          <li>
            <Link href="/auth">
              <button
                onClick={GoogleLogout}
                className="bg-teal-500 py-2 px-4 rounded-xl text-white hover:bg-teal-600"
              >
                Signout
              </button>
            </Link>
          </li>
        </ul>
      )}
    </div>
  );
};

export default Nav;
