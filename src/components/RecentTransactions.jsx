import { FiCoffee, FiFilm, FiMapPin } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import "./Transactions.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteExpense } from "../redux/transactionsSlice";

const categoryIcons = {
    Food: { icon: <FiCoffee />, color: "#0088FE" },
    Entertainment: { icon: <FiFilm />, color: "#FF8042" },
    Travel: { icon: <FiMapPin />, color: "#FFBB28" },
};

const RecentTransactions = ({ onEdit }) => {
    const { expenses } = useSelector((state) => state.transactions);
    const dispatch = useDispatch();

    return (
        <div className="transactions-container">
            <ul className="transactions-list">
                {expenses?.map((tx) => {
                    const categoryData = categoryIcons[tx.category] || {};
                    return (
                        <li key={tx.id} className="transaction-item">
                            <div
                                className="transaction-icon"
                                style={{ backgroundColor: categoryData.color }}
                            >
                                {categoryData.icon}
                            </div>
                            <div className="transaction-details">
                                <h4>{tx.title}</h4>
                                <p>{tx.date} • {tx.category}</p>
                            </div>
                            <div className="transaction-amount">₹{tx.amount}</div>
                            <div className="transaction-actions">
                                <FaEdit className="action-icon edit" color="#2f9e44" onClick={() => onEdit(tx)} />
                                <RiDeleteBinLine className="action-icon delete" onClick={() => dispatch(deleteExpense(tx.id))} />
                            </div>
                        </li>
                    );
                })}
                {expenses.length == 0 &&
                    <p className="text-color">
                        No Recent Transactions
                    </p>
                }
            </ul>
        </div>
    );
};

export default RecentTransactions;
