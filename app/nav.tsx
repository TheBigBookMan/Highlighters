import Link from "next/link";

const Nav = () => {
  return (
    <div className="py-4 px-4 md:py-8 md:px-16 flex justify-between items-center w-auto">
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
        <li>
          <Link href="/auth">
            <p className="bg-teal-500 py-2 px-4 rounded-xl text-white hover:bg-teal-600">
              Sign In
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
