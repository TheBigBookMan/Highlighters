// * Function for user to select filter
export const userFilter = async (list: Post[], selectedFilter: string) => {
  if (selectedFilter === "Most Recent") {
    list = list.sort((item1, item2) => {
      return Number(item2.createdAt) - Number(item1.createdAt);
    });
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

// * Comment filter
export const commentFilter = async (
  list: Comment[],
  selectedFilter: string
) => {
  if (selectedFilter === "Most Recent") {
    list = list.sort((item1, item2) => {
      return Number(item2.createdAt) - Number(item1.createdAt);
    });
  } else if (selectedFilter === "Least Recent") {
    list = list.sort((item1, item2) => {
      return Number(item1.createdAt) - Number(item2.createdAt);
    });
    // ?? eventually add in likes to comments
    // } else if (selectedFilter === "Top Rated") {
    //   list = list.sort((item1, item2) => {
    //     return item2.likedByUsers.length - item1.likedByUsers.length;
    //   });
    // } else if (selectedFilter === "Least Rated") {
    //   list = list.sort((item1, item2) => {
    //     return item1.likedByUsers.length - item2.likedByUsers.length;
    //   });
  }
  return list;
};
