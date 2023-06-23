import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store/store'
import axios from 'axios'
import { authHeader, handleErrorResponse } from '@/helpers'
import { AGENT_EVENTS_ENDPOINT, LOGIN_ENDPOINT } from '@/constants/endpoints'


// Slice Thunks
export const userEventsFilters = createAsyncThunk(
  'users/EventsFilters',
  async (data:any , { signal, rejectWithValue, dispatch }) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => {
      source.cancel()
    })
    try {
      const response = await axios.post(`${AGENT_EVENTS_ENDPOINT}/filters`,data, {
        cancelToken: source.token,
        headers: authHeader('GET'),
      })
      return response.data
      
    } catch (err:any) {
      if (!err.response) {
        throw err
      }
      if(err.response.status !== 200){
        handleErrorResponse(err.response.status, dispatch);
      }
        // Return the known error for future handling
      return rejectWithValue(err.response.status);
    }
  }
)

export const userEventsStats = createAsyncThunk(
  'users/EventsStats',
  async (data:any , { signal, rejectWithValue, dispatch }) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => {
      source.cancel()
    })
    try {
      const response = await axios.post(`${AGENT_EVENTS_ENDPOINT}/stats`,data, {
        cancelToken: source.token,
        headers: authHeader('GET'),
      })
      return response.data
      
    } catch (err:any) {
      if (!err.response) {
        throw err
      }
      if(err.response.status !== 200){
        handleErrorResponse(err.response.status, dispatch);
      }
        // Return the known error for future handling
      return rejectWithValue(err.response.status);
    }
  }
)

// Define a type for the slice state
interface EventsState {
  events:any[],
  loading:boolean,
  error:any,
  totalPages:number;
  currentPage:number;
  event_countries:any,
  office_countries:any,
  currencies:any,
  userEvetsStats:any,
}


// Define the initial state using that type
const initialState: EventsState = {
  events: [],
  loading:false,
  error:null,
  totalPages:0,
  currentPage:1,
  event_countries:[],
  office_countries:[],
  currencies:[],
  userEvetsStats:null,
}

export const eventsSlice = createSlice({
  name: 'events',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setEvents: (state, action: PayloadAction<any>) => {
      state.events = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login thuckCases
    builder.addCase(userEventsStats.pending, (state, action) => {
      state.loading = true;
      state.userEvetsStats = [];
    }),
    builder.addCase(userEventsStats.fulfilled, (state, action) => {
      let res = action.payload;
      if(res.success){
        state.userEvetsStats = action.payload.data;
      }else{
          state.error = res.message;
      }
      state.loading = false;
    }),
    builder.addCase(userEventsStats.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.loading = false;
    })
    // eventfilters
    builder.addCase(userEventsFilters.pending, (state, action) => {
      state.loading = true;
      state.event_countries = [];
      state.office_countries= [];
      state.currencies= [];
    }),
    builder.addCase(userEventsFilters.fulfilled, (state, action) => {
      let res = action.payload;
      if(res.success){
        state.event_countries = action.payload.data.event_countries;
        state.office_countries= action.payload.data.office_countries;
        state.currencies= action.payload.data.currencies;
      }else{
          state.error = res.message;
      }
      state.loading = false;
    }),
    builder.addCase(userEventsFilters.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.loading = false;
    })
  },
})


export const { setEvents, setLoading, setCurrentPage } = eventsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectEvent = (state: RootState) => state.events

export default eventsSlice.reducer