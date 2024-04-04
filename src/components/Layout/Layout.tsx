import Navbar from './Header/Navbar'
import Body from './Body/Body'
import Footer from './Footer/Footer'
import Banner from './Header/Banner'
import { useLocation } from 'react-router-dom'

const pageTitles: { [key: string]: string[] } = {
  "board": ["파충류 이모저모", "주인님 같이 놀아요!"],
  "signup": ["파충KING", "회원가입"],
  "login": ["파충KING", "로그인"],
  "reset-password": ["파충KING", "비밀번호 찾기"],
  "mypage": ["마이페이지"],
  "mypage/order": ["주문내역"],
  "mypage/order/detail": ["주문내역"],
}

const Layout = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(segment => segment !== '');
  const baseLocation = segments[0];
  const titles = pageTitles[segments.join('/')] || pageTitles[baseLocation];

  return (
    <>
      <Navbar />
      {titles && <Banner titles={titles} />}
      <Body />
      <Footer />
    </>
  )
}

export default Layout
