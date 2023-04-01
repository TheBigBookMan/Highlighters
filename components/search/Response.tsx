import { db } from "@/utils/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

type InputSearch = {
  search: string | null;
};

const Response = ({ search }: InputSearch) => {
  const [listResults, setListResults] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const getSearchResults = async () => {
    try {
      const filteredResults = listResults.filter((user) => {
        return user.displayName.toLowerCase() === search?.toLowerCase();
      });
      setSearchResults(filteredResults);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(searchResults);

  const getData = async () => {
    try {
      const collectionRef = collection(db, "users");
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        let lists: any = [];
        snapshot.docs.forEach(async (doc) => {
          await lists.push({ ...doc.data(), id: doc.id });
        });
        setListResults([...lists]);
      });
      return unsubscribe;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (listResults.length > 0) {
      getSearchResults();
    }
  }, [listResults]);

  useEffect(() => {
    if (search) {
      getData();
    }
  }, [search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <h1>Search Results For: </h1>
        <p className="font-bold text-teal-500">{search}</p>
      </div>
      {searchResults.length === 0 && <h1>No results, try again...</h1>}
      {searchResults.length > 0 && (
        <ul className="flex flex-col gap-2">
          {searchResults.map((user) => (
            <li
              key={user.id}
              className=" w-full h-[80px] border-b p-2 py-4 flex justify-between items-center gap-1"
            >
              <Link href={`/user/${user.id}`} key={user.id}>
                <div className="flex gap-1">
                  <img
                    src={user.image}
                    alt={user.displayName}
                    className="w-20 h-20 rounded-lg"
                  />
                  <div className="flex flex-col">
                    <h1 className="font-bold text-teal-500">
                      {user.displayName}
                    </h1>
                    <p className="overflow-y-auto max-w-[400px] h-[50px] text-sm scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-thumb-teal-500 scrollbar-track-gray-200">
                      {user.description}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Response;
