// * Function for user to select filter
export const userFilter = async (list: Post[], selectedFilter: string) => {
  if (selectedFilter === "Most Recent") {
    list = list;
  } else if (selectedFilter === "Least Recent") {
    list = list.sort((item1, item2) => {
      return Number(item1.createdAt) - Number(item2.createdAt);
    });
  } else if (selectedFilter === "Top Rated") {
    list = list.sort((item1, item2) => {
      return item2.likedByUsers.length - item1.likedByUsers.length;
    });
  } else if (selectedFilter === "Least Rated") {
    list = list.sort((item1, item2) => {
      return item1.likedByUsers.length - item2.likedByUsers.length;
    });
  }
  return list;
};

export const filteredTimeframe = async (list: Post[], timeframe: string) => {
  try {
    if (list.length > 0) {
      if (timeframe === "All") {
        console.log(list);
        return list;
      } else {
        const filteredList = list.filter((post) => {
          return post.timeframe === timeframe;
        });
        console.log(filteredList);
        return filteredList;
      }
    }
    console.log(list);
    return list;
  } catch (error) {
    console.log(error);
  }
};
