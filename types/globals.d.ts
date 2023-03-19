export {};

declare module "react";
declare module "react/jsx-runtime";

declare global {
  interface Post {
    title: string;
    image: string;
    description: string;
    friends: string[];
    location: string;
    timeframe: string;
    date: string;
  }
}
