import { Grid } from '@mui/material'
import moment from 'moment';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    
} from "@mui/material";

type Props = { videos: any[] }

const Grids = ({ videos }: Props) => {
    // const navigate = useNavigate()
    const displayDate = (date: string) => {
        const momentObject = moment(date);
        const relativeTime = momentObject.fromNow();
        return relativeTime;
    }
    const displayViews = (views: string) => {
        let dispViews = Number(views)
        if (dispViews >= 1000000) {
            return (dispViews / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (dispViews >= 1000) {
            return (dispViews / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return dispViews.toString()
    }
    return (
        <Grid container spacing={2} >
            {
                videos.map((video: any) => {
                    const id = typeof video.id === 'string' ? video.id : (video.id?.videoId || video.id?.channelId || String(Math.random()));
                    const thumbnailUrl =
                        video?.snippet?.thumbnails?.maxres?.url ||
                        video?.snippet?.thumbnails?.high?.url ||
                        video?.snippet?.thumbnails?.medium?.url ||
                        video?.snippet?.thumbnails?.default?.url ||
                        '';
                    return (
                        <Grid size={{ xs: 12, sm: 12, md: 6, lg: 3 }} key={id}>
                            <Card 
                                // onClick={() => navigate(`${BASE_URL}?${video.id.toString()}`)}
                                sx={{
                                    borderRadius: 3,
                                    background:
                                        "linear-gradient(160deg, rgba(25,20,10,0.7), rgba(10,10,10,0.8))",
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
                                }}>
                                <CardMedia
                                    component="img"
                                    image={thumbnailUrl}
                                    alt={video?.snippet?.title || 'video'}
                                    sx={{
                                        width: "100%",
                                        height: { xs: 180, sm: 200, md: 220 },
                                        objectFit: "cover",
                                        borderRadius: "8px 8px 0 0",
                                    }}
                                />
                                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        noWrap
                                        sx={{ color: "orange" }}
                                    >
                                        {video?.snippet?.title}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: "rgba(255,255,255,0.7)" }}
                                        noWrap
                                    >
                                        Channel: {video?.snippet?.channelTitle}
                                    </Typography>
                                    <Typography
                                        variant="subtitle2"
                                        sx={{ color: "rgba(255,255,255,0.7)" }}
                                        noWrap
                                    >
                                        {displayViews(String(video?.statistics?.viewCount ?? 0))} views • {displayDate(video?.snippet?.publishedAt)}
                                    </Typography>
                                </CardContent>

                            </Card>
                        </Grid>
                    )
                })
            }


        </Grid>
    )
}

export default Grids