import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="container">
      <section className="hero">
        <h1>Простой учёт личных финансов</h1>
        <p>Добавляйте доходы и расходы, анализируйте категории, экспортируйте данные. Теперь всё надежно хранится в базе данных!</p>
        <div className="hero-actions">
          <Link className="btn" to="/dashboard">Начать учёт</Link>
          <Link className="btn btn-ghost" to="/register">Регистрация</Link>
        </div>
      </section>

      <section className="features">
        <article>
          <h3>Простота</h3>
          <p>Минимум функций — только нужное для учёта бюджета.</p>
        </article>
        <article>
          <h3>Конфиденциальность</h3>
          <p>Ваши данные под защитой вашего личного аккаунта.</p>
        </article>
        <article>
          <h3>Аналитика</h3>
          <p>Круговые диаграммы и графики по времени на странице «Статистика».</p>
        </article>
      </section>

      <section className="about">
        <h2>Как это работает</h2>
        <ol>
          <li>Зарегистрируйтесь или войдите в систему.</li>
          <li>Добавляйте свои доходы и расходы в соответствующих разделах.</li>
          <li>Смотрите баланс и подробные отчёты в Дашборде и Статистике.</li>
        </ol>
      </section>
    </main>
  );
}