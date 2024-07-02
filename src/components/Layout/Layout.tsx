import Navbar from './Header/Navbar'
import Body from './Body/Body'
import Footer from './Footer/Footer'
import Banner from './Header/Banner'
import { useLocation } from 'react-router-dom'

const pageTitles: { [key: string]: string[] } = {
  "board": ["爬虫類のあれこれ", "一緒に遊びましょう！"],
  "signup": ["ハチュウキング", "会員登録"],
  "login": ["ハチュウキング", "ログイン"],
  "reset-password": ["ハチュウキング", "パスワードの再設定"],
  "mypage": ["マイページ"],
  "mypage/order": ["주문내역"],
  "mypage/order/detail": ["주문내역"],
  "mypage/order/contact": ["취소/반품/교환/환불내역"],
  "mypage/order/contact/detail": ["취소/반품/교환/환불내역"],
  "mypage/order/review": ["리뷰관리"],
  "mypage/order/review/create": ["리뷰관리"],
  "mypage/order/review/edit": ["리뷰관리"],
  "mypage/help": ["Q & A"],
  "mypage/help/create": ["Q & A"],
  "mypage/help/edit": ["Q & A"],
  "mypage/help/detail": ["Q & A"],
  "my-cage": ["MY CAGE"],
  "my-cage/:id": ["MY CAGE"],
  "my-cage/:id/video": ["MY CAGE"],
  "my-cage/add": ["MY CAGE"],
  "my-cage/edit": ["MY CAGE"],
  "my-cage/reptile": ["MY CAGE"],
  "my-cage/reptile/edit": ["MY CAGE"],
  "my-cage/reptile/add": ["MY CAGE"],
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
