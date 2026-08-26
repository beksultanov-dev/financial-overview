import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [data, setData] = useState({ categories: {}, operations: [] });
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost/finapi/get_data.php?user_id=${userId}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error(err));
  }, []);

  const totals = data.operations.reduce((acc, op) => {
    const amt = Number(op.amount);
    if (op.type === 'income') acc.income += amt;
    else acc.expense += amt;
    return acc;
  }, { income: 0, expense: 0 });

  const pieData = Object.entries(
    data.operations
      .filter(op => op.type === 'expense')
      .reduce((acc, op) => {
        acc[op.category] = (acc[op.category] || 0) + Number(op.amount);
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <main className="container">
      <div className="stats-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
        <div className="card"><h3>Баланс</h3><p>{(totals.income - totals.expense).toLocaleString()} ₽</p></div>
        <div className="card"><h3>Доходы</h3><p style={{color: 'green'}}>{totals.income.toLocaleString()} ₽</p></div>
        <div className="card"><h3>Расходы</h3><p style={{color: 'red'}}>{totals.expense.toLocaleString()} ₽</p></div>
      </div>

      <section className="card" style={{marginTop: '2rem', height: '300px'}}>
        <h3>Расходы по категориям</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label={({ name, value }) => `${name}: ${value} ₽`}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </section>
    </main>
  );
}