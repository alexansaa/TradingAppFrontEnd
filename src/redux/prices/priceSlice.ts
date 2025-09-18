import { createSlice, createAsyncThunk, type PayloadAction  } from '@reduxjs/toolkit';
import axios from 'axios';
import type { RootState } from '../store';
// import { v4 as uuid4 } from 'uuid';

const url = 'http://localhost:18080';

interface PricesState {
  prices: PriceBar[];
  isLoading: boolean;
  error?: string;
}

const initialState: PricesState = {
    prices: [],
    isLoading: true,
    error: undefined,
};

// what callers can pass
export type GetPricesArgs = {
    symbol?: string;
    start?: string;    // ISO date/time
    end?: string;      // ISO date/time
    intervalSec?: number;
    limit?: number;
};

export type PriceBar = {
  BarDate: string;      // or Date if you parse it
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  Source: string;
  Symbol: string;
};

type ApiEnvelope<T> = { data: T; meta?: unknown };
type ApiResponse = ApiEnvelope<PriceBar[]>;

export const getPricesHistory = createAsyncThunk<
PriceBar[],
GetPricesArgs | void,
{
    rejectValue: string;
    state: RootState
}
>('price/getPricesHistory', async (args, { rejectWithValue, signal }) => {
    try {
        const params = { ...(args ?? {}) };
        const getResultsUrl = `${url}/prices/history`;
        const resp = await axios.get<ApiResponse>(
            getResultsUrl,
            { params, signal }
        );
        console.log("returned data");
        console.log(resp);        
        
        const myData = resp.data.data;        

        // const myTransData: PriceBar[] = [];
        // for (const key of Object.keys(myData)) {
        //     const arr = myData[key];
        //     if (arr && arr.length > 0) {
        //         myTransData.push({ ...arr[0], id: key });
        //     }
        // }
        // return myTransData;
        return myData;


        // const myTransData = [];

        // Object.keys(myData).forEach((key) => {
        //     const myTmpObj = myData[key][0];
        //     myTmpObj.id = key;
        //     myTransData.push(myTmpObj);
        // });

        // return myTransData;
    } catch (error) {
        return rejectWithValue('something went wrong...');
    }
});

const priceSlice = createSlice({
    name: 'price',
    initialState,
    reducers: {
        //
    },
    extraReducers: (builder) => {
        builder
        .addCase(getPricesHistory.pending, (state) => {
            state.isLoading = true;
            state.error = undefined;
        })
        .addCase(getPricesHistory.fulfilled, (state, action: PayloadAction<PriceBar[]>) =>{
            state.isLoading = false;
            state.prices = action.payload;
        })
        .addCase(getPricesHistory.rejected, (state, action) => {
            state.isLoading = false;
            state.error = (action.payload as string) ?? 'Request failed';
        })
    },
});

// export const {} = priceSlice.actions;
export default priceSlice.reducer;