// import { Grid } from '@mui/material'
// import moment from 'moment';
// import {
//     Card,
//     CardContent,
//     CardMedia,
//     Typography,
    
// } from "@mui/material";

// type Props = { videos: any[] }

// const Grids = ({ videos }: Props) => {
//     // const navigate = useNavigate()
//     const displayDate = (date: string) => {
//         const momentObject = moment(date);
//         const relativeTime = momentObject.fromNow();
//         return relativeTime;
//     }
//     const displayViews = (views: string) => {
//         let dispViews = Number(views)
//         if (dispViews >= 1000000) {
//             return (dispViews / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
//         }
//         if (dispViews >= 1000) {
//             return (dispViews / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
//         }
//         return dispViews.toString()
//     }
//     return (
//         <Grid container spacing={2} >
//             {
//                 videos.map((video: any) => {
//                     const id = typeof video.id === 'string' ? video.id : (video.id?.videoId || video.id?.channelId || String(Math.random()));
//                     const thumbnailUrl =
//                         video?.snippet?.thumbnails?.maxres?.url ||
//                         video?.snippet?.thumbnails?.high?.url ||
//                         video?.snippet?.thumbnails?.medium?.url ||
//                         video?.snippet?.thumbnails?.default?.url ||
//                         '';
//                     return (
//                         <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }} key={id}>
//                             <Card 
//                                 // onClick={() => navigate(`${BASE_URL}?${video.id.toString()}`)}
//                                 sx={{
//                                     borderRadius: 3,
//                                     background:
//                                         "linear-gradient(160deg, rgba(25,20,10,0.7), rgba(10,10,10,0.8))",
//                                     backdropFilter: "blur(6px)",
//                                     border: "1px solid rgba(255,165,0,0.2)",
//                                     boxShadow: "0 0 15px rgba(255,140,0,0.15)",
//                                     display: "flex",
//                                     flexDirection: "column",
//                                     justifyContent: "space-between",
//                                     cursor: "pointer",
//                                     transition: "0.3s",
//                                     "&:hover": {
//                                         transform: "scale(1.04)",
//                                         boxShadow: "0 0 25px rgba(255,165,0,0.4)",
//                                     },
//                                 }}>
//                                 <CardMedia
//                                     component="img"
//                                     image={thumbnailUrl}
//                                     alt={video?.snippet?.title || 'video'}
//                                     sx={{
//                                         width: "100%",
//                                         height: { xs: 180, sm: 200, md: 220 },
//                                         objectFit: "cover",
//                                         borderRadius: "8px 8px 0 0",
//                                     }}
//                                 />
//                                 <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
//                                     <Typography
//                                         variant="subtitle1"
//                                         fontWeight="bold"
//                                         noWrap
//                                         sx={{ color: "orange" }}
//                                     >
//                                         {video?.snippet?.title}
//                                     </Typography>
//                                     <Typography
//                                         variant="subtitle2"
//                                         sx={{ color: "rgba(255,255,255,0.7)" }}
//                                         noWrap
//                                     >
//                                         Channel: {video?.snippet?.channelTitle}
//                                     </Typography>
//                                     <Typography
//                                         variant="subtitle2"
//                                         sx={{ color: "rgba(255,255,255,0.7)" }}
//                                         noWrap
//                                     >
//                                         {displayViews(String(video?.statistics?.viewCount ?? 0))} views • {displayDate(video?.snippet?.publishedAt)}
//                                     </Typography>
//                                 </CardContent>

//                             </Card>
//                         </Grid>
//                     )
//                 })
//             }


//         </Grid>
//     )
// }

// export default Grids

// src/Components/Grid.tsx  (replace the current file with this)

import React from "react";
import { Grid,  } from "@mui/material";
import moment from "moment";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type Props = { videos: any[] }

const Grids = ({ videos }: Props) => {
  const navigate = useNavigate();

  const displayDate = (date: string) => {
    const momentObject = moment(date);
    return momentObject.fromNow();
  }

  const displayViews = (views: string) => {
    const dispViews = Number(views || 0);
    if (dispViews >= 1000000) {
      return (dispViews / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (dispViews >= 1000) {
      return (dispViews / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return dispViews.toString();
  }

  const openWatch = (id: string) => {
    
    navigate(`/watch/${encodeURIComponent(id)}`);
    
    window.scrollTo(0, 0);
  }

 
  const onCardKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openWatch(id);
    }
  }

  return (
    <Grid container spacing={2}>
      {videos.map((video: any) => {
        const id = typeof video.id === 'string'
          ? video.id
          : (video.id?.videoId || video.id?.channelId || (video.id?.kind === 'youtube#video' ? video.id : String(Math.random())));

        const thumbnailUrl =
          video?.snippet?.thumbnails?.maxres?.url ||
          video?.snippet?.thumbnails?.high?.url ||
          video?.snippet?.thumbnails?.medium?.url ||
          video?.snippet?.thumbnails?.default?.url ||
          '';

        const title = video?.snippet?.title || "Untitled";
        const channelTitle = video?.snippet?.channelTitle || "";
        const viewCount = video?.statistics?.viewCount ?? 0;
        const publishedAt = video?.snippet?.publishedAt || "";

        return (
          <Grid  xs={12} sm={12} md={6} lg={3} key={id}>
            <Card
              onClick={() => openWatch(String(id))}
              onKeyDown={(e) => onCardKeyDown(e, String(id))}
              role="button"
              tabIndex={0}
              sx={{
                borderRadius: 3,
                background: "linear-gradient(160deg, rgba(25,20,10,0.7), rgba(10,10,10,0.8))",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,165,0,0.2)",
                boxShadow: "0 0 15px rgba(255,140,0,0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.04)",
                  boxShadow: "0 0 25px rgba(255,165,0,0.4)",
                },
                outline: "none",
              }}
            >
              <CardMedia
                component="img"
                image={thumbnailUrl}
                alt={title}
                sx={{
                  width: "100%",
                  height: { xs: 180, sm: 200, md: 220 },
                  objectFit: "cover",
                  borderRadius: "8px 8px 0 0",
                }}
              />
              <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ color: "orange" }}>
                  {title}
                </Typography>

                <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)" }} noWrap>
                  Channel: {channelTitle}
                </Typography>

                <Typography variant="subtitle2" sx={{ color: "rgba(255,255,255,0.7)" }} noWrap>
                  {displayViews(String(viewCount))} views • {displayDate(publishedAt)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default Grids;
