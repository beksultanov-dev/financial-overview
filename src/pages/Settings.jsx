import { useState } from 'react';

export default function Settings() {
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState('expense');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleAddCat = async (e) => {
    e.preventDefault();
    if (!user) return alert('Войдите в аккаунт');

    await fetch('http://localhost/finapi/add_category.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.id, name: catName, type: catType }),
    });
    setCatName('');
    alert('Категория добавлена!');
  };

  return (
    <main className="container">
      <h2>Настройки</h2>
      <div className="card" style={{marginTop: '2rem'}}>
        <h3>Добавить свою категорию</h3>
        <form onSubmit={handleAddCat} className="form">
          <input type="text" placeholder="Название (например: Кино)" value={catName} onChange={e => setCatName(e.target.value)} required />
          <select value={catType} onChange={e => setCatType(e.target.value)}>
            <option value="expense">Расход</option>
            <option value="income">Доход</option>
          </select>
          <button type="submit" className="btn">Добавить</button>
        </form>
      </div>
    </main>
  );
}