<?php
class AuthController
{
    private $conn;
    private $requestMethod;
    private $action;

    public function __construct($db, $requestMethod, $action)
    {
        $this->conn = $db;
        $this->requestMethod = $requestMethod;
        $this->action = $action;
    }

    public function processRequest()
    {
        if ($this->requestMethod === 'POST') {
            if ($this->action === 'login') {
                $this->login();
            } elseif ($this->action === 'register') {
                $this->register();
            } elseif ($this->action === 'logout') {
                $this->logout();
            } else {
                $this->notFound();
            }
        } elseif ($this->requestMethod === 'GET') {
            if ($this->action === 'user') {
                $this->getUser();
            } else {
                $this->notFound();
            }
        } else {
            $this->notFound();
        }
    }

    private function login()
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->email) || !isset($data->password)) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["message" => "Email and password are required"]);
            return;
        }

        $query = "SELECT id, name, email, password, role FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $data->email);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            if (password_verify($data->password, $row['password'])) {
                // Generate a simple token
                $token = bin2hex(random_bytes(32));

                // Save token to DB
                $updateQuery = "UPDATE users SET api_token = :token WHERE id = :id";
                $updateStmt = $this->conn->prepare($updateQuery);
                $updateStmt->bindParam(":token", $token);
                $updateStmt->bindParam(":id", $row['id']);
                $updateStmt->execute();

                echo json_encode([
                    "user" => [
                        "id" => $row['id'],
                        "name" => $row['name'],
                        "email" => $row['email'],
                        "role" => $row['role']
                    ],
                    "token" => $token
                ]);
            } else {
                header("HTTP/1.1 401 Unauthorized");
                echo json_encode(["message" => "Email atau password salah"]);
            }
        } else {
            header("HTTP/1.1 401 Unauthorized");
            echo json_encode(["message" => "Email atau password salah"]);
        }
    }

    private function register()
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->name) || !isset($data->email) || !isset($data->password)) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["message" => "Missing required fields"]);
            return;
        }

        // Check if email exists
        $checkQuery = "SELECT id FROM users WHERE email = :email";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->bindParam(":email", $data->email);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            header("HTTP/1.1 409 Conflict");
            echo json_encode(["message" => "Email already exists"]);
            return;
        }

        $query = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
        $stmt = $this->conn->prepare($query);

        $password_hash = password_hash($data->password, PASSWORD_BCRYPT);
        $role = 'customer'; // Default role

        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":email", $data->email);
        $stmt->bindParam(":password", $password_hash);
        $stmt->bindParam(":role", $role);

        if ($stmt->execute()) {
            echo json_encode(["message" => "User registered successfully"]);
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["message" => "Registration failed"]);
        }
    }

    private function logout()
    {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $token = str_replace('Bearer ', '', $headers['Authorization']);
            $query = "UPDATE users SET api_token = NULL WHERE api_token = :token";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":token", $token);
            $stmt->execute();
        }
        echo json_encode(["message" => "Logged out successfully"]);
    }

    private function getAuthorizationHeader()
    {
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            // Server-side fix for bug in old Android versions (a nice to have!)
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        return $headers;
    }

    private function logDebug($message)
    {
        $logFile = __DIR__ . '/../auth_debug.log';
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
    }

    private function getUser()
    {
        // Debug
        $this->logDebug("getUser called. Headers: " . json_encode(getallheaders()));

        // Verify 'Authorization' header
        $authHeader = $this->getAuthorizationHeader();

        if (!$authHeader) {
            $this->logDebug("No Authorization header found");
            header("HTTP/1.1 401 Unauthorized");
            echo json_encode(["message" => "No token provided"]);
            return;
        }

        $token = str_replace('Bearer ', '', $authHeader);
        $this->logDebug("Token extraction attempt. Token length: " . strlen($token));

        $query = "SELECT id, name, email, role FROM users WHERE api_token = :token LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":token", $token);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $this->logDebug("User found: " . $user['email']);
            echo json_encode([
                "id" => $user['id'],
                "name" => $user['name'],
                "email" => $user['email'],
                "role" => $user['role']
            ]);
        } else {
            $this->logDebug("Invalid token lookup. Token: $token");
            header("HTTP/1.1 401 Unauthorized");
            // Important: Return generic 401 so frontend clears token
            echo json_encode(["message" => "Invalid token"]);
        }
    }

    private function notFound()
    {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["message" => "Endpoint not found"]);
    }
}
?>