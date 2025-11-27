
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import Homepage from './Pages/HomePage'
import SearchPage from './Pages/SearchPage'
import ChannelSearchPage from './Pages/ChannelSearchPage'
import WatchPage from './Pages/WatchPage'
import LoginPage from './Pages/LoginPage'
import SignupPage from './Pages/SignupPage'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setAuth } from './redux/auth/authActions'

function App() {
  const dispatch = useDispatch<any>();

  
useEffect(() => {
  try {
    
    const authSnap = localStorage.getItem("youstream_current_auth");
    if (authSnap) {
      try {
        const parsed = JSON.parse(authSnap);
        if (parsed && (parsed.user || parsed.token || parsed.provider)) {
          dispatch(setAuth({ user: parsed.user, token: parsed.token ?? null, provider: parsed.provider ?? null }));
          return;
        }
      } catch {}
    }
    const token = localStorage.getItem("youstream_google_token");
    const userStr = localStorage.getItem("youstream_google_user");
    if (token && userStr) {
      const user = JSON.parse(userStr);
      dispatch(setAuth({ user, token, provider: "google" }));
      return;
    }
    const lastLocal = localStorage.getItem("youstream_current_local_email");
    if (lastLocal) {
      const key = "youstream_local_user:" + lastLocal;
      const localUser = localStorage.getItem(key);
      if (localUser) {
        dispatch(setAuth({ user: JSON.parse(localUser), token: null, provider: "local" }));
        return;
      }
    }
  } catch (e) {
    console.warn("rehydrate auth failed", e);
  }
}, [dispatch]);


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='search/videos/:query' element={<SearchPage />} />
        <Route path="/search/channels/:query" element={<ChannelSearchPage />} />
        <Route path="/watch/:id" element={<WatchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
