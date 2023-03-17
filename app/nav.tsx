import Link from "next/link";

const Nav = () => {
  return (
    <div className="p-4 flex justify-between items-center w-auto">
      <Link href="/">
        <h1>Highlighters</h1>
      </Link>
      <ul className="flex items-center gap-4">
        <li>
          <Link href="/profile">
            <p>Profile</p>
          </Link>
        </li>
        <li>
          <Link href="/newsfeed">
            <p>Newsfeed</p>
          </Link>
        </li>
        <li className="bg-teal-500 py-2 px-4 rounded-xl text-white">
          <Link href="/auth">
            <p>Sign In</p>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
