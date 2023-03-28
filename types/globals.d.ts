export {};

declare module "react";
declare module "react/jsx-runtime";

declare global {
  interface User {
    id: string;
    displayName: string;
    email: string;
    image: string;
    googleId: string;
    followedBy: string[];
    following: string[];
    description: string;
    posts: number;
  }

  interface FormPost {
    title: string;
    image: string;
    description: string;
    location: string;
    date: string;
    timeframe: string;
    userId: string;
    googleId: string;
    likedByUsers: string[];
    comments: number;
    userName: string;
    createdAt: Date | string;
  }
  interface Post extends FormPost {
    post: any;
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

  type Parameters = {
    post: string | null;
    user: string | null;
  };

  interface Params {
    params: Parameters;
  }

  interface Comment {
    comment: string;
    postId: string;
    id: string;
    userId: string;
    userName: string;
    userImage: string;
    date: string;
    createdAt: Date | string;
  }
}
