import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Stats() {
  const [operations, setOperations] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost/finapi/get_data.php?user_id=${userId}`)
      .then(res => res.json())
      .then(data => setOperations(data.operations || []));
  }, []);

  const incomeTotal = operations.filter(o => o.type === 'income').reduce((s, o) => s + Number(o.amount), 0);
  const expenseTotal = operations.filter(o => o.type === 'expense').reduce((s, o) => s + Number(o.amount), 0);

  const barData = [
    { name: 'Доходы', value: incomeTotal },
    { name: 'Расходы', value: expenseTotal }
  ];

  // Функция для генерации и скачивания PDF (теперь асинхронная)
  const exportPDF = async () => {
    const doc = new jsPDF();

    // --- 1. МАГИЯ ШРИФТОВ: Загружаем Roboto для поддержки русского языка ---
    const fontUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf';
    const response = await fetch(fontUrl);
    const buffer = await response.arrayBuffer();
    // Конвертируем шрифт в формат base64, который понимает jsPDF
    const base64Font = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
    
    // Добавляем и применяем шрифт
    doc.addFileToVFS('Roboto-Regular.ttf', base64Font);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.setFont('Roboto'); // Теперь весь текст вне таблицы будет русским!
    // -----------------------------------------------------------------------

    // Заголовок документа
    doc.setFontSize(18);
    doc.text('Финансовый отчет', 14, 22);
    
    // Информация о пользователе и балансе
    doc.setFontSize(12);
    doc.text(`Пользователь: ${user?.name || 'Пользователь'}`, 14, 32);
    doc.text(`Общий доход: ${incomeTotal.toLocaleString()} руб.`, 14, 40);
    doc.text(`Общий расход: ${expenseTotal.toLocaleString()} руб.`, 14, 48);

    // Подготовка данных для таблицы
    const tableColumn = ["Дата", "Категория", "Тип", "Сумма", "Описание"];
    const tableRows = [];

    operations.forEach(op => {
      const opData = [
        op.date,
        op.category,
        op.type === 'income' ? 'Доход' : 'Расход',
        `${Number(op.amount).toLocaleString()} руб.`,
        op.description || '-'
      ];
      tableRows.push(opData);
    });

    // Рисуем таблицу в PDF
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      styles: { 
        font: 'Roboto', 
        fontStyle: 'normal' // Применяем ко всей таблице
      },
      headStyles: { 
        fontStyle: 'normal' // Принудительно убираем "жирность" из шапки
      }
    });

    // Скачиваем файл
    doc.save('finance_report.pdf');
  };

  return (
    <main className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <h2>Аналитика и Отчеты</h2>
        <button onClick={exportPDF} className="btn" style={{ backgroundColor: '#2ecc71', color: 'white' }}>
          Скачать отчет (PDF)
        </button>
      </div>

      <div className="card" style={{height: '400px', margin: '2rem 0'}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#0088FE" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}