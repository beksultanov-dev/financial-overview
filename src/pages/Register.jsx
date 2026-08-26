import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Убедись, что путь к файлу supabaseClient правильный

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Регистрируем пользователя напрямую через Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });

    if (error) {
      alert('Ошибка регистрации: ' + error.message);
    } else {
      alert('Регистрация успешна!');
      navigate('/login');
    }
  };

  return (
    <main className="container auth-form">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
        <label>Имя <input type="text" required value={name} onChange={e => setName(e.target.value)} /></label>
        <label>Email <input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Пароль <input type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
        <button type="submit" className="btn">Создать аккаунт</button>
      </form>

      {/* Ссылка на вход */}
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Уже есть аккаунт? <Link to="/login" style={{ color: '#0088FE' }}>Войти</Link>
      </p>
    </main>
  );
}