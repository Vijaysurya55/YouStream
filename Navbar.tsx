// import { AppBar, Box, IconButton, Toolbar, ButtonGroup, TextField, InputAdornment } from '@mui/material'
// import MenuIcon from '@mui/icons-material/Menu';
// import SearchIcon from "@mui/icons-material/Search"
// import logo from '../assets/YouStream.jpg'
// import { useNavigate } from "react-router-dom";
// import { useState } from 'react';

// const Navbar = () => {
//     const navigate = useNavigate()
//     const [query,setQuery] = useState("")

//     const onSearch=()=>{
//         const typedQuery = query.trim()
//         if(!typedQuery) return
//         navigate(`/search/videos/${encodeURIComponent(typedQuery)}`)
//     }
//     return (
//         <div>
//             <AppBar position='static' sx={{ bgcolor: 'white' }}>
//                 <Toolbar>
//                     <IconButton
//                         size="large"
//                         edge="start"
//                         color="inherit"
//                         aria-label="open drawer"
//                         sx={{ mr: 2 }}
//                     >
//                         <MenuIcon sx={{ color: 'black' }} />
//                     </IconButton>
//                     <Box
//                         component="img"
//                         sx={{
//                             height: 80,
//                             width: 80,
//                             maxHeight: { xs: 50, md: 80 },
//                             maxWidth: { xs: 50, md: 80 },
//                             marginRight: 2,
//                         }}
//                         alt="YouStream"
//                         src={logo}
//                     />
//                     <Box sx={{
//                         display:'flex',
//                         flexGrow:1,
//                         flexDirection:'row',
//                         justifyContent:'center'
//                     }}>


//                         <ButtonGroup variant="contained" aria-label="Basic button group" sx={{
//                             borderRadius: '30px',
//                             backgroundColor: 'White',

