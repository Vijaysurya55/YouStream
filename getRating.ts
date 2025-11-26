
import axios from "axios";
export async function getRating(accessToken: string, videoIds: string[]) {
  const url = "https://www.googleapis.com/youtube/v3/videos/getRating";
  const params = { id: videoIds.join(",") };
  const res = await axios.get(url, { params, headers: { Authorization: `Bearer ${accessToken}` } });
  return res.data; 
}
