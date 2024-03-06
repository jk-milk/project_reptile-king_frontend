import Navbar from './Header/Navbar'
import Body from './Body/Body'
import Footer from './Footer/Footer'
import Banner from './Header/Banner'
import { useLocation } from 'react-router-dom';

const pageTitles: { [key: string]: string[] } = {
  "/board": ["파충류 이모저모", "주인님 같이 놀아요!"],
}

const Layout = () => {
  const location = useLocation();
  const titles = pageTitles[location.pathname];

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
