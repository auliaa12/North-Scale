<?php
include_once 'config/database.php';
$database = new Database();
$db = $database->getConnection();
$stmt = $db->query("SELECT COUNT(*) as count FROM orders");
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo "Total Orders: " . $row['count'] . "\n";

$stmt2 = $db->query("SELECT id, order_number, status, user_id FROM orders ORDER BY id DESC LIMIT 5");
while ($r = $stmt2->fetch(PDO::FETCH_ASSOC)) {
    echo "ID: {$r['id']}, Num: {$r['order_number']}, Status: {$r['status']}, User: {$r['user_id']}\n";
}
?>