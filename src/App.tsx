import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './Pages/Home'
import Market from './Pages/Market'
import Product from './Pages/Product'
import Cage from './Pages/Cage'
import Board from './Pages/Board'
import BoardDetail from './Pages/BoardDetail'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import PasswordResetPage from './Pages/PasswordResetPage'
import Profile from './Pages/Profile'

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path='/' element={<Layout />}>
        <Route path='market' element={<Market />} />
        <Route path='market/:categoryName' element={<Product />} />
        <Route path='cage' element={<Cage />} />
        <Route path='board' element={<Board />} />
        <Route path='board/:detailId' element={<BoardDetail />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='login' element={<SignIn />} />
        <Route path='reset-password' element={<PasswordResetPage />} />
        <Route path='mypage' element={<Profile />} />
      </Route>
    </Routes>
  )
}

export default App