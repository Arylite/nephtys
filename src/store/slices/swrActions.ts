import { createAction } from "@reduxjs/toolkit";
import Webtoon from "@/store/slices/webtoonSlice";

// Action creators for SWR integration
export const setFeaturedWebtoons = createAction<(typeof Webtoon)[]>(
  "webtoons/setFeaturedWebtoons"
);
export const setLatestWebtoons = createAction<(typeof Webtoon)[]>(
  "webtoons/setLatestWebtoons"
);
export const setWebtoonById = createAction<typeof Webtoon>(
  "webtoons/setWebtoonById"
);
