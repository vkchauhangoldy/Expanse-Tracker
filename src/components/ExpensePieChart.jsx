
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { aggregateByCategory } from "../utils/utils";

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize="12"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const ExpenseChart = () => {
    const expenses = useSelector((state) => state.transactions.expenses);
    const data = aggregateByCategory(expenses);
    const COLORS = data.map((item) => item.color);

    return (
        <PieChart width={300} height={220}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                labelLine={false}
                label={renderCustomizedLabel}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
        </PieChart>
    );
};

export default ExpenseChart;
