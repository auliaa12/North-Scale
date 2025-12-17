<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once './config/database.php';

try {
    $database = new Database();
    $db = $database->getConnection();

    $password = 'admin123';
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);
    $email = 'admin@diecast.com';

    $query = "UPDATE users SET password = :password WHERE email = :email";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":password", $hashed_password);
    $stmt->bindParam(":email", $email);

    if ($stmt->execute()) {
        echo "Admin password reset successfully to: " . $password . "<br>";
        echo "New Hash: " . $hashed_password;
    } else {
        echo "Failed to reset password.";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>