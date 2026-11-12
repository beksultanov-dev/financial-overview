<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->user_id)) {
    try {
        // Удаляем операцию, только если она принадлежит этому пользователю
        $stmt = $pdo->prepare("DELETE FROM operations WHERE id = ? AND user_id = ?");
        $stmt->execute([$data->id, $data->user_id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "message" => "Запись удалена"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Запись не найдена или принадлежит другому пользователю"]);
        }
    } catch (\PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Ошибка при удалении"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Не указан id или user_id"]);
}
?>