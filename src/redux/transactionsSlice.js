import { createSlice } from "@reduxjs/toolkit";

// Loaders
const loadExpenses = () => {
    const data = localStorage.getItem("expenses");
    return data ? JSON.parse(data) : [];
};

const loadWallet = () => {
    const data = localStorage.getItem("walletBalance");
    return data ? JSON.parse(data) : 5000;
};

const loadTotalExpenses = () => {
    const data = localStorage.getItem("totalExpenses");
    return data ? JSON.parse(data) : 0;
};

// Savers
const saveExpenses = (expenses) => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
};

const saveWallet = (walletBalance) => {
    localStorage.setItem("walletBalance", JSON.stringify(walletBalance));
};

const saveTotalExpenses = (totalExpenses) => {
    localStorage.setItem("totalExpenses", JSON.stringify(totalExpenses));
};

const initialState = {
    walletBalance: loadWallet(),
    expenses: loadExpenses(),
    totalExpenses: loadTotalExpenses(),
};

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        // addIncome: (state, action) => {
        //     state.walletBalance += Number(action.payload);
        //     saveWallet(state.walletBalance);
        // },
        // addExpense: (state, action) => {
        //     state.expenses.push(action.payload);
        //     state.walletBalance -= action.payload.amount;
        //     state.totalExpenses += action.payload.amount;

        //     saveExpenses(state.expenses);
        //     saveWallet(state.walletBalance);
        //     saveTotalExpenses(state.totalExpenses);
        // },
        addIncome: (state, action) => {
            state.walletBalance += Number(action.payload); // ensure numeric
            saveWallet(state.walletBalance);
        },
        addExpense: (state, action) => {
            const expense = {
                id: action.payload.id || Date.now(),
                title: action.payload.title,
                amount: Number(action.payload.amount),
                category: action.payload.category || "general",
            };

            state.expenses.push(expense);
            state.walletBalance -= expense.amount;
            state.totalExpenses += expense.amount;

            saveExpenses(state.expenses);
            saveWallet(state.walletBalance);
            saveTotalExpenses(state.totalExpenses);
        },

        editExpense: (state, action) => {
            const { id, updatedData } = action.payload;
            const index = state.expenses.findIndex((e) => e.id === id);
            if (index !== -1) {
                const prevAmount = state.expenses[index].amount;

                // Refund old
                state.walletBalance += prevAmount;
                state.totalExpenses -= prevAmount;

                // Replace with new
                state.expenses[index] = { ...state.expenses[index], ...updatedData };
                state.walletBalance -= updatedData.amount;
                state.totalExpenses += updatedData.amount;

                saveExpenses(state.expenses);
                saveWallet(state.walletBalance);
                saveTotalExpenses(state.totalExpenses);
            }
        },
        deleteExpense: (state, action) => {
            const index = state.expenses.findIndex((e) => e.id === action.payload);
            if (index !== -1) {
                const deletedAmount = state.expenses[index].amount;

                state.walletBalance += deletedAmount; // refund
                state.totalExpenses -= deletedAmount;

                state.expenses.splice(index, 1);

                saveExpenses(state.expenses);
                saveWallet(state.walletBalance);
                saveTotalExpenses(state.totalExpenses);
            }
        },
    },
});

export const { addIncome, addExpense, editExpense, deleteExpense } =
    transactionsSlice.actions;

export default transactionsSlice.reducer;
