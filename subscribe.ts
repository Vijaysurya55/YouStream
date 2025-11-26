import axios from "axios";

export async function subscribeToChannel(accessToken: string, channelId: string) {
  const url = "https://www.googleapis.com/youtube/v3/subscriptions";
  const body = {
    snippet: {
      resourceId: {
        kind: "youtube#channel",
        channelId,
      },
    },
  };
  const res = await axios.post(url + "?part=snippet", body, {
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  return res.data; 
}
