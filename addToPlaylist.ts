import axios from "axios";

export async function addVideoToPlaylist(accessToken: string, playlistId: string, videoId: string) {
  const url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet";
  const body = {
    snippet: {
      playlistId,
      resourceId: { 
        kind: "youtube#video", 
        videoId 
    },
    },
  };
  const res = await axios.post(url, body, {
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  return res.data;
}
