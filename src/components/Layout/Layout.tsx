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
}

const Layout = () => {
  const location = useLocation();
  const baseLocation = location.pathname.split('/')[1]; // url에서 첫 번째 세그먼트만 가져오기
  const titles = pageTitles[baseLocation];

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
