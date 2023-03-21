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
    date: string;
    timestamp: Date | null;
    userId: string;
    likes: number;
    dislikes: number;
    comments: number;
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

  type Post = {
    post: string;
  };
  interface Params {
    params: Post;
  }
}
