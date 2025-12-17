<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once './config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    if ($db) {
        echo "Database connection successful!";
    } else {
        echo "Database connection returned null.";
    }
} catch (Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
?>