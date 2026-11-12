<?php
// Разрешаем браузеру отправлять данные (защита CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Отвечаем "OK" на предварительный запрос браузера
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Подключаем нашу базу данных
require 'db.php';

// Получаем JSON, который пришлет React
$data = json_decode(file_get_contents("php://input"));

// Проверяем, что нам прислали основные данные
if (!empty($data->user_id) && in_array($data->type ?? '', ['income', 'expense'], true) && !empty($data->amount) && !empty($data->date) && !empty($data->category)) {

    // Готовим SQL-команду для вставки данных в таблицу
    $sql = "INSERT INTO operations (user_id, type, amount, date, category, description) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    // Выполняем команду
        if ($stmt->execute([$data->user_id, $data->type, $data->amount, $data->date, $data->category, $data->desc ?? null])) {
        echo json_encode(["status" => "success", "message" => "Ура! Операция сохранена в MySQL!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Не удалось сохранить."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Ошибка: заполнены не все поля."]);
}
?>