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



export async function getMostPopularVideos(pageToken?: string, maxResults = 12) {
  const params: Record<string, string | number> = {
    part: "snippet,statistics",
    chart: "mostPopular",
    regionCode: "IN",
    maxResults,
  };
  if (pageToken) 
    (params).pageToken = pageToken;

  const res = await youtube.get("/videos", { params });
  return {
    items: res.data?.items ?? [],
    nextPageToken: res.data?.nextPageToken ?? null,
  };
}

export async function searchVideos(query: string, pageToken?: string , maxResults = 12): Promise<SearchResult> {
  if (!query || query.trim().length === 0) 
    return { 
  videos: [], 
  nextPageToken: null 
};

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

const RELATED_CACHE_KEY_PREFIX = "youstream_related_v2:"; 
const RELATED_CACHE_TTL_MS = 259200000; 

function readRelatedCache(key: string) {
  try {
    const cachedItems = localStorage.getItem(key);
    if (!cachedItems) return null;
    const parsed = JSON.parse(cachedItems);
    if (Date.now() - (parsed.ts || 0) > RELATED_CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.items || null;
  } catch {
    return null;
  }
}

function writeRelatedCache(key: string, items: any[]) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), items }));
  } catch {}
}


export async function getRelatedVideos(videoId: string, maxResults = 12) {
  if (!videoId) return [];

  const cacheKey = RELATED_CACHE_KEY_PREFIX + videoId;
  const cached = readRelatedCache(cacheKey);
  if (cached) return cached;

  try {
    const detailRes = await youtube.get("/videos", {
      params: { part: "snippet", id: videoId },
    });
    const v = (detailRes.data?.items && detailRes.data.items[0]) || null;
    const snippet = v?.snippet || {};
    const channelId = snippet.channelId;
    const categoryId = snippet.categoryId;
    const tags: string[] = snippet.tags || [];
    const title = snippet.title || "";

    const baseSearchParams: Record<string, string | number> = {
      part: "snippet",
      type: "video",
      maxResults,
    };

    if (channelId) {
      (baseSearchParams as any).channelId = channelId;
    } else if (categoryId) {
      (baseSearchParams as any).videoCategoryId = categoryId;
    } else if (tags.length) {
      (baseSearchParams as any).q = tags.slice(0, 5).join(" ");
    } else {
      const keywords = title.split(/\s+/).slice(0, 6).join(" ");
      (baseSearchParams as any).q = keywords || title;
    }

    const searchRes = await youtube.get("/search", { params: baseSearchParams });
    const searchItems = searchRes.data?.items || [];

    const idsArray = Array.from(
      new Set(
        searchItems
          .map((it: any) => (typeof it.id === "string" ? it.id : it.id?.videoId))
          .filter(Boolean)
          .filter((id: string) => id !== videoId)
      )
    );

    if (!idsArray.length) {
      writeRelatedCache(cacheKey, []); 
      return [];
    }

    const idsStr = idsArray.join(",");

    const videosRes = await youtube.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        id: idsStr,
      },
    });

    const fullItems = videosRes.data?.items || [];

    writeRelatedCache(cacheKey, fullItems);

    return fullItems;
  } catch (err: any) {
    console.warn("getRelatedVideos (full fetch) failed, returning empty:", err?.response?.data || err?.message || err);
    return [];
  }
}
