import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";

export const updateLoggedInUser = async (
  setLoggedInUser: React.Dispatch<React.SetStateAction<User | undefined>>,
  userId: string
) => {
  try {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("googleId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let userData;
      snapshot.docs.forEach(async (doc) => {
        userData = doc.data();
        if (userData) {
          setLoggedInUser({
            dailyPosted: userData.dailyPosted,
            description: userData.description,
            displayName: userData.displayName,
            email: userData.email,
            followedBy: userData.followedBy,
            following: userData.following,
            googleId: userData.googleId,
            id: doc.id,
            image: userData.image,
            monthlyPosted: userData.monthlyPosted,
            weeklyPosted: userData.weeklyPosted,
            yearlyPosted: userData.yearlyPosted,
          });
        }
      });
    });
    return unsubscribe;
  } catch (err) {
    console.log(err);
  }
};
