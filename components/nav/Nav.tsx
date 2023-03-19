"use client";

import Link from "next/link";
import { auth } from "../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { BiNews, BiEditAlt } from "react-icons/bi";
import { FaUserFriends } from "react-icons/fa";

const Nav = () => {
  const [openNav, setOpenNav] = useState<boolean>(false);
  const route = useRouter();
  const searchPath = usePathname();
  const [user, loading] = useAuthState(auth);

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
        <h1 className="font-lobster text-teal-500 text-xl md:text-3xl">
          Highlighters
        </h1>
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
        <>
          <ul className="hidden md:flex items-center gap-4">
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

          <div className="flex gap-4 md:hidden relative">
            <Link
              href="/createpost"
              className="bg-teal-500 flex gap-2 items-center px-4 rounded-xl text-white hover:bg-teal-600"
            >
              <BiEditAlt className="text-black text-2xl" />
              <p>Post</p>
            </Link>
            <img
              onClick={() => setOpenNav(!openNav)}
              src={user.photoURL}
              alt="profile pic"
              className={`w-12 h-12 rounded-full cursor-pointer shadow-xl hover:border-2 hover:border-teal-500 ${
                openNav && "border-2 border-teal-500 hover:border-none"
              }`}
            />
            {openNav && (
              <div className="flex flex-col justify-between p-2 gap-2 md:hidden absolute w-[180px] h-[240px] bg-white shadow-xl rounded-bl-xl top-16 -right-4 transition">
                <ul className="flex flex-col gap-4">
                  <li
                    className={`hover:bg-teal-100 p-1 pl-2 rounded-xl transition cursor-pointer ${
                      searchPath === "/profile" && "bg-teal-100 "
                    }`}
                  >
                    <Link
                      className="flex gap-2 items-center"
                      onClick={() => setOpenNav(false)}
                      href="/profile"
                    >
                      <CgProfile className="text-teal-500 text-xl" />
                      <p>Profile</p>
                    </Link>
                  </li>
                  <li
                    className={`hover:bg-teal-100 p-1 pl-2 rounded-xl transition cursor-pointer ${
                      searchPath === "/newsfeed" && "bg-teal-100 "
                    }`}
                  >
                    <Link
                      className="flex gap-2 items-center"
                      onClick={() => setOpenNav(false)}
                      href="/newsfeed"
                    >
                      <BiNews className="text-teal-500 text-xl" />
                      <p>Newsfeed</p>
                    </Link>
                  </li>
                  <li
                    className={`hover:bg-teal-100 p-1 pl-2 rounded-xl transition cursor-pointer ${
                      searchPath === "/friends" && "bg-teal-100 "
                    }`}
                  >
                    <Link
                      className="flex gap-2 items-center"
                      onClick={() => setOpenNav(false)}
                      href="/friends"
                    >
                      <FaUserFriends className="text-teal-500 text-xl" />
                      <p>Friends</p>
                    </Link>
                  </li>
                </ul>
                <div className="border-t pt-2 w-full">
                  <Link href="/auth">
                    <button
                      onClick={() => {
                        GoogleLogout;
                        setOpenNav(false);
                      }}
                      className="bg-teal-500 py-2 px-4 rounded-xl text-white hover:bg-teal-600"
                    >
                      Signout
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Nav;
