import React from "react";
import "./Progress.css";
import { useSelector } from "react-redux";
import { aggregateByCategory } from "../utils/utils";



const ProgressBars = () => {
    const expenses = useSelector((state) => state.transactions.expenses);
    const data = aggregateByCategory(expenses);
    const total = data.reduce((acc, item) => acc + item.value, 0);
    return (
        <div className="progress-container">
            {data.map((item, index) => {
                const percent = ((item.value / total) * 100).toFixed(1);
                return (
                    <div key={index} className="progress-item">
                        <div className="progress-label">
                            <span>{item.name}</span>
                            <span>₹{item.value} ({percent}%)</span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${percent}%`, backgroundColor: item.color }}
                            ></div>
                        </div>
                    </div>
                );
            })}
            {data.length == 0 &&
                <p className="text-color">
                    No expenses
                </p>
            }
        </div>
    );
};

export default ProgressBars;
