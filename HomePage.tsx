import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTrendingVideos } from '../redux/videos/videoActions';
import type { RootState } from '../redux/rootReducer';
import Grids from '../Components/Grid';
import { Box } from '@mui/material';
const Homepage = () => {

    const store = useSelector((state: RootState) => state.videoState)
    const dispatch = useDispatch<any>()
    useEffect(() => {
        if (store.trending.length === 0)
            dispatch(fetchTrendingVideos())
    }, [store.trending.length]);


    useEffect(() => {
        let scrolled = false
        const threshold = 700 
        const onScroll = () => {
            if (scrolled) return
            scrolled = true
            requestAnimationFrame(() => {
                try {
                    
                    if (store.loading || !store.nextPageToken) return
                    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - threshold
                    if (nearBottom) {
                        dispatch(fetchTrendingVideos(store.nextPageToken))
                    }
                } finally {
                    scrolled = false
                }
            })
        }

        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [store.nextPageToken, store.loading, dispatch]);

    if (store.loading && store.trending.length === 0) {
        return <div className="loading">Loading videos...</div>;
    }

    if (store.error) {
        return <div className="error">Error fetching videos: {store.error}</div>;
    }

    return (

        <Box padding={2}>
            <h1>Trending Videos</h1>
            <Grids videos={store.trending} />
            {store.loading && store.trending.length > 0 && (
                <div style={{ textAlign: 'center', padding: 12 }}>Loading more...</div>
            )}
        </Box>
    );
};

export default Homepage;
