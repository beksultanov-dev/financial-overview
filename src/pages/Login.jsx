import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Выходим из папки pages в src

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Авторизация пользователя через Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Ошибка входа: ' + error.message);
    } else {
      // Достаем имя из метаданных Supabase (указанное при регистрации)
      const userName = data.user.user_metadata?.full_name || data.user.email;

      // Сохраняем пользователя в localStorage (для совместимости с вашим остальным кодом)
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: userName
      }));

      alert(`Привет, ${userName}!`);
      navigate('/dashboard');
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
      
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Нет аккаунта? <Link to="/register" style={{ color: '#0088FE' }}>Зарегистрироваться</Link>
      </p>
    </main>
  );
}