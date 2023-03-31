const resetDaily = async (userId: string) => {
  console.log("RESET HERE");
  try {
    console.log(userId);
    // const docRef;
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
    resetDaily(userId);
    setInterval(resetDaily, 86400000); // repeat every 24 hours
  }, millisTill11);
};

export const test = (userId: string) => {
  setInterval(function () {
    resetDaily(userId);
  }, 1000 * 60 * 1);
};
