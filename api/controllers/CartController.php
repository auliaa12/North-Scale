<?php
class CartController
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
        // Implementation for valid Cart logic or placeholder
        // Since cart is often local-first, we'll implement sync endpoints or just basics
        if ($this->requestMethod === 'GET') {
            $this->getCart();
        } elseif ($this->requestMethod === 'POST') {
            $this->addToCart();
        } elseif ($this->requestMethod === 'DELETE') {
            $this->removeFromCart();
        } elseif ($this->requestMethod === 'PUT') {
            $this->updateCart();
        }
    }

    private function getCart()
    {
        $userId = $_GET['user_id'] ?? null;
        $sessionId = $_GET['session_id'] ?? null;

        $sql = "SELECT c.*, p.name as product_name, p.price as product_price, pi.image_path as product_image 
                FROM cart_items c
                JOIN products p ON c.product_id = p.id
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_main = 1
                WHERE 1=1";

        $params = [];
        if ($userId) {
            $sql .= " AND c.user_id = :uid";
            $params[':uid'] = $userId;
        } elseif ($sessionId) {
            $sql .= " AND c.session_id = :sid";
            $params[':sid'] = $sessionId;
        } else {
            echo json_encode(["data" => []]);
            return;
        }

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        $cart = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["data" => $cart]);
    }

    private function addToCart()
    {
        $data = json_decode(file_get_contents("php://input"));

        if (!isset($data->product_id) || !isset($data->quantity)) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["message" => "Missing required fields"]);
            return;
        }

        $userId = $data->user_id ?? null;
        $sessionId = $data->session_id ?? null;

        if (!$userId && !$sessionId) {
            // For now, if no user ID, we can't save (unless we implement session logic fully).
            // But frontend typically sends user_id if logged in.
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["message" => "User ID or Session ID required"]);
            return;
        }

        // Check if item exists
        $checkSql = "SELECT id, quantity FROM cart_items WHERE product_id = :pid";
        $checkParams = [':pid' => $data->product_id];

        if ($userId) {
            $checkSql .= " AND user_id = :uid";
            $checkParams[':uid'] = $userId;
        } else {
            $checkSql .= " AND session_id = :sid";
            $checkParams[':sid'] = $sessionId;
        }

        $stmt = $this->conn->prepare($checkSql);
        $stmt->execute($checkParams);

        if ($stmt->rowCount() > 0) {
            // Update quantity
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $newQuantity = $row['quantity'] + $data->quantity;

            $updateSql = "UPDATE cart_items SET quantity = :qty WHERE id = :id";
            $updateStmt = $this->conn->prepare($updateSql);
            $updateStmt->execute([':qty' => $newQuantity, ':id' => $row['id']]);
        } else {
            // Insert
            $insertSql = "INSERT INTO cart_items (user_id, session_id, product_id, quantity) VALUES (:uid, :sid, :pid, :qty)";
            $insertStmt = $this->conn->prepare($insertSql);
            $insertStmt->execute([
                ':uid' => $userId,
                ':sid' => $sessionId,
                ':pid' => $data->product_id,
                ':qty' => $data->quantity
            ]);
        }

        echo json_encode(["message" => "Item added successfully"]);
    }

    private function removeFromCart()
    {
        // Parse ID from URL
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $uriSegments = explode('/', $uri);
        // Assuming /api/cart/{id}
        // or /api/cart?user_id={id} for clear cart

        if (isset($_GET['user_id']) && !isset($this->id)) {
            // Clear Cart for user
            $this->clearCart($_GET['user_id']);
            return;
        }

        if ($this->id) {
            $stmt = $this->conn->prepare("DELETE FROM cart_items WHERE id = :id");
            if ($stmt->execute([':id' => $this->id])) {
                echo json_encode(["message" => "Item removed"]);
            } else {
                header("HTTP/1.1 500 Internal Server Error");
                echo json_encode(["message" => "Failed to remove item"]);
            }
        } else {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["message" => "ID required"]);
        }
    }

    private function clearCart($userId)
    {
        $stmt = $this->conn->prepare("DELETE FROM cart_items WHERE user_id = :uid");
        if ($stmt->execute([':uid' => $userId])) {
            echo json_encode(["message" => "Cart cleared"]);
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["message" => "Failed to clear cart"]);
        }
    }

    private function updateCart() // Handle PUT
    {
        $data = json_decode(file_get_contents("php://input"));
        if ($this->id && isset($data->quantity)) {
            $stmt = $this->conn->prepare("UPDATE cart_items SET quantity = :qty WHERE id = :id");
            if ($stmt->execute([':qty' => $data->quantity, ':id' => $this->id])) {
                echo json_encode(["message" => "Cart updated"]);
            } else {
                header("HTTP/1.1 500 Internal Server Error");
                echo json_encode(["message" => "Failed to update cart"]);
            }
        } else {
            header("HTTP/1.1 400 Bad Request");
        }
    }
}
?>