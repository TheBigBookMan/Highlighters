"use client";
import { useSearchParams } from "next/navigation";
import Response from "@/components/search/Response";

const SearchPage = () => {
  // ? Get the search params from the URL query
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  return (
    <div className="shadow-xl rounded-lg h-full w-full p-4 flex flex-col gap-4">
      <h1 className="font-bold text-teal-500 text-xl">Results</h1>
      <Response search={search} />
    </div>
  );
};

export default SearchPage;
