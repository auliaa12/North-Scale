<?php
header('Content-Type: text/plain');
ini_set('display_errors', 1);
error_reporting(E_ALL);

include_once './config/database.php';

echo "--- North Scale Diagnostic ---\n";

try {
    $db = (new Database())->getConnection();
    echo "[OK] Database Connection Successful\n";

    // Check Users Table
    $checkTable = $db->query("SHOW TABLES LIKE 'users'");
    if ($checkTable->rowCount() > 0) {
        echo "[OK] Table 'users' exists\n";

        // Check api_token column
        $checkCol = $db->query("SHOW COLUMNS FROM users LIKE 'api_token'");
        if ($checkCol->rowCount() > 0) {
            echo "[OK] Column 'api_token' exists\n";
        } else {
            echo "[FAIL] Column 'api_token' MISSING!\n";

            // Attempt auto-fix
            try {
                $db->exec("ALTER TABLE users ADD COLUMN api_token VARCHAR(255) DEFAULT NULL");
                echo "[FIX] Attempted to add 'api_token' column... Success!\n";
            } catch (Exception $ex) {
                echo "[FIX] Failed to add column: " . $ex->getMessage() . "\n";
            }
        }
    } else {
        echo "[FAIL] Table 'users' MISSING!\n";
    }

    // Check Admin User
    $stmt = $db->prepare("SELECT id, email, password, api_token FROM users WHERE email = 'admin@diecast.com'");
    $stmt->execute();
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin) {
        echo "[OK] Admin user found\n";
        echo "Admin Token: " . ($admin['api_token'] ? "SET (" . substr($admin['api_token'], 0, 10) . "...)" : "NULL") . "\n";
    } else {
        echo "[WARN] Admin user NOT found\n";
    }

} catch (Exception $e) {
    echo "[CRITICAL] Connection Failed: " . $e->getMessage() . "\n";
}
echo "--- End Diagnostic ---\n";
?>