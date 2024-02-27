import { IoMdNotificationsOutline } from "react-icons/io";

function Navbar() {
  return (
    <nav className="w-full z-30 bg-white shadow-xl fixed top-0">
      <div className="w-full flex items-center justify-between px-6 py-2">
        <div className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1" id="menu">
          <nav>
            <ul className="md:flex items-center justify-between text-base text-black pt-4 md:pt-0">
              <li>
                <img
                  src="/logo.png"
                  alt="로고"
                  className="mx-4 h-12"
                />
              </li>
              <ul className="md:flex items-center justify-between px-4">
                <li><a className="inline-block no-underline font-bold text-lg py-2 px-8 lg:-ml-2 hover:text-green-800 transition-colors duration-300 cursor-pointer">마켓</a></li>
                <li><a className="inline-block no-underline font-bold text-lg py-2 px-8 lg:-ml-2 hover:text-green-800 transition-colors duration-300 cursor-pointer">커뮤니티</a></li>
                <li><a className="inline-block no-underline font-bold text-lg py-2 px-8 lg:-ml-2 hover:text-green-800 transition-colors duration-300 cursor-pointer">MY 사육장</a></li>
              </ul>
            </ul>
          </nav>
        </div>
        <div className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4" id="nav-content">
          <div className="auth flex items-center w-full md:w-full">
            <div className="font-bold text-lg p-2 mr-4 hover:text-green-800 transition-colors duration-300 cursor-pointer">로그인</div>
            <IoMdNotificationsOutline size="30" className="text-gray-800 hover:text-green-800 transition-colors duration-300 cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;