
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import Homepage from './Pages/HomePage'
import SearchPage from './Pages/SearchPage'
import ChannelSearchPage from './Pages/ChannelSearchPage'
import WatchPage from './Pages/WatchPage'

function App() {
  

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='search/videos/:query' element={<SearchPage />} />
        <Route path="/search/channels/:query" element={<ChannelSearchPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
