import { Box, Chip } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const SearchTabs = () => {
  const navigate = useNavigate();
  const { query } = useParams();
  const location = useLocation();

  const q = query || "";

  const goToVideos = () => navigate(`/search/videos/${encodeURIComponent(q)}`);
  const goToChannels = () => navigate(`/search/channels/${encodeURIComponent(q)}`);

  const isVideosActive = location.pathname.startsWith("/search/videos");
  const isChannelsActive = location.pathname.startsWith("/search/channels");

  return (
    <Box display="flex" gap={1} mb={2}>
        <Chip variant="filled" label={"Videos"} onClick={goToVideos} sx={{
            bgcolor: isVideosActive?"black" :"white",
            color:isVideosActive?"white" :"black",
            '&:hover':{
                bgcolor: isVideosActive?"lightgrey" :"black",
                color:isVideosActive?"black" :"white",
            }
        }} />
        <Chip variant="filled" label={"Channels"} onClick={goToChannels} sx={{
            bgcolor: isChannelsActive?"black" :"white",
            color:isChannelsActive?"white" :"black",
            '&:hover':{
                bgcolor: isChannelsActive?"lightgrey" :"black",
                color:isChannelsActive?"black" :"white",

            }
        }}/>

    </Box>
  );
};

export default SearchTabs;
