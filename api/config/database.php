<?php
class Database
{
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;

    public function __construct()
    {
        // Use environment variables if set (for production/Render)
        // Otherwise default to localhost (for local development)
        $this->host = getenv('DB_HOST') ?: 'sql12.freesqldatabase.com';
        $this->db_name = getenv('DB_NAME') ?: 'sql12812317';
        $this->username = getenv('DB_USER') ?: 'sql12812317';
        $this->password = getenv('DB_PASS') ?: 'jfd4ciqvnE';
    }

    public function getConnection()
    {
        $this->conn = null;

        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->exec("set names utf8");
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
?>