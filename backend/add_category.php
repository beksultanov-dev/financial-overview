<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Ответ на предварительный запрос браузера
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

// Нужны владелец, название и тип категории
if ($data && !empty($data->user_id) && !empty($data->name) && in_array($data->type ?? '', ['income', 'expense'], true)) {
    try {
        // INSERT IGNORE: повторное добавление такой же категории не создаёт дубль
        $stmt = $pdo->prepare("INSERT IGNORE INTO categories (user_id, name, type) VALUES (?, ?, ?)");
        $stmt->execute([$data->user_id, trim($data->name), $data->type]);
        echo json_encode(["status" => "success"]);
    } catch (\PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Ошибка базы данных"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Ошибка: заполнены не все поля."]);
}
?>