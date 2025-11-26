import axios from "axios";

export async function rateVideo(accessToken: string, videoId: string, rating: "like" | "dislike" | "none") {
  const url = "https://www.googleapis.com/youtube/v3/videos/rate";
  const params = { id: videoId, rating };
  await axios.post(url, null, {
    params,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  
}
