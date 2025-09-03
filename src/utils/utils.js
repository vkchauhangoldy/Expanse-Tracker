export const aggregateByCategory = (expenses) => {
    const result = {};
    expenses.forEach((item) => {
        if (result[item.category]) {
            result[item.category] += item.amount;
        } else {
            result[item.category] = item.amount;
        }
    });
    return Object.entries(result).map(([name, value], index) => ({
        name,
        value,
        color: ["#0088FE", "#FF8042", "#FFBB28"][index % 3],
    }));
};
