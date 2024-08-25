import { configureStore } from "@reduxjs/toolkit";
import { cafeSlice } from "./slices/cafe";
import { employeesSlice } from "./slices/employees";
import { reducer as formReducer } from "redux-form";

export const store = configureStore({
  reducer: {
    form: formReducer,
    cafes: cafeSlice.reducer,
    employees: employeesSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
