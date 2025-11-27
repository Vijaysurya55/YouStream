import { Box, Typography } from "@mui/material";
import moment from "moment";

interface Props {
  video: any;
  onClick: (id: string) => void;
}

export default function RelatedVideoItem({ video, onClick }: Props) {
  const id = typeof video.id === "string" ? video.id : video.id?.videoId;
  const snippet = video.snippet || {};
  const stats = video.statistics || {};

  const thumbnail =
    snippet?.thumbnails?.medium?.url ||
    snippet?.thumbnails?.high?.url ||
    snippet?.thumbnails?.default?.url;

  const views = Number(stats.viewCount || 0);

  const formatViews = (v: number) => {
    if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M views";
    if (v >= 1000) return (v / 1000).toFixed(1) + "K views";
    return v + " views";
  };

  return (
    <Box
      display="flex"
      gap={1.25}
      mb={2}
      sx={{
        cursor: "pointer",
        "&:hover": { background: "#fafafa" },
        padding: 0.5,
        borderRadius: 1,
        alignItems: "center",
      }}
      onClick={() => onClick(id)}
    >
      
      <Box
        component="img"
        src={thumbnail}
        sx={{
          width: 140,
          height: 80,
          objectFit: "cover",
          borderRadius: 1.5,
          flexShrink: 0,
        }}
        alt={snippet.title}
      />

     
      <Box flex={1} minWidth={0}>
        <Typography fontSize={13} fontWeight={600} noWrap sx={{ lineHeight: 1.2 }}>
          {snippet.title}
        </Typography>

        <Typography fontSize={12} color="text.secondary" noWrap>
          {snippet.channelTitle}
        </Typography>

        <Typography fontSize={12} color="text.secondary" noWrap>
          {formatViews(views)} • {moment(snippet.publishedAt).fromNow()}
        </Typography>
      </Box>
    </Box>
  );
}
