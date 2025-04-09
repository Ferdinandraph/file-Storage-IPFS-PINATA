import { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { GiHamburgerMenu } from 'react-icons/gi';
import { Link, useLocation } from 'react-router-dom';

function Header({ token, setToken, account, connectWallet }) {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    setToken('');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 flex flex-row items-center justify-between sm:justify-around p-4 border-b-2 bg-gray-100 shadow-md z-50">
      <Link
        to="/"
        className="flex items-center h-12 px-6 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-500 rounded-tl-full rounded-br-full font-bold uppercase italic text-white hover:opacity-90"
      >
        DEX FILE STORAGE
      </Link>
      <nav className="hidden sm:flex justify-between items-center gap-6 font-semibold">
        <Link
          to="/"
          className={`transition-colors duration-300 ${isActive('/') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
        >
          Home
        </Link>
        {token ? (
          <>
            <Link
              to="/upload"
              className={`transition-colors duration-300 ${isActive('/upload') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
            >
              Upload File
            </Link>
            <Link
              to="/retrieve"
              className={`transition-colors duration-300 ${isActive('/retrieve') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
            >
              Retrieve File
            </Link>
            <Link
              to="/cids"
              className={`transition-colors duration-300 ${isActive('/cids') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
            >
              Your CIDs
            </Link>
            <button
              onClick={handleLogout}
              className="transition-colors duration-300 text-gray-800 hover:text-red-500 font-semibold"
            >
              logout
            </button>
            {!account ? (
              <button
                onClick={connectWallet}
                className="transition-colors duration-300 text-gray-800 hover:text-green-500 font-semibold"
              >
                Connect Wallet
              </button>
            ) : (
              <span className="text-gray-600">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            )}
          </>
        ) : (
          <>
            <Link
              to="/register"
              className={`transition-colors duration-300 ${isActive('/register') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
            >
              Register
            </Link>
            <Link
              to="/login"
              className={`transition-colors duration-300 ${isActive('/login') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
            >
              Login
            </Link>
          </>
        )}
      </nav>
      <nav className="sm:hidden flex flex-col items-end gap-2 font-semibold">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="font-bold text-xl text-gray-800 hover:text-blue-500"
        >
          {showMenu ? <GrClose /> : <GiHamburgerMenu />}
        </button>
        {showMenu && (
          <div className="flex flex-col items-end gap-2 mt-2 bg-gray-200 p-4 rounded-lg shadow-lg">
            <Link
              to="/"
              className={`transition-colors duration-300 ${isActive('/') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
            >
              Home
            </Link>
            {token ? (
              <>
                <Link
                  to="/upload"
                  className={`transition-colors duration-300 ${isActive('/upload') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
                >
                  Upload File
                </Link>
                <Link
                  to="/retrieve"
                  className={`transition-colors duration-300 ${isActive('/retrieve') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
                >
                  Retrieve File
                </Link>
                <Link
                  to="/cids"
                  className={`transition-colors duration-300 ${isActive('/cids') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
                >
                  Your CIDs
                </Link>
                <button
                  onClick={handleLogout}
                  className="transition-colors duration-300 text-gray-800 hover:text-red-500 font-semibold"
                >
                  Logout
                </button>
                {!account ? (
                  <button
                    onClick={connectWallet}
                    className="transition-colors duration-300 text-gray-800 hover:text-green-500 font-semibold"
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <span className="text-gray-600">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`transition-colors duration-300 ${isActive('/register') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className={`transition-colors duration-300 ${isActive('/login') ? 'text-blue-500' : 'text-gray-800'} hover:text-blue-500`}
                >
                  Login
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;