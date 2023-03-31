import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const resetDaily = async (userId: string) => {
  console.log("RESET HERE");
  try {
    console.log(userId);
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap) return;
    const docData = docSnap.data();
    const updatedData = { ...docData, dailyPosted: false };
    await updateDoc(docRef, updatedData);
  } catch (err) {
    console.log(err);
  }
};

// !!!
// !! the timers actually wont be set until i post?? Double rethink that because if its not executing the code right when creating then its fine
//!!
export const dailyTimer = (userId: string) => {
  const now = new Date();
  let millisTill11: any =
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 0, 0) -
    now;
  if (millisTill11 < 0) {
    millisTill11 += 86400000; // it's after 11:59pm, try again tomorrow
  }
  setTimeout(function () {
    console.log("init one");
    resetDaily(userId);
    setInterval(function () {
      console.log("THIS HAPPENS EVERY 24 hours");
      resetDaily(userId);
    }, 86400000); // repeat every 24 hours
    // }, 1000 * 60 * 1); // repeat every minute
  }, millisTill11);
  // }, 1000 * 60 * 1);
};

// export const test = (userId: string) => {
//   setInterval(function () {
//     resetDaily(userId);
//   }, 1000 * 60 * 1);
// };
