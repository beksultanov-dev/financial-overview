import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Добавили Link

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/finapi/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (result.status === 'success') {
        localStorage.setItem('user', JSON.stringify(result.user));
        alert(`Привет, ${result.user.name}!`);
        window.location.href = '/dashboard'; 
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Ошибка соединения с сервером.');
    }
  };

  return (
    <main className="container auth-form">
      <h2>Вход</h2>
      <form onSubmit={handleLogin}>
        <label>Email <input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Пароль <input type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
        <button type="submit" className="btn">Войти</button>
      </form>
      
      {/* Вот этот кусочек мы добавили */}
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Нет аккаунта? <Link to="/register" style={{ color: '#0088FE' }}>Зарегистрироваться</Link>
      </p>
    </main>
  );
}