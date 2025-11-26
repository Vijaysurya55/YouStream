import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { searchChannels } from "../api/youtubeApi";
import SearchTabs from "../Components/SearchTabs";

const ChannelSearchPage = () => {
  const { query } = useParams();
  const [channels, setChannels] = useState([]);
  const [nextPageToken, setNext] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    let cancel = false;
    (async () => {
      setLoading(true);
      const res = await searchChannels(query);
      if (!cancel) {
        setChannels(res.channels);
        setNext(res.nextPageToken);
      }
      setLoading(false);
    })();

    return () => { cancel = true; };
  }, [query]);

  return (
    <Box p={2}>
      <Typography variant="h5" mb={2}>
        Channels related to: <strong>{query}</strong>
      </Typography>
        <SearchTabs />
      {loading && <CircularProgress />}

      {channels.map((ch) => (
        <Box key={ch.id.channelId} p={2} border="1px solid #999" mb={2}>
          <img src={ch.snippet.thumbnails.high.url} width="80" />
          <Typography variant="h6">{ch.snippet.title}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ChannelSearchPage;
