export {};

declare module "react";
declare module "react/jsx-runtime";

declare global {
  interface FormPost {
    title: string;
    image: string;
    description: string;
    friends: string[];
    location: string;
    timeframe: string;
    timestamp: Date | null;
    userId: string;
    likes: number;
    dislikes: number;
    comments: number;
  }
  interface Post extends FormPost {
    id: string;
  }

  interface ImageFile {
    lastModified: number;
    lastModifiedDate: object;
    name: string;
    size: number;
    type: string;
    webkitRelativePath: string;
  }
}
