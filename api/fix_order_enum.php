<?php
// Fix for missing 'shipped' status in ENUM
include_once './config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    echo "Attempting to update orders table status enum...\n";

    // Add 'shipped' to the ENUM list
    $sql = "ALTER TABLE orders MODIFY COLUMN status ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending'";

    $result = $db->exec($sql);

    if ($result === false) {
        $error = $db->errorInfo();
        echo "Error updating table: " . $error[2] . "\n";
    } else {
        echo "Successfully updated orders table status column.\n";
    }

} catch (Exception $e) {
    echo "Exception: " . $e->getMessage() . "\n";
}
?>