import { useState, useEffect } from 'react';

export default function Expenses() {
  const [data, setData] = useState({ categories: { expense: [] }, operations: [] });
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const loadData = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost/finapi/get_data.php?user_id=${userId}`);
      const dataFromPhp = await response.json();
      setData(dataFromPhp);
      if (dataFromPhp.categories?.expense?.length > 0 && !category) {
        setCategory(dataFromPhp.categories.expense[0]);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const newOperation = {
      user_id: userId,
      type: 'expense',
      amount: Number(amount),
      date: date,
      category: category,
      desc: desc
    };

    try {
      const response = await fetch('http://localhost/finapi/add_operation.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOperation),
      });
      const result = await response.json();
      if (result.status === 'success') {
        setAmount('');
        setDesc('');
        loadData();
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    }
  };

  return (
    <main className="container">
      <h2>Добавить расход</h2>
      <form className="form" onSubmit={handleAddExpense}>
        <label>Сумма <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} /></label>
        <label>Дата <input type="date" required value={date} onChange={e => setDate(e.target.value)} /></label>
        <label>Категория 
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {data.categories?.expense?.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </label>
        <label>Описание <input type="text" value={desc} onChange={e => setDesc(e.target.value)} /></label>
        <button type="submit" className="btn" style={{backgroundColor: '#dc3545'}}>Добавить расход</button>
      </form>

      <section className="recent" style={{marginTop: '2rem'}}>
        <h3>Мои расходы (из базы данных)</h3>
        <table className="table">
          <thead>
            <tr><th>Дата</th><th>Категория</th><th>Сумма</th><th>Описание</th></tr>
          </thead>
          <tbody>
            {data.operations.filter(op => op.type === 'expense').slice(0, 10).map((op) => (
              <tr key={op.id}>
                <td>{op.date}</td>
                <td>{op.category}</td>
                <td style={{color: 'red'}}>-{Number(op.amount).toLocaleString()} ₽</td>
                <td>{op.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}