import { useState, useEffect } from 'react';
import { apiWithAuth } from '../components/common/axios';
import { API } from '../config';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const filterButtons = [
    {
      name: 'すべて',
      type: 'all',
    }, 
    {
      name: '爬虫類登録',
      type: 'reptile_registration',
    }, 
    {
      name: '爬虫類譲渡',
      type: 'reptile_sales',
    }, 
    {
      name: '飼育場の温湿度',
      type: 'temp_abnormality',
    }, 
    {
      name: 'ログイン通知',
      type: 'login',
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const koreaDate = new Date(date.getTime() - (9 * 60 * 60 * 1000)); // GMT+9 시간 보정
    const month = koreaDate.getMonth() + 1;
    const day = koreaDate.getDate();
    const hours = koreaDate.getHours();
    const minutes = koreaDate.getMinutes();
    return `${month}月 ${day}日 ${hours}時 ${minutes}分`;
  };
  
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

  // 알림 유형별 필터링
  const filteredNotifications = filterType === 'all'
    ? notifications
    : notifications.filter((notification) => notification.category === filterType);

  console.log(filteredNotifications);

  // 분양 수락
  async function handleAccept(notificationId: number): Promise<void> {
    try {
      const response = await apiWithAuth.post(`${API}alarms/accept-reptile-sale/${notificationId}`);
      console.log(response);
      navigate("/my-cage"); // 분양 수락 시 내 사육장 페이지로 이동
    } catch (error) {
      console.error('분양 수락 중 실패.', error);
      throw error;
    }
  }

  async function handleReject(notificationId: number): Promise<void> {
    try {
      const response = await apiWithAuth.post(`${API}alarms/reject-reptile-sale/${notificationId}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.error('분양 거절 중 실패.', error);
      throw error;
    }
  }

  // 알람 확인 함수 
  const checkAlarm = async (alarmId) => {
    try {
      const response = await apiWithAuth.post(`alarms/check-alarm/${alarmId}`);
      console.log(response);
  
      // 알림 확인 후 alarms 상태 업데이트
      setNotifications((prevAlarms) =>
        prevAlarms.map((alarm) =>
          alarm.id === alarmId ? { ...alarm, readed: true } : alarm
        )
      );
    } catch (error) {
      console.error('알림 확인 실패:', error);
    }
  };

  // 알람 전체 확인
  async function checkAllAlarms(): Promise<void> {
    try {
      const response = await apiWithAuth.post(`${API}alarms/check-all-alarms`);
      console.log(response);
      navigate(0);
      return response.data;
    } catch (error) {
      console.error('알람 전체 확인 중 실패.', error);
      throw error;
    }
  }

  return (
    <div className="pt-10 pb-10 laptop:w-[67.5rem] w-body m-auto min-h-screen">
      <div className="bg-white rounded mt-20 px-5 py-4">
        <header className="notifications-header">
          <h1 className="mt-0">通知</h1>
          <div className="flex justify-between mb-4">
            <div className="flex justify-start space-x-2">
              {filterButtons.map((button) => (
                <button
                  key={button.name}
                  className={`bg-white px-4 py-1 rounded-full border transition-colors duration-300 flex items-center justify-center ${
                    filterType === button.type
                      ? 'text-blue-500 border-blue-500 '
                      : 'border-gray-500 hover:bg-blue-200 hover:text-blue-500 hover:border-blue-500'
                  }`}
                  onClick={() => setFilterType(button.type)}
                >
                  {button.name}
                </button>
              ))}
            </div>
            <button
              className="bg-white px-2 py-1 rounded-md hover:bg-gray-300 border border-gray-500 transition-colors duration-300 flex items-center justify-center"
              onClick={checkAllAlarms}
            >
              すべて確認
            </button>
          </div>
        </header>

        <div className="mt-10">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`${notification.readed 
                ? 'bg-gray-100 hover:bg-gray-200' 
                : 'bg-white hover:bg-gray-100'
              } rounded-lg shadow-md p-4 mb-4 cursor-pointer`}
              onClick={() => checkAlarm(notification.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`${notification.readed 
                    ? "text-gray-400 mb-2 mr-2"
                    : "font-bold mb-2 mr-2"
                  }`}>{notification.title}</span>
                  <span className={`${notification.readed
                    ? "text-gray-400 mb-2"
                    : "text-gray-600 mb-2"
                  }`}>{formatDate(notification.created_at)}</span>
                  <div className={`${notification.readed
                    ? "text-gray-400 mb-4"
                    : "mb-4"
                  }`}>{notification.content}</div>
                </div>
                {notification.category === 'reptile_sales'&& notification.title !== '爬虫類の譲渡完了' && (
                  <div className="notification-actions">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-2 mr-2"
                      onClick={() => handleAccept(notification.id)}
                    >
                      承諾
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2"
                      onClick={() => handleReject(notification.id)}
                    >
                      拒否
                    </button>
                  </div>
                )}
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
