import { Link } from 'react-router-dom';
import { FaRegCommentDots } from "react-icons/fa";
import { RiShoppingBagLine } from "react-icons/ri";
import { MdOutlinePets } from "react-icons/md";
import { useEffect, useRef, useState } from 'react';
import { apiWithAuth } from '../../common/axios';

const NotificationDropdown = ({ isOpen, setIsOpen, alarms, setAlarms }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef, setIsOpen]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      if (localStorage.getItem("accessToken") == null) return // 로그인되지 않은 상태라면 알림 데이터 가져오지 않기

      try {
        const response = await apiWithAuth.get('alarms');
        console.log(response);

        setAlarms(response.data.alarms);
      } catch (error) {
        console.error('알림 데이터 가져오기 실패:', error);
      }
    };

    fetchNotifications();
  }, []);
  
  const getIconByCategory = (category) => {
    switch (category) {
      case 'reptile_sales':
        return <MdOutlinePets className="mr-2 text-green-500" />;
      case 'market':
        return <RiShoppingBagLine className="mr-2 text-blue-500" />;
      case 'community':
        return <FaRegCommentDots className="mr-2 text-purple-500" />;
      default:
        return null;
    }
  };

  // 알람 확인 함수 
  const checkAlarm = async (alarmId) => {
    try {
      const response = await apiWithAuth.post(`alarms/check-alarm/${alarmId}`);
      console.log(response);
  
      // 알림 확인 후 alarms 상태 업데이트
      setAlarms((prevAlarms) =>
        prevAlarms.map((alarm) =>
          alarm.id === alarmId ? { ...alarm, readed: true } : alarm
        )
      );
    } catch (error) {
      console.error('알림 확인 실패:', error);
    }
  };
  
  return (
    isOpen && (
    <div ref={dropdownRef} className="border border-gray-200 top-8 absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 max-h-64 overflow-auto">
      <div className="px-4 py-3 text-lg font-bold text-black border-b border-gray-200">
        <div className="flex items-center">
          <Link to="/notifications">通知</Link>
          <span className="ml-auto text-sm font-normal text-gray-500">
            {alarms.filter((alarm) => !alarm.readed).length}個 未確認
          </span>
        </div>
      </div>
      {alarms.map((alarm) => (
        <Link
          key={alarm.id}
          to="/notifications"
          className={`flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 transition-colors duration-200 ${
            !alarm.readed ? 'font-bold' : ''  
          }`}
          onClick={() => checkAlarm(alarm.id)}
        >
          {getIconByCategory(alarm.category)}
          <div>
            <div>{alarm.title}</div>
            <div className="text-sm text-gray-500">{alarm.content}</div>
          </div>
        </Link>
      ))}
    </div>
    )
  );
};

export default NotificationDropdown;
