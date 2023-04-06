"use client";
import { Circles } from "react-loader-spinner";

export default function loading() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Circles
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}
