import * as types from "./video.types";

export interface VideoState {
  trending: any[];
  loading: boolean;
  error: string | null;
  nextPageToken: string | null;
}

const initialState: VideoState = {
  trending: [],
  loading: false,
  error: null,
  nextPageToken: null,
};

export default function videoReducer(state = initialState, action: any): VideoState {
  switch (action.type) {
    case types.FETCH_TRENDING_VIDEOS_REQUEST:
      return { ...state, loading: true, error: null };
    case types.FETCH_TRENDING_VIDEOS_SUCCESS: {
      if (action.payload && typeof action.payload === "object" && "items" in action.payload) {
        const { items, nextPageToken, append } = action.payload;
        return {
          ...state,
          trending: append ? [...state.trending, ...(items || [])] : (items || []),
          nextPageToken: nextPageToken ?? null,
          loading: false,
          error: null,
        };
      }
      
      return { ...state, trending: Array.isArray(action.payload) ? action.payload : state.trending, loading: false };
    }
    case types.FETCH_TRENDING_VIDEOS_FAILURE:
      return { ...state, loading: false, error: action.payload ?? "Unknown error" };
    default:
      return state;
  }
}
