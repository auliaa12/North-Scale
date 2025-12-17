<?php
header("Content-Type: application/json");
include_once 'config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $stmt = $db->query("SELECT * FROM orders ORDER BY id DESC LIMIT 5");
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check columns
    $columns = $db->query("SHOW COLUMNS FROM orders")->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "columns" => array_column($columns, 'Field'),
        "orders" => $orders
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>