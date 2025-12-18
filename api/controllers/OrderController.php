<?php
class OrderController
{
    private $conn;
    private $requestMethod;
    private $id;

    public function __construct($db, $requestMethod, $id)
    {
        $this->conn = $db;
        $this->requestMethod = $requestMethod;
        $this->id = $id;
        $this->logDebug("OrderController Init: Method=$requestMethod, ID=" . ($id ?? 'NULL'));
    }

    public function processRequest()
    {
        $this->logDebug("Processing Request: Method=" . $this->requestMethod . ", ID=" . ($this->id ?? 'NULL'));

        if ($this->requestMethod === 'GET') {
            if ($this->id) {
                $this->getById($this->id);
            } else {
                $this->getAll();
            }
        } elseif ($this->requestMethod === 'POST') {
            if ($this->id) {
                $this->logDebug("Routing to updateStatus($this->id)");
                $this->updateStatus($this->id);
            } else {
                $this->logDebug("Routing to create()");
                $this->create();
            }
        }
    }

    private function getAll()
    {
        $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
        $status = isset($_GET['status']) ? $_GET['status'] : null;

        $sql = "SELECT * FROM orders WHERE 1=1";
        $params = [];

        if ($userId) {
            $sql .= " AND user_id = :uid";
            $params[':uid'] = $userId;
        }

        if ($status) {
            $sql .= " AND status = :status";
            $params[':status'] = $status;
        }

        $sql .= " ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute($params);
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Populate items with product images
        foreach ($orders as &$order) {
            $stmtItems = $this->conn->prepare("
                SELECT oi.*, p.name as product_name, pi.image_path as main_image 
                FROM order_items oi
                LEFT JOIN products p ON oi.product_id = p.id
                LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_main = 1
                WHERE oi.order_id = :oid
                GROUP BY oi.id
            ");
            $stmtItems->execute([':oid' => $order['id']]);
            $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

            foreach ($items as &$item) {
                $item['product'] = [
                    'id' => $item['product_id'],
                    'name' => $item['product_name'],
                    'main_image' => $item['main_image']
                ];
                if (!$item['product']['main_image']) {
                    $stmtImg = $this->conn->prepare("SELECT image_path FROM product_images WHERE product_id = :pid LIMIT 1");
                    $stmtImg->execute([':pid' => $item['product_id']]);
                    $img = $stmtImg->fetch(PDO::FETCH_ASSOC);
                    if ($img)
                        $item['product']['main_image'] = $img['image_path'];
                }
            }
            $order['items'] = $items;
        }

        echo json_encode([
            "data" => $orders,
            "total" => count($orders),
            "per_page" => count($orders),
            "current_page" => 1,
            "last_page" => 1
        ]);
    }

    private function getById($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM orders WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($order) {
            $stmtItems = $this->conn->prepare("SELECT * FROM order_items WHERE order_id = :oid");
            $stmtItems->execute([':oid' => $order['id']]);
            $order['items'] = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(["data" => $order]);
        } else {
            header("HTTP/1.1 404 Not Found");
            echo json_encode(["message" => "Order not found"]);
        }
    }

    private function create()
    {
        $data = json_decode(file_get_contents("php://input"));

        try {
            $this->logDebug("Order Create Payload: " . json_encode($data));

            $this->conn->beginTransaction();

            $orderNumber = 'ORD-' . time() . '-' . rand(100, 999); // More unique

            // Handle address fallback
            $customerAddress = isset($data->customer_address) && !empty($data->customer_address)
                ? $data->customer_address
                : $data->shipping_address;

            $userId = isset($data->user_id) ? $data->user_id : null;

            $sql = "INSERT INTO orders (user_id, order_number, customer_name, customer_email, customer_phone, customer_address, shipping_address, notes, total_amount, status) 
                    VALUES (:uid, :num, :name, :email, :phone, :addr, :ship, :notes, :total, 'pending')";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                ':uid' => $userId,
                ':num' => $orderNumber,
                ':name' => $data->customer_name,
                ':email' => $data->customer_email,
                ':phone' => $data->customer_phone,
                ':addr' => $customerAddress,
                ':ship' => $data->shipping_address,
                ':notes' => $data->notes ?? '',
                ':total' => $data->total_amount
            ]);
            $orderId = $this->conn->lastInsertId();

            if (!isset($data->items) || !is_array($data->items)) {
                throw new Exception("Order items definition is missing or invalid");
            }

            foreach ($data->items as $item) {
                // Validate item fields
                if (!isset($item->product_id) || !isset($item->quantity)) {
                    throw new Exception("Invalid item data: missing product_id or quantity");
                }

                $sqlItem = "INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, subtotal) 
                            VALUES (:oid, :pid, :pname, :pprice, :qty, :sub)";
                $stmtItem = $this->conn->prepare($sqlItem);
                $stmtItem->execute([
                    ':oid' => $orderId,
                    ':pid' => $item->product_id,
                    ':pname' => $item->product_name ?? 'Product Unknown',
                    ':pprice' => $item->product_price ?? 0,
                    ':qty' => $item->quantity,
                    ':sub' => $item->subtotal ?? 0
                ]);
            }

            $this->conn->commit();
            echo json_encode([
                "data" => [
                    "id" => $orderId,
                    "order_number" => $orderNumber,
                    "debug_user_id" => $userId,
                    "debug_total" => $data->total_amount
                ]
            ]);
        } catch (Exception $e) {
            $this->conn->rollBack();
            $this->logDebug("Order Creation Error: " . $e->getMessage());
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["message" => "Order creation failed: " . $e->getMessage()]);
        }
    }

    private function logDebug($message)
    {
        $logFile = dirname(__DIR__) . '/order_debug.log';
        $timestamp = date('Y-m-d H:i:s');
        file_put_contents($logFile, "[$timestamp] $message" . PHP_EOL, FILE_APPEND);
    }


    private function updateStatus($id)
    {
        $input = file_get_contents("php://input");
        $data = json_decode($input);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->logDebug("JSON Decode Error: " . json_last_error_msg() . " | Raw Input: " . $input);
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["message" => "Invalid JSON input"]);
            return;
        }

        if (!isset($data->status)) {
            $this->logDebug("Missing status in payload. Input object: " . json_encode($data));
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["message" => "Status is required"]);
            return;
        }

        $status = $data->status;

        $this->logDebug("Executing Update: ID=$id, Status=$status");

        $stmt = $this->conn->prepare("UPDATE orders SET status = :status WHERE id = :id");
        $stmt->execute([':status' => $status, ':id' => $id]);

        if ($stmt->rowCount() > 0) {
            $this->logDebug("Update Success. Rows affected: " . $stmt->rowCount());
        } else {
            $this->logDebug("Update Failed. Rows affected: " . $stmt->rowCount() . ". Check if ID '$id' exists or Status was already '$status'.");
        }

        echo json_encode(["message" => "Status updated"]);
    }
}
?>