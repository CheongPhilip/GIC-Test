import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IEmployeeGetAttributes } from "@shared/interfaces/IEmployee";

const initialState: IEmployeeGetAttributes[] = [];

export const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    setEmployees: (_, action: PayloadAction<IEmployeeGetAttributes[]>) => {
      return action.payload;
    },
    clearEmployees: () => {
      return [];
    },
  },
});

export const { setEmployees, clearEmployees } = employeesSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value;

export default employeesSlice.reducer;
