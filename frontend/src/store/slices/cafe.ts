import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ICafeGetAttributes } from "@shared/interfaces/ICafe";

const initialState: ICafeGetAttributes[] = [];

export const cafeSlice = createSlice({
  name: "cafes",
  initialState,
  reducers: {
    setCafes: (_, action: PayloadAction<ICafeGetAttributes[]>) => {
      return action.payload;
    },
    clearCafes: () => {
      return [];
    },
  },
});

export const { setCafes, clearCafes } = cafeSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default cafeSlice.reducer;
