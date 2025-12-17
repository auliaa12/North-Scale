<?php
class UserController
{
    private $conn;
    private $requestMethod;
    private $id;

    public function __construct($db, $requestMethod, $id)
    {
        $this->conn = $db;
        $this->requestMethod = $requestMethod;
        $this->id = $id;
    }

    public function processRequest()
    {
        if ($this->id) {
            if ($this->requestMethod === 'POST' || $this->requestMethod === 'PUT') {
                $this->update($this->id);
            } else {
                $this->methodNotAllowed();
            }
        } else {
            $this->notFound();
        }
    }

    private function update($id)
    {
        // Handle _method spoofing if strictly needed, but typically POST is fine for us
        // Parse input (could be FormData or JSON)
        if ($_SERVER['CONTENT_TYPE'] && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
            $data = json_decode(file_get_contents("php://input"), true);
        } else {
            $data = $_POST;
        }

        if (!$data) {
            $data = []; // Fallback
        }

        // Allowed fields to update
        $name = isset($data['name']) ? $data['name'] : null;
        $email = isset($data['email']) ? $data['email'] : null;
        $phone = isset($data['phone']) ? $data['phone'] : null;
        $address = isset($data['address']) ? $data['address'] : null;

        // Build SQL dynamically
        $fields = [];
        $params = [':id' => $id];

        if ($name) {
            $fields[] = "name = :name";
            $params[':name'] = $name;
        }
        if ($email) {
            $fields[] = "email = :email";
            $params[':email'] = $email;
        }
        if ($phone) {
            $fields[] = "phone = :phone";
            $params[':phone'] = $phone;
        }
        if ($address) {
            $fields[] = "address = :address";
            $params[':address'] = $address;
        }

        if (empty($fields)) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["message" => "No fields to update"]);
            return;
        }

        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";

        try {
            $stmt = $this->conn->prepare($sql);
            $stmt->execute($params);

            // Return updated user
            $stmtUser = $this->conn->prepare("SELECT id, name, email, phone, address, role FROM users WHERE id = :id");
            $stmtUser->execute([':id' => $id]);
            $updatedUser = $stmtUser->fetch(PDO::FETCH_ASSOC);

            echo json_encode([
                "message" => "Profile updated successfully",
                "data" => $updatedUser
            ]);
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["message" => "Update failed: " . $e->getMessage()]);
        }
    }

    private function methodNotAllowed()
    {
        header("HTTP/1.1 405 Method Not Allowed");
        echo json_encode(["message" => "Method not allowed"]);
    }

    private function notFound()
    {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["message" => "User not found"]);
    }
}
?>