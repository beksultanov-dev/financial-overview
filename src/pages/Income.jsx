import { useState, useEffect } from 'react';

export default function Income() {
  const [data, setData] = useState({ categories: { income: [] }, operations: [] });

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  // Функция для скачивания свежих данных с сервера
  const loadData = async () => {
  if (!userId) return;
    try {
      const response = await fetch(`http://localhost/finapi/get_data.php?user_id=${userId}`);
      const dataFromPhp = await response.json();
      setData(dataFromPhp);

      // Автоматически выбираем первую категорию, если она еще не выбрана
      if (dataFromPhp.categories?.income?.length > 0 && !category) {
        setCategory(dataFromPhp.categories.income[0]);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  // Загружаем данные при открытии страницы
  useEffect(() => {
    loadData();
  }, []); // Пустой массив означает, что это сработает 1 раз при открытии

  const handleAddIncome = async (e) => {
    e.preventDefault();

    const newOperation = {
      user_id: userId,
      type: 'income',
      amount: Number(amount),
      date: date,
      category: category,
      desc: desc
    };

    try {
      const response = await fetch('http://localhost/finapi/add_operation.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOperation),
      });

      const result = await response.json();

      if (result.status === 'success') {
        // Очищаем форму
        setAmount('');
        setDesc('');
        
        // МГНОВЕННО обновляем таблицу, скачивая свежие данные из базы!
        loadData(); 
      } else {
        alert('Ошибка сервера: ' + result.message);
      }
    } catch (error) {
      console.error('Ошибка при отправке:', error);
      alert('Не удалось связаться с сервером PHP.');
    }
  };

  const formatMoney = (n) => Number(n).toLocaleString('ru-RU') + ' ₽';

  return (
    <main className="container">
      <h2>Добавить доход</h2>
      <form className="form" onSubmit={handleAddIncome}>
        <label>
          Сумма
          <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="Например: 50000" />
        </label>
        <label>
          Дата
          <input type="date" required value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Категория
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {data.categories?.income?.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>
        <label>
          Описание
          <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Например: Аванс" />
        </label>
        <button type="submit" className="btn">Добавить</button>
      </form>

      <section className="recent" style={{ marginTop: '2rem' }}>
        <h3>История доходов (из базы данных)</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Дата</th>
              <th>Категория</th>
              <th>Сумма</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            {data.operations
              .filter(op => op.type === 'income')
              .slice(0, 5) // Берем 5 последних (они уже отсортированы в PHP)
              .map((op) => (
              <tr key={op.id}>
                <td>{op.date}</td>
                <td>{op.category}</td>
                <td style={{ color: 'green' }}>+{formatMoney(op.amount)}</td>
                <td>{op.description}</td> 
              </tr>
            ))}
            {data.operations.filter(op => op.type === 'income').length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: '#666' }}>Пока нет добавленных доходов</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
