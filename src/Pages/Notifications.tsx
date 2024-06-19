import { useState, useEffect } from 'react';
import { apiWithAuth } from '../components/common/axios';

const NotificationsPage = () => {
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
  const [filterType, setFilterType] = useState('all');

  // 알림 읽음 처리
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // 알림 유형별 필터링
  const filteredNotifications = filterType === 'all'
    ? notifications
    : notifications.filter((notification) => notification.category === filterType);

  console.log(filteredNotifications);
  

  return (
    <div className="pt-10 pb-10 laptop:w-[67.5rem] w-body m-auto">
      <div className="bg-white rounded mt-20 px-5 py-4">

      <header className="notifications-header">
        <h1 className="mt-0">알림</h1>
        <div className="notification-filter">
          <button
            className={filterType === 'all' ? 'active' : ''}
            onClick={() => setFilterType('all')}
          >
            전체
          </button>
          <button
            className={filterType === 'reptiles' ? 'active' : ''}
            onClick={() => setFilterType('reptiles')}
          >
            파충류 등록
          </button>
          <button
            className={filterType === 'reptile_sales' ? 'active' : ''}
            onClick={() => setFilterType('reptile_sales')}
          >
            파충류 분양 신청
          </button>
          <button
            className={filterType === 'temp_abnormality' ? 'active' : ''}
            onClick={() => setFilterType('temp_abnormality')}
          >
            사육장 온도
          </button>
          <button
            className={filterType === 'login' ? 'active' : ''}
            onClick={() => setFilterType('login')}
          >
            로그인 알림
          </button>
        </div>
      </header>

      <div className="mt-20">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification-item ${
              notification.readed ? 'true' : 'false'
            }`}
            onClick={() => markAsRead(notification.id)}
          >
            <div className="notification-type">{notification.category}</div>
            <div className="notification-date">{notification.created_at}</div>
            <div className="notification-message">{notification.content}</div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
