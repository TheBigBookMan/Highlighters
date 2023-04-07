import {
  WhereFilterOp,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

// * Get data of friends from database
export const friendsData = async (
  isQuery: boolean,
  keyword: string,
  loggedInUser: User | undefined,
  stateToUpdate: React.Dispatch<React.SetStateAction<User[]>>
) => {
  try {
    const collectionRef = collection(db, "users");
    let useQuery;
    if (isQuery) {
      useQuery = query(
        collectionRef,
        where(keyword, "array-contains", loggedInUser?.id)
      );
    } else {
      useQuery = collectionRef;
    }
    const unsubscribe = onSnapshot(useQuery, (snapshot) => {
      let lists: any = [];
      snapshot.docs.forEach(async (doc) => {
        await lists.push({ ...doc.data(), id: doc.id });
      });

      stateToUpdate([...lists]);
    });
    return unsubscribe;
  } catch (err) {
    console.log(err);
  }
};

// * Get data of posts from database
export const postsData = async (
  collectionName: string,
  keyWhere: string,
  operation: WhereFilterOp,
  selectedId: string | string[],
  postState:
    | React.Dispatch<React.SetStateAction<Post[]>>
    | React.Dispatch<React.SetStateAction<Comment[]>>,
  filteredState: React.Dispatch<React.SetStateAction<Post[]>> | null
) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(
      collectionRef,
      where(keyWhere, operation, selectedId),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let userData: any = [];
      snapshot.docs.forEach(async (doc) => {
        userData.push({ ...doc.data(), id: doc.id });
      });
      if (filteredState) {
        const filteredList = userData.filter((post: any) => {
          return post.timeframe === "Daily";
        });
        filteredState([...filteredList]);
      }
      postState([...userData]);
    });
    return unsubscribe;
  } catch (err) {
    console.log(err);
  }
};

// * Like a post
export const likeButton = async (
  e: React.MouseEvent<HTMLButtonElement>,
  collection: string,
  selectedId: string | null,
  loggedInUserId: string | undefined
) => {
  e.preventDefault();
  try {
    if (!selectedId) return;
    const docRef = doc(db, collection, selectedId);
    const docSnap = await getDoc(docRef);
    if (docSnap) {
      const data = docSnap.data();
      const updatedLikes = [...data?.likedByUsers, loggedInUserId];
      const updatedData = { ...data, likedByUsers: [...updatedLikes] };
      await updateDoc(docRef, updatedData);
    }
    return;
  } catch (err) {
    console.log(err);
  }
};

// * Remove like from post
export const unlikeButton = async (
  e: React.MouseEvent<HTMLButtonElement>,
  collection: string,
  selectedId: string | null,
  loggedInUserId: string | undefined
) => {
  e.preventDefault();
  try {
    if (!selectedId) return;
    const docRef = doc(db, collection, selectedId);
    const docSnap = await getDoc(docRef);
    if (docSnap) {
      const data = docSnap.data();
      const currentLikes = data?.likedByUsers;
      const indexOfId = currentLikes?.indexOf(loggedInUserId);
      if (indexOfId === undefined) return;
      currentLikes?.splice(indexOfId, 1);
      const updatedData = { ...data, likedByUsers: [...currentLikes] };
      await updateDoc(docRef, updatedData);
    }
    return;
  } catch (err) {
    console.log(err);
  }
};
