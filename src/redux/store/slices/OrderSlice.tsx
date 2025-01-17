import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store/store'
import axios from 'axios'
import { AGENT_EVENTS_ENDPOINT } from '@/constants/endpoints'
import { authHeader } from '@/helpers'


// Slice Thunks
export const userEventOrderInvoice = createAsyncThunk(
  'users/EventOrderInvoice',
  async (data:any , { signal }) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => {
      source.cancel()
    })
    const response = await axios.post(`${AGENT_EVENTS_ENDPOINT}/${data.event_id}/orders/${data.order_id}/invoice`,data, {
      cancelToken: source.token,
      headers: authHeader('GET'),
    })
    return response.data
  }
)

// Define a type for the slice state
interface EventState {
  order:any,
  invoice:any,
  loading:boolean,
  error:any,
}


// Define the initial state using that type
const initialState: EventState = {
  order: null,
  invoice: null,
  loading:false,
  error:null,
}

export const orderSlice = createSlice({
  name: 'order',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login thuckCases
    builder.addCase(userEventOrderInvoice.pending, (state, action) => {
      state.loading = true;
      state.invoice = null;
    }),
    builder.addCase(userEventOrderInvoice.fulfilled, (state, action) => {
      let res = action.payload;
      if(res.success){
        state.invoice = action.payload.data.invoice;
      }else{
          state.error = res.message;
      }
      state.loading = false;
    }),
    builder.addCase(userEventOrderInvoice.rejected, (state, action) => {
      console.log("rejected", action.payload);
      state.loading = false;
    })
  },
})


export const { setLoading } = orderSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectOrder = (state: RootState) => state.order

export default orderSlice.reducer