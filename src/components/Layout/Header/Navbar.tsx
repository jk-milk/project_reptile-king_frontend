import { IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full z-30 bg-white shadow-xl fixed top-0">
      <div className="w-full flex items-center justify-between px-6 py-2">
        <div className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1" id="menu">
          <nav>
            <ul className="md:flex items-center justify-between text-base text-black pt-4 md:pt-0">
              <li>
                <Link to="/home">
                  <img
                    src="/logo.png"
                    alt="로고"
                    className="mx-4 h-12"
                  />
                </Link>
              </li>
              <ul className="md:flex items-center justify-between px-4">
                <li><Link to="/market" className="inline-block no-underline font-bold text-lg py-2 px-8 lg:-ml-2 hover:text-green-800 transition-colors duration-300 cursor-pointer">마켓</Link></li>
                <li><Link to="/board" className="inline-block no-underline font-bold text-lg py-2 px-8 lg:-ml-2 hover:text-green-800 transition-colors duration-300 cursor-pointer">커뮤니티</Link></li>
                <li><Link to="/cage" className="inline-block no-underline font-bold text-lg py-2 px-8 lg:-ml-2 hover:text-green-800 transition-colors duration-300 cursor-pointer">MY 사육장</Link></li>
              </ul>
            </ul>
          </nav>
        </div>
        <div className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4" id="nav-content">
          <div className="auth flex items-center w-full md:w-full">
            <Link to="/login" className="font-bold text-lg p-2 mr-4 hover:text-green-800 transition-colors duration-300 cursor-pointer">로그인</Link>
            <IoMdNotifications size="30" className="text-gray-800 hover:text-green-800 transition-colors duration-300 cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
