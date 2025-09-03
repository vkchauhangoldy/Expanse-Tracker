
import { useState } from 'react';
import './Expense.css'
import ExpenseChart from "../components/ExpensePieChart";
import Modal from "react-modal";
import ProgressBars from '../components/ProgressBar';
import RecentTransactions from '../components/RecentTransactions';
import { useDispatch, useSelector } from 'react-redux';
import { addExpense, addIncome, editExpense } from '../redux/transactionsSlice';
const Expense = () => {
    const dispatch = useDispatch();
    const { walletBalance, totalExpenses } = useSelector((state) => state.transactions);

    const [isOpenAddIncome, setIsOpenAddIncome] = useState(false)
    const [isOpenAddExpense, setIsOpenAddExpense] = useState(false)

    const [incomeAmount, setIncomeAmount] = useState("");
    const [expenseInputs, setExpenseInputs] = useState({ title: "", price: "", category: "", date: "" });
    const [editingExpense, setEditingExpense] = useState(null);

    //addIncome Handler
    const addIncomeHandler = () => {
        if (incomeAmount) {
            dispatch(addIncome(Number(incomeAmount)));
            setIncomeAmount("");
        }
        setIsOpenAddIncome(false);
    };

    const openEditExpenseModal = (expense) => {
        setEditingExpense(expense);
        setExpenseInputs({
            title: expense.title,
            price: expense.amount,
            category: expense.category,
            date: expense.date,
        });
        setIsOpenAddExpense(true);
    };

    //add expense handler
    const addExpenseHandler = () => {

        if (!expenseInputs.title || !expenseInputs.price) {
            alert("Please fill title and price");
            return;
        }
        if (walletBalance < Number(expenseInputs.price)) {
            alert("You don't  have enough balance \nPlease add money to wallet to add expense record.");
            return;
        }
        if (editingExpense) {
            dispatch(
                editExpense({
                    id: editingExpense.id,
                    updatedData: {
                        title: expenseInputs.title,
                        amount: Number(expenseInputs.price),
                        category: expenseInputs.category || "Other",
                        date: expenseInputs.date || new Date().toISOString().slice(0, 10),
                    },
                })
            );
        } else {
            // Add new expense
            const newExpense = {
                id: Date.now(),
                title: expenseInputs.title,
                amount: Number(expenseInputs.price),
                category: expenseInputs.category || "Other",
                date: expenseInputs.date || new Date().toISOString().slice(0, 10),
            };
            dispatch(addExpense(newExpense));
        }

        // Reset form and close modal
        setExpenseInputs({ title: "", price: "", category: "", date: "" });
        setEditingExpense(null);
        setIsOpenAddExpense(false);
    };

    return (
        <div className="container">
            <h1>Expense Tracker</h1>
            <div className="main">
                <div className="card">
                    <h2>
                        Wallet Balance: <span className="income">&#8377;{walletBalance}</span>
                    </h2>
                    <button type="button" onClick={() => setIsOpenAddIncome(true)} className='btn income-btn'>+ Add Income</button>
                </div>
                <div className="card">
                    <h2>Expenses: <span className="expense">&#8377;{totalExpenses}</span></h2>
                    <button type='button' onClick={() => setIsOpenAddExpense(true)} className='btn expense-btn'>+ Add Expense</button>
                </div>
                <div className="chart">
                    <ExpenseChart />
                </div>
            </div>
            <div className="main2">
                <div>
                    <h2>Recent Transactions</h2>
                    <RecentTransactions onEdit={openEditExpenseModal} />
                </div>
                <div>
                    <h2>Top Expenses</h2>
                    <ProgressBars />
                </div>
            </div>

            {/* Income Modal */}
            <Modal
                isOpen={isOpenAddIncome}
                onRequestClose={() => setIsOpenAddIncome(false)}
                className="modal"
                overlayClassName="overlay"
                ariaHideApp={false}
            >
                <h2 className='moadl-txt'>Add Income</h2>
                <input type="number" placeholder="Income Amount"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                />
                <div className='form-controls'>
                    <button type="submit" className='btn save-btn' onClick={addIncomeHandler}>Add Balance</button>
                    <button className='btn cancel-btn' onClick={() => setIsOpenAddIncome(false)}>Cancel</button>
                </div>
            </Modal>

            {/* Expense Modal */}
            <Modal
                isOpen={isOpenAddExpense}
                onRequestClose={() => setIsOpenAddExpense(false)}
                className="modal"
                overlayClassName="overlay"
                ariaHideApp={false}
            >
                <h2 className='moadl-txt'>Add Expense</h2>
                <div className='form-controls'>
                    <input type="text" placeholder="Title" name="title"
                        value={expenseInputs.title}
                        onChange={(e) => setExpenseInputs({ ...expenseInputs, title: e.target.value })}
                    />
                    <input type="number" placeholder="Price" name="price"
                        value={expenseInputs.price}
                        onChange={(e) => setExpenseInputs({ ...expenseInputs, price: e.target.value })}
                    />
                </div>
                <div className='form-controls'>
                    <select name="category" value={expenseInputs.category}
                        onChange={(e) =>
                            setExpenseInputs({ ...expenseInputs, category: e.target.value })
                        }>
                        <option value="0" key="0">Select category</option>
                        <option value="Food" key="1">Food</option>
                        <option value="Entertainment" key="2">Entertainment</option>
                        <option value="Travel" key="3">Travel</option>
                    </select>
                    <input type="date" name="date" placeholder="" value={expenseInputs.date}
                        onChange={(e) => setExpenseInputs({ ...expenseInputs, date: e.target.value })} />
                </div>
                <div className='form-controls'>
                    <button type="submit" className='btn save-btn' onClick={addExpenseHandler}>Add Expense</button>
                    <button className='btn cancel-btn' onClick={() => {
                        setIsOpenAddExpense(false)
                        setExpenseInputs({ title: "", price: "", category: "", date: "" });
                    }}>Cancel</button>
                </div>
            </Modal>

        </div>
    );
};

export default Expense;
