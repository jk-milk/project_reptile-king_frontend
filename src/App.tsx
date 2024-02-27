import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './Pages/Home'
import Market from './Pages/Market'
import Cage from './Pages/Cage'
import Community from './Pages/Community'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='*' element={<Layout />}>
        <Route path='market' element={<Market/>}/>
        <Route path='cage' element={<Cage/>}/>
        <Route path='community' element={<Community/>}/>
      </Route>
    </Routes>
  )
}

export default App