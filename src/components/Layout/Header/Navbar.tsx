import { IoMdNotifications } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { API } from "../../../config";
import { apiWithAuth } from "../../common/axios";

function Navbar() {
  const { state, dispatch } = useAuth();
  const { isAuthenticated } = state;
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 드롭다운 버튼 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // event.target이 Node인지 확인
      if (event.target instanceof Node) {
        // dropdownRef.current가 null이 아니고, event.target을 포함하지 않는 경우
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = async () => {
    try {
      const response = await apiWithAuth.post(API + "logout");
      console.log(response);
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({type: 'LOGOUT', token: null, tokenTime: null});
      location.replace("/");
    }
  };

  return (
    <nav className="w-full z-30 bg-white shadow-xl fixed top-0">
      <div className="w-full flex items-center justify-between px-6 py-2">
        <div className="hidden md:flex md:items-center md:w-auto w-full order-3 md:order-1" id="menu">
          <nav>
            <ul className="md:flex items-center justify-between text-base text-black pt-4 md:pt-0">
              <li>
                <Link to="/">
                  <img
                    src="/logo.png"
                    alt="logo"
                    className="mx-4 h-12"
                  />
                </Link>
              </li>
              <ul className="md:flex items-center justify-between px-4">
                <li><Link to="/market" className="inline-block no-underline font-bold text-lg py-2 px-8 lg:-ml-2 hover:text-green-800 transition-colors duration-300 cursor-pointer">마켓</Link></li>
                <li><Link to="/board" className="inline-block no-underline font-bold text-lg py-2 px-8 lg:-ml-2 hover:text-green-800 transition-colors duration-300 cursor-pointer">커뮤니티</Link></li>
                <li><Link to="/my-cage" className="inline-block no-underline font-bold text-lg py-2 px-8 lg:-ml-2 hover:text-green-800 transition-colors duration-300 cursor-pointer">MY 사육장</Link></li>
              </ul>
            </ul>
          </nav>
        </div>
        <div className="order-2 md:order-3 flex flex-wrap items-center justify-end mr-0 md:mr-4" id="nav-content">
          <div className="auth flex items-center w-full md:w-full">
            {isAuthenticated ? (
              // 로그인 한 상태
              <div ref={dropdownRef} className="relative">
                <button 
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center p-2 mr-4 transition-colors duration-300 cursor-pointer">
                  <FaCircleUser size="30" color={isHovered ? "green" : "gray"}/>
                  <span className={isHovered ? "ps-2 text-green-800" : "ps-2"}>{/* 사용자 정보 */}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                    <Link to="/mypage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">마이 페이지</Link>
                    <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">로그아웃</button>
                  </div>
                )}
              </div>
            ) : (
              // 로그인 하지 않은 상태
              <Link to="/login" className="font-bold text-lg p-2 mr-4 hover:text-green-800 transition-colors duration-300 cursor-pointer">로그인</Link>
            )}
            <IoMdNotifications size="30" className="text-gray-800 hover:text-green-800 transition-colors duration-300 cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
