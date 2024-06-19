import { IoMdNotifications } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useRef, useEffect } from "react";
import { API } from "../../../config";
import { apiWithAuth } from "../../common/axios";
import { BiSolidCart } from "react-icons/bi";
import NotificationDropdown from "./NotificationDropdown";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../../services/firebase";

function Navbar() {
  const navigate = useNavigate();
  const { state, dispatch } = useAuth();
  const { isAuthenticated } = state;
  const [isHovered, setIsHovered] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationDropdownRef = useRef<HTMLDivElement | null>(null);

  function initializeNotificationListener() {
    console.log("initializeNotificationListener");

    onMessage(messaging, async (payload) => {
      console.log("알림 도착 ", payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body
      };

      if (Notification.permission === "granted") {
        new Notification(notificationTitle, notificationOptions);
      }
      // 알림 데이터 업데이트
      try {
        if (localStorage.getItem("accessToken") == null) return
        const response = await apiWithAuth.get('alarms');
        setNotifications(response.data.alarms);
      } catch (error) {
        console.error('알림 데이터 가져오기 실패:', error);
      }
    });
  }

  initializeNotificationListener();

  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      if (localStorage.getItem("accessToken") == null) return // 로그인되지 않은 상태라면 알림 데이터 가져오지 않기

      try {
        const response = await apiWithAuth.get('alarms');
        console.log(response);

        setNotifications(response.data.alarms);
      } catch (error) {
        console.error('알림 데이터 가져오기 실패:', error);
      }
    };

    fetchNotifications();
  }, []);

  // 드롭다운 버튼 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // event.target이 Node인지 확인
      if (event.target instanceof Node) {
        // dropdownRef.current가 null이 아니고, event.target을 포함하지 않는 경우
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setDropdownOpen(false);
        }
        if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
          setNotificationDropdownOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, notificationDropdownRef]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      const response = await apiWithAuth.post(API + "logout", {
        headers: {
          'Refresh-Token': refreshToken
        }
      });
      console.log(response);
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: 'LOGOUT', accessToken: null, refreshToken: null });
      alert("로그아웃 되었습니다.")
      navigate('/');
    }
  };

  const handleNotificationClick = () => {
    if (!isAuthenticated) {
      alert("로그인해 주세요!");
      navigate('/login');
    } else {
      setNotificationDropdownOpen(!notificationDropdownOpen);
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
                    // src="/logo.png"
                    src="https://avatars.githubusercontent.com/u/158139668?s=400&u=740c66cc2feb195bc7a3bac1ab9f745b78d74de4&v=4"
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
              <div className="relative flex items-center">
                <button
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center p-2 transition-colors duration-300 cursor-pointer" // 아이콘 간격 조절
                >
                  <div className={`transition-colors duration-300 ${isHovered ? "text-green-800" : "text-gray-500"}`}>
                    <FaCircleUser size="30" />
                  </div>
                  <span className={`ps-2 transition-colors duration-300 ${isHovered ? "text-green-800" : ""}`}>{/* 사용자 정보 */}
                  </span>
                </button>
                {dropdownOpen && (
                  <div ref={dropdownRef} className="border border-gray-200 absolute top-0.5 right-10 mt-12 py-2 w-48 bg-white rounded-md shadow-xl z-20"> {/* 드롭다운 위치 조절 */}
                    <Link to="/mypage" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">마이 페이지</Link>
                    <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">로그아웃</button>
                  </div>
                )}
                <button>
                  <Link to="/market/cart"><BiSolidCart size="30" className="mr-4 text-gray-800 hover:text-green-800 transition-colors duration-300 cursor-pointer" /></Link>
                </button>
              </div>
            ) : (
              // 로그인 하지 않은 상태
              <Link to="/login" className="font-bold text-lg p-2 mr-4 hover:text-green-800 transition-colors duration-300 cursor-pointer">로그인</Link>
            )}
            <div className="relative">
              <div className="relative">
                <IoMdNotifications
                  size="30"
                  className="text-gray-800 hover:text-green-800 transition-colors duration-300 cursor-pointer"
                  onClick={handleNotificationClick}
                />
                {notifications.filter((notification) => !notification.readed).length > 0 && (
                  <div className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                    {notifications.filter((notification) => !notification.readed).length}
                  </div>
                )}
              </div>
              {notificationDropdownOpen && <NotificationDropdown alarms={notifications} />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