//                         }}>
//                             <TextField
//                                 variant="outlined"
//                                 value={query}
//                                 onChange={(event) => setQuery(event.target.value)}
//                                 placeholder="Search videos..."
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                                 sx={{
//                                     width: { xs: "100%", sm: "70%", md: "50%" },
//                                     mr: 1,
//                                     flexGrow: 1,
//                                     borderTopLeftRadius: '40px',
//                                     borderBottomLeftRadius: '40px',
//                                     borderTopRightRadius: 0,
//                                     borderBottomRightRadius: 0,
//                                     "& input": { color: "black" },
//                                     "& .MuiOutlinedInput-root": {
//                                         borderRadius: "40px",
//                                         borderTopRightRadius: 0,
//                                         borderBottomRightRadius: 0,
//                                         "& fieldset": { borderColor: "none" },
//                                         "&:hover fieldset": { borderColor: "black" },
//                                         "&.Mui-focused fieldset": { borderColor: 'lightgrey' },
//                                     },
//                                 }}
//                             />

//                             <IconButton 
//                             onClick={onSearch}
//                             sx={{
//                                 borderTopLeftRadius: '40px',
//                                 borderBottomLeftRadius: '40px',
//                                 borderTopRightRadius: 0,
//                                 borderBottomRightRadius: 0,

//                             }} >
//                                 <SearchIcon sx={{ color: "orange" }} />
//                             </IconButton>
//                         </ButtonGroup>
//                     </Box>
//                 </Toolbar>
//             </AppBar>
//         </div>
//     )
// }

// export default Navbar


import React, { useEffect, useState } from "react";
import {
  AppBar, Toolbar, IconButton, Box, Button, TextField, InputAdornment,
  Avatar, Menu, MenuItem, Tooltip, Typography, useMediaQuery, useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../assets/YouStream.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/rootReducer";

import { initGoogle, revokeToken } from "../api/googleAuth";
import { loginGoogle } from "../redux/auth/authThunk";
import { signOutAll } from "../redux/auth/authThunk";
export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [query, setQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const auth = useSelector((s: RootState) => s.auth);
  const user = auth?.user;
  const provider = auth?.provider;
  const token = auth?.token;
  

useEffect(() => {
  console.log("NAVBAR auth changed ->", auth);
}, [auth]);

useEffect(() => {
  
  if (!auth?.user) {
    try {
      const snap = localStorage.getItem("youstream_current_auth");
      if (snap) {
        const parsed = JSON.parse(snap);
        if (parsed && (parsed.user || parsed.token || parsed.provider)) {
          
          dispatch({
            type: "AUTH_SET",
            payload: { user: parsed.user, token: parsed.token ?? null, provider: parsed.provider ?? null },
          });
        }
      }
    } catch (e) {
      console.warn("Navbar rehydrate failed", e);
    }
  }
 
}, [auth?.user]);


  useEffect(() => {
    
    initGoogle(async (tokenResponse: any) => {
      if (tokenResponse && tokenResponse.access_token) {
        const accessToken = tokenResponse.access_token;
        try {
          
          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const profile = await res.json();

          await dispatch(loginGoogle(profile, accessToken));

          navigate("/");
        } catch (err) {
          console.error("Failed to fetch google profile", err);
        }
      } else {
        console.warn("Google token callback", tokenResponse);
      }
    });
    
  }, [dispatch, navigate]);

  const doSearch = () => {
    const typed = query.trim();
    if (!typed) return;
    navigate(`/search/videos/${encodeURIComponent(typed)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") doSearch();
  };

  const openMenu = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const handleSignOut = async () => {
    try {
      if (provider === "google" && token) {
        try { await revokeToken(token); } catch (e) { console.warn("revoke failed", e); }
        localStorage.removeItem("youstream_google_token");
        localStorage.removeItem("youstream_google_user");
      }
      
      await dispatch(signOutAll());
      closeMenu();
      navigate("/");
    } catch (e) {
      console.error("signout error", e);
    }
  };

  const avatarLabel = user?.name || user?.email || "";

  return (
    <AppBar position="static" sx={{ bgcolor: "white", color: "black", boxShadow: 1 }}>
      <Toolbar sx={{ px: { xs: 1, sm: 2, md: 4 } }}>
        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>

        <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none", color: "inherit", mr: 2 }}>
          <Box component="img" src={logo} alt="YouStream" sx={{ width: { xs: 36, sm: 48 }, height: { xs: 36, sm: 48 }, borderRadius: 1 }} />
          {!isSmall && <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>YouStream</Typography>}
        </Box>

        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", px: 1 }}>
          <Box sx={{ width: { xs: "100%", sm: "70%", md: "52%" }, maxWidth: 800 }}>
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "white", borderRadius: 5, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search"
                size="small"
                variant="outlined"
                fullWidth
                InputProps={{
                  sx: { borderRadius: 5, "& .MuiOutlinedInput-notchedOutline": { border: "none" }, px: 1, py: { xs: 0.5, sm: 1 } },
                  endAdornment: (<InputAdornment position="end"></InputAdornment>),
                }}
              />
              <IconButton onClick={doSearch} sx={{ px: 2 }}>
                <SearchIcon sx={{ color: "orange" }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box sx={{ ml: 1, display: "flex", alignItems: "center", gap: 1 }}>
          
          {!user && (
            <Button component={Link} to="/login" variant="text" size="small">
              Login
            </Button>
          )}

          
          {user && (
            <>
              <Tooltip title={avatarLabel}>
                <IconButton onClick={openMenu} size="small" sx={{ ml: 1 }}>
                  <Avatar src={user.avatar || ""} alt={user.name || user.email}>
                    {(!user.avatar && (user.name || user.email)) ? (user.name || user.email).charAt(0).toUpperCase() : ""}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu anchorEl={anchorEl} open={menuOpen} onClose={closeMenu} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} PaperProps={{ sx: { minWidth: 180 } }}>
                <MenuItem onClick={() => { closeMenu(); navigate("/profile"); }}>Profile</MenuItem>
                <MenuItem onClick={() => { closeMenu(); navigate("/settings"); }}>Settings</MenuItem>
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
