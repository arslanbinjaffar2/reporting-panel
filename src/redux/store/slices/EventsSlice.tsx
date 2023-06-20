import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store/store'
import axios from 'axios'
import { authHeader } from '@/helpers'
import { AGENT_EVENTS_ENDPOINT, LOGIN_ENDPOINT } from '@/constants/endpoints'


// Slice Thunks
export const userEvents = createAsyncThunk(
  'users/Events',
  async (data:any , { signal }) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => {
      source.cancel()
    })
    const response = await axios.post(`${AGENT_EVENTS_ENDPOINT}?page=${data.page}`,data, {
      cancelToken: source.token,
      headers: authHeader('GET'),
    })
    return response.data
  }
)

// Define a type for the slice state
interface EventsState {
  events:any[],
  loading:boolean,
  error:any,
  totalPages:number;
  currentPage:number;
}


// Define the initial state using that type
const initialState: EventsState = {
  events: [],
  loading:false,
  error:null,
  totalPages:0,
  currentPage:1,
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
    builder.addCase(userEvents.pending, (state, action) => {
      state.loading = true;
      state.events = [];
    }),
    builder.addCase(userEvents.fulfilled, (state, action) => {
      let res = action.payload;
      if(res.success){
        state.events = action.payload.data.events;
        state.totalPages = action.payload.data.paginate.total_page;
        state.currentPage = action.payload.data.paginate.current_page;
      }else{
          state.error = res.message;
      }
      state.loading = false;
    }),
    builder.addCase(userEvents.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.loading = false;
    })
  },
})


export const { setEvents, setLoading, setCurrentPage } = eventsSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectEvent = (state: RootState) => state.events

export default eventsSlice.reducer