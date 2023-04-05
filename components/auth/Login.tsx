"use client";

import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  dailyTimer,
  weeklyTimer,
  monthlyTimer,
  yearlyTimer,
} from "./../../utils/timers";

const Login = () => {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const googleProvider = new GoogleAuthProvider();

  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
    } catch (err) {
      toast.error("Failed to long, please try again");
      console.log(err);
    }
  };

  useEffect(() => {
    const createUserDoc = async () => {
      try {
        const collectionRef = collection(db, "users");
        const createdUser = await addDoc(collectionRef, {
          displayName: user?.displayName,
          email: user?.email,
          image: user?.photoURL,
          followedBy: [],
          following: [],
          googleId: user?.uid,
          dailyPosted: false,
          weeklyPosted: false,
          monthlyPosted: false,
          yearlyPosted: false,
        });
        dailyTimer(createdUser.id);
        weeklyTimer(createdUser.id);
        monthlyTimer(createdUser.id);
        yearlyTimer(createdUser.id);
        return;
      } catch (err) {
        console.log(err);
      }
    };

    const checkUser = async () => {
      try {
        const collectionRef = collection(db, "users");
        const q = query(collectionRef, where("googleId", "==", user?.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          let userData;
          snapshot.docs.forEach(async (doc) => {
            userData = doc.data();
            console.log(userData);
          });

          if (userData) {
            return;
          } else {
            createUserDoc();
          }
        });

        return unsubscribe;
      } catch (err) {
        console.log(err);
      }
    };

    if (user) {
      checkUser();
      route.push("/");
    } else {
      console.log("Login");
    }
  }, [route, user]);

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
      <ToastContainer limit={1} />
      <h2 className="text-2l font-medium">Join Today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with a provider</h3>
        <button
          onClick={GoogleLogin}
          className="text-white bg-gray-700 w-full font-medium rounded-lg flex justify-center p-4"
        >
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
