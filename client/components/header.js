import Link from 'next/link'

const Header = ({currentUser}) => {
  return (
    <nav className="flex justify-between">
      <Link href="/">
        <a>Home</a>
      </Link>
      {
        !currentUser ? (
          <div>
            <Link href="/auth/signup">
              <a>Sign Up</a>
            </Link>
            <Link href="/auth/signin">
              <a>Sign In</a>
            </Link>
          </div>
        ) : (
          <Link href="/auth/signout">
              <a>Sign Out</a>
          </Link>
        )
      }
    </nav>
  );
}

export default Header