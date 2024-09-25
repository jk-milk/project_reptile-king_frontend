import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout/Layout'
import Home from './Pages/Home'
import Board from './Pages/Board'
import PostDetail from './Pages/PostDetail'
import PostEdit from './Pages/PostEdit'
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
import PostWrite from './Pages/PostWrite'
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
import MyCageAdd from './Pages/MyCageAdd'
import MyCageEdit from './Pages/MyCageEdit'
import MyReptileEdit from './Pages/MyReptileEdit'
import MyReptileDetail from './Pages/MyReptileDetail'
import MyReptileAdd from './Pages/MyReptileAdd'
import Posts from './Pages/Posts'
import MarketCartPay from './Pages/MarketCartPay'
import MarketCartPaySuccess from './Pages/MarketCartPaySuccess'
import Notifications from './Pages/Notifications'
import MypageOrderContact from './Pages/MypageOrderContact'
import MypageOrderContactDetail from './Pages/MypageOrderContactDetail'

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path='/' element={<Layout />}>
        <Route path='board' element={<Board />} />
        <Route path='board/lists' element={<Posts />} />
        <Route path='board/view/:postId' element={<PostDetail />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='login' element={<SignIn />} />
        <Route path='reset-password' element={<PasswordResetPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='my-cage' element={<MyCage />} />
          <Route path='my-cage/:id' element={<MyCageDetail />} />
          <Route path='my-cage/:id/video' element={<MyCageVideo />} />
          <Route path='my-cage/add' element={<MyCageAdd />} />
          <Route path='my-cage/edit/:id' element={<MyCageEdit />} />
          <Route path='my-cage/reptile/:id' element={<MyReptileDetail />} />
          <Route path='my-cage/reptile/edit/:id' element={<MyReptileEdit />} />
          <Route path='my-cage/reptile/add' element={<MyReptileAdd />} />
          <Route path='mypage' element={<Profile />} />
          <Route path='mypage/order' element={<MypageOrder />} />
          <Route path='mypage/order/contact' element={<MypageOrderContact />} />
          <Route path='mypage/order/contact/detail' element={<MypageOrderContactDetail />} />
          <Route path='mypage/order' element={<MypageOrder />} />
          <Route path='mypage/order/detail' element={<MypageOrderDetail />} />
          <Route path='mypage/order/review' element={<MypageOrderReview />} />
          <Route path='mypage/order/review/create' element={<MypageOrderReviewCreate />} />
          <Route path='mypage/order/review/edit' element={<MypageOrderReviewEdit />} />
          <Route path='mypage/help' element={<MypageHelp />} />
          <Route path='mypage/help/create' element={<MypageHelpCreate />} />
          <Route path='mypage/help/edit' element={<MypageHelpEdit />} />
          <Route path='mypage/help/detail' element={<MypageHelpDetail />} />
          <Route path='board/write' element={<PostWrite />} />
          <Route path='board/edit/:postId' element={<PostEdit />} />
          <Route path='notifications' element={<Notifications />} />

        </Route>
      </Route>
      <Route element={<MarketLayout />}>
        <Route path='market' element={<Market />} />
        <Route path='market/:categoryId' element={<Product />} />
        <Route path='market/:categoryId/:productId' element={<ProductDetails />} />
        <Route path='market/cart' element={<MarketCart />} />
        <Route element={<ProtectedRoute />}>
          <Route path='market/pay/:productId' element={<MarketPay />} />
          <Route path='market/cart/pay' element={<MarketCartPay />} />
          <Route path='market/pay/:productId/success' element={<MarketPaySuccess />} />
          <Route path='market/cart/pay/success' element={<MarketCartPaySuccess />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
