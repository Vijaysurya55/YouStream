import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, Divider } from "@mui/material";
import moment from "moment";
import { getVideoDetails, getRelatedVideos } from "../api/youtubeApi";
import RelatedVideoItem from "../Components/RelatedVideoItem";


const LOCAL_LIKES_KEY = "youstream_likes_v1"; 
const LOCAL_SUBS_KEY = "youstream_subs_v1"; 

function readLikes(): Record<string, "like" | "dislike"> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_LIKES_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeLikes(obj: Record<string, "like" | "dislike">) {
  localStorage.setItem(LOCAL_LIKES_KEY, JSON.stringify(obj));
}

function readSubs(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SUBS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeSubs(arr: string[]) {
  localStorage.setItem(LOCAL_SUBS_KEY, JSON.stringify(arr));
}

const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [video, setVideo] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [likesMap, setLikesMap] = useState<Record<string, "like" | "dislike">>(readLikes());
  const [subs, setSubs] = useState<string[]>(readSubs());

  useEffect(() => {
    
    if (!id) return;
    let canceled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const v = await getVideoDetails(id);
        if (canceled) return;
        setVideo(v);
      } catch (err: any) {
        if (canceled) return;
        setError(err?.message ?? "Failed to load video");
      } finally {
        if (!canceled) setLoading(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let canceled = false;
    (async () => {
      setLoadingRelated(true);
      try {
        const items = await getRelatedVideos(id, 12);
        const filtered = items.filter((v :any)=> v.id !== id);
        if (canceled) return;
        setRelated(filtered);
      } catch (err) {
        console.error("related error", err);
      } finally {
        if (!canceled) setLoadingRelated(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [id]);

  
  const getLikeState = () => likesMap[id || ""] || null;
  const toggleLike = (type: "like" | "dislike") => {
    if (!id) return;
    const cur = likesMap[id];
    const newMap = { ...likesMap };
    if (cur === type) {
      
      delete newMap[id];
    } else {
      newMap[id] = type;
    }
    setLikesMap(newMap);
    writeLikes(newMap);
  };

  const isSubscribed = (channelId: string | undefined) => {
    if (!channelId) return false;
    return subs.includes(channelId);
  };

  const toggleSubscribe = (channelId: string | undefined) => {
    if (!channelId) return;
    const list = [...subs];
    const idx = list.indexOf(channelId);
    if (idx === -1) {
      list.push(channelId);
    } else {
      list.splice(idx, 1);
    }
    setSubs(list);
    writeSubs(list);
  };

  const openRelated = (videoId: string) => {
    
    navigate(`/watch/${videoId}`);
    window.scrollTo(0, 0); 
  };

  
  const formatViews = (nStr: string | number | undefined) => {
    const n = Number(nStr || 0);
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M views";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "K views";
    return n + " views";
  };

  // const durationToLabel = (iso: string | undefined) => {
    
  //   try {
  //     if (!iso) return "";
      
  //     const d = moment.duration(iso);
  //     const hours = d.hours();
  //     const minutes = d.minutes();
  //     const seconds = d.seconds();
  //     const hh = hours ? `${hours}:` : "";
  //     const mm = hours ? String(minutes).padStart(2, "0") : String(minutes);
  //     const ss = String(seconds).padStart(2, "0");
  //     return hh + mm + ":" + ss;
  //   } catch {
  //     return "";
  //   }
  // };

  if (!id) return <Box p={2}>No video selected</Box>;

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!video) {
    return (
      <Box p={2}>
        <Typography>No video data</Typography>
      </Box>
    );
  }

  const snippet = video.snippet || {};
  const stats = video.statistics || {};
  const channelId = snippet.channelId;

   return (
    <Box
      p={2}
      display="grid"
      gridTemplateColumns={{ xs: "1fr", md: "4fr 1fr" }}
      gap={2}
      alignItems="start"
    >
    
      <Box >
        <Box sx={{ position: "relative", paddingTop: "56.25%", background: "#000", borderRadius: 1, overflow: "hidden" }}>
          <iframe
            title={snippet.title || "video player"}
            src={`https://www.youtube.com/embed/${id}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
            allowFullScreen
          />
        </Box>

        <Typography variant="h6" mt={2} sx={{ fontWeight: 700 }}>
          {snippet.title}
        </Typography>

        <Box display="flex" gap={2} alignItems="center" mt={1}>
          <Box>
            <Typography variant="subtitle2">{snippet.channelTitle}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatViews(stats.viewCount)} • {moment(snippet.publishedAt).fromNow()}
            </Typography>
          </Box>

          <Box marginLeft="auto" display="flex" gap={1}>
            
            <Button
              variant={getLikeState() === "like" ? "contained" : "outlined"}
              onClick={() => toggleLike("like")}
            >
              👍 Like
            </Button>
            <Button
              variant={getLikeState() === "dislike" ? "contained" : "outlined"}
              onClick={() => toggleLike("dislike")}
            >
              👎 Dislike
            </Button>
            <Button
              color="primary"
              variant={isSubscribed(channelId) ? "contained" : "outlined"}
              onClick={() => toggleSubscribe(channelId)}
            >
              {isSubscribed(channelId) ? "Subscribed" : "Subscribe"}
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
          {snippet.description}
        </Typography>
      </Box>

      
      <Box>
        <Typography variant="subtitle1" mb={1}>
          Related
        </Typography>

        {loadingRelated && <CircularProgress size={20} />}

        {!loadingRelated && related.length === 0 && <Typography>No related videos found</Typography>}

        {!loadingRelated && related.length > 0 && (
          <Box
            sx={{
              maxHeight: "calc(100vh - 180px)", 
              overflowY: "auto",
              pr: 1,
            }}
          >
            {related.map((video, index) => (
              <RelatedVideoItem key={index} video={video} onClick={openRelated} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );

};

export default WatchPage;
