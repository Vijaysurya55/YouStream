import axios from "axios";

export interface SearchResult {
  videos: any[]; 
  nextPageToken?: string | null;
}

const API_KEY = import.meta.env.VITE_YT_API_KEY as string;
if (!API_KEY) {
  console.warn("API key error");
}

const youtube = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    key: API_KEY,
  },
  
});

export type RawYouTubeVideo = any;

export async function getMostPopularVideos(pageToken?: string, maxResults = 12) {
  const params: Record<string, string | number> = {
    part: "snippet,statistics",
    chart: "mostPopular",
    regionCode: "IN",
    maxResults,
  };
  if (pageToken) (params).pageToken = pageToken;

  const res = await youtube.get("/videos", { params });
  return {
    items: res.data?.items ?? [],
    nextPageToken: res.data?.nextPageToken ?? null,
  };
}

export async function searchVideos(query: string, pageToken?: string , maxResults = 12): Promise<SearchResult> {
  if (!query || query.trim().length === 0) return { videos: [], nextPageToken: null };

  const searchParams: Record<string, string | number> = {
    part: "snippet",
    q: query,
    type: "video",
    maxResults,
  };
  if (pageToken) (searchParams).pageToken = pageToken;

  const searchRes = await youtube.get("/search", { params: searchParams });
  const items = searchRes.data?.items ?? [];
  const nextPageToken = searchRes.data?.nextPageToken ?? null;

  const videoIds = items
    .map((video: any) => video.id?.videoId)
    .filter(Boolean)
    .join(",");

  if (!videoIds) return { videos: [], nextPageToken };

  const videosRes = await youtube.get("/videos", {
    params: {
      part: "snippet,statistics,contentDetails",
      id: videoIds,
      maxResults,
    },
  });

  return {
    videos: videosRes.data?.items ?? [],
    nextPageToken,
  };
}

export async function searchChannels(query: string, pageToken?: string, maxResults = 12) {
  const params: Record<string, string | number> = {
    part: "snippet",
    q: query,
    type: "channel",
    maxResults,
  };
  if (pageToken) params.pageToken = pageToken;

  const res = await youtube.get("/search", { params });
  return {
    channels: res.data?.items || [],
    nextPageToken: res.data?.nextPageToken || null,
  };
}


export async function getVideoDetails(videoId: string) {
  if (!videoId) return null;
  const params :Record<string, string | number>= {
        part: "snippet,statistics,contentDetails",
        id: videoId,
  }
  const res = await youtube.get("/videos", {params});
  return (res.data?.items && res.data.items[0]) || null;
}

export async function getRelatedVideos(videoId: string, maxResults = 12) {
  if (!videoId) return [];
  let params:Record <string, string|number>={
    part: "snippet",
      relatedToVideoId: videoId,
      type: "video",
      maxResults,
  }
  const searchRes = await youtube.get("/search", {params});

  const searchItems = searchRes.data?.items || [];
  const ids = searchItems
    .map((it: any) => it.id?.videoId)
    .filter(Boolean)
    .join(",");

  if (!ids) return [];
  params = {
      part: "snippet,statistics,contentDetails",
      id: ids,
  }
  const videosRes = await youtube.get("/videos", { params});

  return videosRes.data?.items || [];
}