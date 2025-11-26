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

  async function fetchVideosByIds(ids: string) {
    if (!ids) return [];
    const videosRes = await youtube.get("/videos", {
      params: {
        part: "snippet,statistics,contentDetails",
        id: ids,
      },
    });
    return videosRes.data?.items || [];
  }

  try {
    const detailRes = await youtube.get("/videos", {
      params: { part: "snippet,status", id: videoId },
    });
    const videoItem = (detailRes.data?.items && detailRes.data.items[0]) || null;
    const privacy = videoItem?.status?.privacyStatus;

    if (privacy && privacy !== "public") {
      console.warn("getRelatedVideos: video not public — will fallback to title search", { videoId, privacy });
    } else {
      // 2) Try the preferred relatedToVideoId approach
      try {
        const searchRes = await youtube.get("/search", {
          params: {
            part: "snippet",
            relatedToVideoId: videoId,
            type: "video",
            maxResults,
          },
        });

        const searchItems = searchRes.data?.items || [];
        const ids = searchItems.map((it: any) => it.id?.videoId).filter(Boolean).join(",");

        if (ids) {
          return await fetchVideosByIds(ids);
        }

        // if no ids returned, we'll fall back below
        console.warn("getRelatedVideos: relatedToVideoId returned no ids, falling back", { videoId });
      } catch (err: any) {
        // Log API response body (if present) to help debug the real cause
        console.warn("getRelatedVideos: relatedToVideoId failed, falling back to title search", err?.response?.data || err?.message || err);
      }
    }

    const title = videoItem?.snippet?.title || "";
    const keywords = title.split(/\s+/).slice(0, 6).join(" ").trim(); 

    if (!keywords) return [];

    const fallbackSearch = await youtube.get("/search", {
      params: {
        part: "snippet",
        q: keywords,
        type: "video",
        maxResults,
      },
    });

    const fallbackIds = (fallbackSearch.data?.items || [])
      .map((item: any) => item.id?.videoId)
      .filter(Boolean)
      .join(",");

    if (!fallbackIds) return [];

    return await fetchVideosByIds(fallbackIds);
  } catch (finalErr: any) {
    console.error("getRelatedVideos final failure", finalErr?.response?.data || finalErr?.message || finalErr);
    return [];
  }
}
