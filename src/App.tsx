import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './Pages/Home'
import Market from './Pages/Market'
import Cage from './Pages/Cage'
import Board from './Pages/Board'

function App() {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path='/' element={<Layout />}>
        <Route path='market' element={<Market/>}/>
        <Route path='cage' element={<Cage/>}/>
        <Route path='board' element={<Board/>}/>
      </Route>
    </Routes>
  )
}

export default App