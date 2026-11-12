<?php
// Разрешаем React обращаться к этому файлу
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Подключаем нашу базу данных
require 'db.php';

// Категории по умолчанию
$categories = [
    "income" => ["Зарплата", "Фриланс", "Стипендия"],
    "expense" => ["Еда", "Транспорт", "Развлечения", "ЖКХ"]
];

try {
    $userId = $_GET['user_id'] ?? '';

    // Операции только этого пользователя, от новых к старым
    $stmt = $pdo->prepare("SELECT * FROM operations WHERE user_id = ? ORDER BY date DESC");
    $stmt->execute([$userId]);
    $operations = $stmt->fetchAll();

    // Свои категории пользователя добавляем к стандартным
    $catStmt = $pdo->prepare("SELECT name, type FROM categories WHERE user_id = ?");
    $catStmt->execute([$userId]);
    foreach ($catStmt->fetchAll() as $c) {
        if (isset($categories[$c['type']])) {
            $categories[$c['type']][] = $c['name'];
        }
    }

    // Собираем всё в один ответ для React
    $data = [
        "categories" => $categories,
        "operations" => $operations
    ];

    echo json_encode($data, JSON_UNESCAPED_UNICODE);

} catch (\PDOException $e) {
    echo json_encode(["error" => "Ошибка базы данных: " . $e->getMessage()]);
}
?>