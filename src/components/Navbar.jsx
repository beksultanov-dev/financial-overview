import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); // Удаляем юзера из памяти
    window.location.href = '/'; // Перезагружаем на главную
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">Финансовый обозреватель</Link>
        <div className="nav-links">
          <Link to="/dashboard">Дашборд</Link>
          <Link to="/income">Доходы</Link>
          <Link to="/expenses">Расходы</Link>
          <Link to="/stats">Статистика</Link>
          <Link to="/settings">Настройки</Link>
          
          {user ? (
            <div className="user-menu">
              <span>{user.name}</span>
              <button onClick={handleLogout} className="btn-logout">Выйти</button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">Войти</Link>
          )}
        </div>
      </div>
    </nav>
  );
}