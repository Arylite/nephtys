import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

type Webtoon = {
  id: string;
  title: string;
  description: string | null;
  author: string;
  coverImage: string | null;
  status: "ONGOING" | "COMPLETED" | "HIATUS" | "DROPPED";
};

type WebtoonState = {
  webtoons: Webtoon[];
  featuredWebtoons: Webtoon[];
  latestWebtoons: Webtoon[];
  selectedWebtoon: Webtoon | null;
  favorites: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalPages: number;
  currentPage: number;
};

const initialState: WebtoonState = {
  webtoons: [],
  featuredWebtoons: [],
  latestWebtoons: [],
  selectedWebtoon: null,
  favorites: [],
  status: 'idle',
  error: null,
  totalPages: 0,
  currentPage: 1,
};

// Async thunks for fetching data
export const fetchWebtoons = createAsyncThunk(
  'webtoons/fetchWebtoons',
  async (page: number = 1) => {
    const response = await fetch(`/api/webtoon?page=${page}`);
    const data = await response.json();
    
    // Extract pagination info from headers
    const totalCount = response.headers.get('X-Total-Count');
    const totalPages = response.headers.get('X-Total-Pages');
    
    return {
      webtoons: data,
      totalCount: totalCount ? parseInt(totalCount) : 0,
      totalPages: totalPages ? parseInt(totalPages) : 0,
      currentPage: page,
    };
  }
);

export const fetchFeaturedWebtoons = createAsyncThunk(
  'webtoons/fetchFeaturedWebtoons',
  async () => {
    const response = await fetch('/api/webtoon?limit=6');
    return await response.json();
  }
);

export const fetchLatestWebtoons = createAsyncThunk(
  'webtoons/fetchLatestWebtoons',
  async () => {
    const response = await fetch('/api/webtoon?limit=8&latest=true');
    return await response.json();
  }
);

export const fetchWebtoonById = createAsyncThunk(
  'webtoons/fetchWebtoonById',
  async (id: string) => {
    const response = await fetch(`/api/webtoon/${id}`);
    return await response.json();
  }
);

const webtoonSlice = createSlice({
  name: 'webtoons',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(id => id !== action.payload);
    },
    clearSelectedWebtoon: (state) => {
      state.selectedWebtoon = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchWebtoons
      .addCase(fetchWebtoons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWebtoons.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.webtoons = action.payload.webtoons;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchWebtoons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch webtoons';
      })
      
      // Handle fetchFeaturedWebtoons
      .addCase(fetchFeaturedWebtoons.fulfilled, (state, action) => {
        state.featuredWebtoons = action.payload;
      })
      
      // Handle fetchLatestWebtoons
      .addCase(fetchLatestWebtoons.fulfilled, (state, action) => {
        state.latestWebtoons = action.payload;
      })
      
      // Handle fetchWebtoonById
      .addCase(fetchWebtoonById.fulfilled, (state, action) => {
        state.selectedWebtoon = action.payload;
      });
  },
});

export const { 
  addToFavorites, 
  removeFromFavorites, 
  clearSelectedWebtoon,
  setCurrentPage,
} = webtoonSlice.actions;

// Selectors
export const selectAllWebtoons = (state: RootState) => state.webtoons.webtoons;
export const selectFeaturedWebtoons = (state: RootState) => state.webtoons.featuredWebtoons;
export const selectLatestWebtoons = (state: RootState) => state.webtoons.latestWebtoons;
export const selectSelectedWebtoon = (state: RootState) => state.webtoons.selectedWebtoon;
export const selectFavorites = (state: RootState) => state.webtoons.favorites;
export const selectWebtoonStatus = (state: RootState) => state.webtoons.status;
export const selectWebtoonError = (state: RootState) => state.webtoons.error;
export const selectTotalPages = (state: RootState) => state.webtoons.totalPages;
export const selectCurrentPage = (state: RootState) => state.webtoons.currentPage;

export default webtoonSlice.reducer;