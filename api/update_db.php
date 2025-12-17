<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once './config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    // Check if column exists
    $checkCol = $db->query("SHOW COLUMNS FROM users LIKE 'api_token'");
    if ($checkCol->rowCount() == 0) {
        $sql = "ALTER TABLE users ADD COLUMN api_token VARCHAR(255) DEFAULT NULL";
        $db->exec($sql);
        echo "Successfully added 'api_token' column to users table.<br>";
    } else {
        echo "'api_token' column already exists.<br>";
    }

    echo "Database update complete.";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>