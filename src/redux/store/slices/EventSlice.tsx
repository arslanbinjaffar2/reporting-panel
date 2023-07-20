import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store/store'
import axios from 'axios'
import { AGENT_EVENTS_ENDPOINT } from '@/constants/endpoints'
import { authHeader, handleErrorResponse } from '@/helpers'


// Slice Thunks
export const userEventStatsAndOrders = createAsyncThunk(
  'users/EventStatsAndOrders',
  async (data:any , { signal, dispatch, rejectWithValue }) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => {
      source.cancel()
    })
    try {
      
      const response = await axios.post(`${AGENT_EVENTS_ENDPOINT}/${data.event_id}/statsAndOrders`,data, {
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
interface EventState {
  event:any
  event_stats:any,
  event_orders:any
  loading:boolean,
  error:any,
  totalPages:number,
  currentPage:number,
}


// Define the initial state using that type
const initialState: EventState = {
  event:null,
  event_stats: null,
  event_orders: null,
  loading:true,
  error:null,
  totalPages:0,
  currentPage:1,
}

export const eventSlice = createSlice({
  name: 'event',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setEvent: (state, action: PayloadAction<any>) => {
      state.event_stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login thuckCases
    builder.addCase(userEventStatsAndOrders.pending, (state, action) => {
      state.loading = true;
      state.event_orders = null;
    }),
    builder.addCase(userEventStatsAndOrders.fulfilled, (state, action) => {
      let res = action.payload;
      if(res.success){
        state.event = action.payload.data.event;
        state.event_orders = action.payload.data.data;
        state.totalPages = action.payload.data.data.last_page;
        state.currentPage = action.payload.data.data.current_page;
        state.event_orders = action.payload.data.data;
        state.event_stats = action.payload.data.event_stats;
      }else{
          state.error = res.message;
      }
      state.loading = false;
    }),
    builder.addCase(userEventStatsAndOrders.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.loading = false;
    })
  },
})


export const { setEvent, setLoading } = eventSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectEvent = (state: RootState) => state.event

export default eventSlice.reducer