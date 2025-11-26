import * as types from "./video.types";
import { getMostPopularVideos } from "../../api/youtubeApi";

export const fetchTrendingVideos = (pageToken?: string) => {
  return async (dispatch: any) => {
    dispatch({ type: types.FETCH_TRENDING_VIDEOS_REQUEST });
    try {
      const { items, nextPageToken } = await getMostPopularVideos(pageToken, 12);

      dispatch({
        type: types.FETCH_TRENDING_VIDEOS_SUCCESS,
        payload: {
          items,
          nextPageToken,
          append: Boolean(pageToken),
        },
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      dispatch({ type: types.FETCH_TRENDING_VIDEOS_FAILURE, payload: message });
    }
  };
};
