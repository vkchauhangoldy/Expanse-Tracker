import { configureStore } from "@reduxjs/toolkit";
import transactionReducer from "./transactionsSlice";


export const store = configureStore({
    reducer: {
        transactions: transactionReducer,
    },
});
