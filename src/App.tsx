import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Home from './Pages/Home'
import Board from './Pages/Board'
import BoardDetail from './Pages/BoardDetail'
import BoardModify from './Pages/BoardModify'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import PasswordResetPage from './Pages/PasswordResetPage'
import Profile from './Pages/Profile'
import MypageOrder from './Pages/MypageOrder'
import MypageOrderDetail from './Pages/MypageOrderDetail'
import MarketLayout from './components/Layout/MarketLayout'
import Market from './Pages/Market'
import Product from './Pages/Product'
import ProductDetails from './Pages/ProductDetails'
import MarketCart from './Pages/MarketCart'
import MarketPay from './Pages/MarketPay'
import MarketPaySuccess from './Pages/MarketPaySuccess'
import BoardWrite from './Pages/BoardWrite'
import MyCage from './Pages/MyCage'
import MyCageDetail from './Pages/MyCageDetail'
import MypageOrderReview from './Pages/MypageOrderReview'
import MypageHelp from './Pages/MypageHelp'
import MypageOrderReviewCreate from './Pages/MypageOrderReviewCreate'
import MypageOrderReviewEdit from './Pages/MypageOrderReviewEdit'
import MypageHelpCreate from './Pages/MypageHelpCreate'
import MypageHelpEdit from './Pages/MypageHelpEdit'
import MypageHelpDetail from './Pages/MypageHelpDetail'
import MyCageVideo from './Pages/MyCageVideo'

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path='/' element={<Layout />}>
        <Route path='board' element={<Board />} />
        <Route path='board/lists' element={<Board />} />
        <Route path='board/view' element={<BoardDetail />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='login' element={<SignIn />} />
        <Route path='reset-password' element={<PasswordResetPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='my-cage' element={<MyCage />} />
          <Route path='my-cage/:id' element={<MyCageDetail />} />
          <Route path='my-cage/:id/video' element={<MyCageVideo />} />
          <Route path='mypage' element={<Profile />} />
          <Route path='mypage/order' element={<MypageOrder />} />
          <Route path='mypage/order/detail' element={<MypageOrderDetail />} />
          <Route path='mypage/order/review' element={<MypageOrderReview />} />
          <Route path='mypage/order/review/create' element={<MypageOrderReviewCreate />} />
          <Route path='mypage/order/review/edit' element={<MypageOrderReviewEdit />} />
          <Route path='mypage/help' element={<MypageHelp />} />
          <Route path='mypage/help/create' element={<MypageHelpCreate />} />
          <Route path='mypage/help/edit' element={<MypageHelpEdit />} />
          <Route path='mypage/help/detail' element={<MypageHelpDetail />} />
          <Route path='board/write' element={<BoardWrite />} />
          <Route path='board/modify' element={<BoardModify />} />
        </Route>
      </Route>
      <Route element={<MarketLayout />}>
        <Route path='market' element={<Market />} />
        <Route path='market/:categoryName' element={<Product />} />
        <Route path='market/:categoryName/:id' element={<ProductDetails />} />
        <Route path='market/cart' element={<MarketCart />} />
        <Route path='market/pay' element={<MarketPay />} />
        <Route path='market/pay/success' element={<MarketPaySuccess />} />
      </Route>
    </Routes>
  )
}

export default App
