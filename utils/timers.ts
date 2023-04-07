import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// ? Function that resets the timer once the cooldown has ended
const resetTimer = async (userId: string, timeframe: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (!docSnap) return;
    const docData = docSnap.data();
    let updatedData;
    if (timeframe === "daily") {
      updatedData = { ...docData, dailyPosted: false };
    } else if (timeframe === "weekly") {
      updatedData = { ...docData, weeklyPosted: false };
    } else if (timeframe === "monthly") {
      updatedData = { ...docData, monthlyPosted: false };
    } else if (timeframe === "yearly") {
      updatedData = { ...docData, yearlyPosted: false };
    }
    await updateDoc(docRef, updatedData);
  } catch (err) {
    console.log(err);
  }
};

// ? Set the  daily timer
export const dailyTimer = (userId: string) => {
  const now: any = new Date();
  const newDate: any = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    0,
    0
  );
  let millisTill11: any = newDate - now;
  if (millisTill11 < 0) {
    millisTill11 += 86400000; // it's after 11:59pm, try again tomorrow
  }
  setTimeout(function () {
    resetTimer(userId, "daily");
    setInterval(function () {
      resetTimer(userId, "daily");
    }, 86400000); // repeat every 24 hours
    // }, 1000 * 60 * 1); // repeat every minute
  }, millisTill11);
  // }, 1000 * 60 * 1);
};

// ? Set the weekly timer
export const weeklyTimer = (userId: string) => {
  const now = new Date();
  const sunday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + (7 - now.getDay()),
    23,
    59,
    0,
    0
  );
  let millisTillSunday = sunday.getTime() - now.getTime();
  if (millisTillSunday < 0) {
    millisTillSunday += 604800000; // it's after Sunday 11:59pm, try again next Sunday
  }
  setTimeout(function () {
    resetTimer(userId, "weekly");
    setInterval(function () {
      resetTimer(userId, "weekly");
    }, 604800000); // repeat every week
  }, millisTillSunday);
};

// ? Set the monthly timer
export const monthlyTimer = (userId: string) => {
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const lastDayOfMonthAt1159pm = new Date(
    lastDayOfMonth.getFullYear(),
    lastDayOfMonth.getMonth(),
    lastDayOfMonth.getDate(),
    23,
    59,
    0,
    0
  );
  const millisTillEndOfMonth = lastDayOfMonthAt1159pm.getTime() - now.getTime();

  setTimeout(function () {
    resetTimer(userId, "monthly");
    setInterval(function () {
      resetTimer(userId, "monthly");
    }, 1000 * 60 * 60 * 24 * 30); // repeat every month
  }, millisTillEndOfMonth);
};

// ? Set the yearly timer
export const yearlyTimer = (userId: string) => {
  const now = new Date();
  const december31 = new Date(now.getFullYear(), 11, 31, 23, 59, 0, 0);
  const millisTillDecember31 = december31.getTime() - now.getTime();

  setTimeout(function () {
    resetTimer(userId, "yearly");
    setInterval(function () {
      resetTimer(userId, "yearly");
    }, 1000 * 60 * 60 * 24 * 365); // repeat every year
  }, millisTillDecember31);
};

// ? Test function
// export const test = (userId: string) => {
//   setInterval(function () {
//     resetDaily(userId);
//   }, 1000 * 60 * 1);
// };
