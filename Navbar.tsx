import { AppBar, Box, IconButton, Toolbar, ButtonGroup, TextField, InputAdornment } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from "@mui/icons-material/Search"
import logo from '../assets/YouStream.jpg'
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

const Navbar = () => {
    const navigate = useNavigate()
    const [query,setQuery] = useState("")

    const onSearch=()=>{
        const typedQuery = query.trim()
        if(!typedQuery) return
        navigate(`/search/videos/${encodeURIComponent(typedQuery)}`)
    }
    return (
        <div>
            <AppBar position='static' sx={{ bgcolor: 'white' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon sx={{ color: 'black' }} />
                    </IconButton>
                    <Box
                        component="img"
                        sx={{
                            height: 80,
                            width: 80,
                            maxHeight: { xs: 50, md: 80 },
                            maxWidth: { xs: 50, md: 80 },
                            marginRight: 2,
                        }}
                        alt="YouStream"
                        src={logo}
                    />
                    <Box sx={{
                        display:'flex',
                        flexGrow:1,
                        flexDirection:'row',
                        justifyContent:'center'
                    }}>


                        <ButtonGroup variant="contained" aria-label="Basic button group" sx={{
                            borderRadius: '30px',
                            backgroundColor: 'White',

                        }}>
                            <TextField
                                variant="outlined"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search videos..."
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: { xs: "100%", sm: "70%", md: "50%" },
                                    mr: 1,
                                    flexGrow: 1,
                                    borderTopLeftRadius: '40px',
                                    borderBottomLeftRadius: '40px',
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    "& input": { color: "black" },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "40px",
                                        borderTopRightRadius: 0,
                                        borderBottomRightRadius: 0,
                                        "& fieldset": { borderColor: "none" },
                                        "&:hover fieldset": { borderColor: "black" },
                                        "&.Mui-focused fieldset": { borderColor: 'lightgrey' },
                                    },
                                }}
                            />

                            <IconButton 
                            onClick={onSearch}
                            sx={{
                                borderTopLeftRadius: '40px',
                                borderBottomLeftRadius: '40px',
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,

                            }} >
                                <SearchIcon sx={{ color: "orange" }} />
                            </IconButton>
                        </ButtonGroup>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Navbar
