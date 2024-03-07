import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './Pages/Home'
import Market from './Pages/Market'
import Product from './Pages/Product'
import Cage from './Pages/Cage'
import Board from './Pages/Board'
import BoardDetail from './Pages/BoardDetail'

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
      </Route>
    </Routes>
  )
}

export default App