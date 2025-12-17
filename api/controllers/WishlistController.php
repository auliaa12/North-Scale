<?php
class WishlistController
{
    private $conn;
    private $requestMethod;
    private $userId;

    public function __construct($db, $requestMethod, $userId = null)
    {
        $this->conn = $db;
        $this->requestMethod = $requestMethod;
        $this->userId = $userId;
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if (isset($_GET['user_id'])) {
                    if (isset($_GET['check_product_id'])) {
                        $this->checkWishlist($_GET['user_id'], $_GET['check_product_id']);
                    } else {
                        $this->getWishlist($_GET['user_id']);
                    }
                } else {
                    $this->badRequest();
                }
                break;
            case 'POST':
                $this->addToWishlist();
                break;
            case 'DELETE':
                if (isset($_GET['user_id']) && isset($_GET['product_id'])) {
                    $this->removeFromWishlist($_GET['user_id'], $_GET['product_id']);
                } else {
                    $this->badRequest();
                }
                break;
            default:
                $this->notFound();
                break;
        }
    }

    private function getWishlist($userId)
    {
        $query = "SELECT w.*, p.name as product_name, p.price as product_price, 
                         (SELECT image_path FROM product_images WHERE product_id = p.id AND is_main = 1 LIMIT 1) as product_image
                  FROM wishlists w
                  JOIN products p ON w.product_id = p.id
                  WHERE w.user_id = :user_id";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([':user_id' => $userId]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fix image paths
        foreach ($items as &$item) {
            if (!$item['product_image']) {
                $stmtImg = $this->conn->prepare("SELECT image_path FROM product_images WHERE product_id = :pid LIMIT 1");
                $stmtImg->execute([':pid' => $item['product_id']]);
                $img = $stmtImg->fetch(PDO::FETCH_ASSOC);
                $item['product_image'] = $img ? $img['image_path'] : null;
            }
        }

        echo json_encode(["data" => $items]);
    }

    private function checkWishlist($userId, $productId)
    {
        $stmt = $this->conn->prepare("SELECT id FROM wishlists WHERE user_id = :uid AND product_id = :pid");
        $stmt->execute([':uid' => $userId, ':pid' => $productId]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["exists" => true]);
        } else {
            echo json_encode(["exists" => false]);
        }
    }

    private function addToWishlist()
    {
        $data = json_decode(file_get_contents("php://input"));
        if (!isset($data->user_id) || !isset($data->product_id)) {
            $this->badRequest();
            return;
        }

        // Check duplicate
        $check = $this->conn->prepare("SELECT id FROM wishlists WHERE user_id = :uid AND product_id = :pid");
        $check->execute([':uid' => $data->user_id, ':pid' => $data->product_id]);
        if ($check->rowCount() > 0) {
            echo json_encode(["message" => "Already in wishlist"]);
            return;
        }

        $stmt = $this->conn->prepare("INSERT INTO wishlists (user_id, product_id) VALUES (:uid, :pid)");
        if ($stmt->execute([':uid' => $data->user_id, ':pid' => $data->product_id])) {
            echo json_encode(["message" => "Added to wishlist"]);
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["message" => "Failed to add"]);
        }
    }

    private function removeFromWishlist($userId, $productId)
    {
        $stmt = $this->conn->prepare("DELETE FROM wishlists WHERE user_id = :uid AND product_id = :pid");
        if ($stmt->execute([':uid' => $userId, ':pid' => $productId])) {
            echo json_encode(["message" => "Removed from wishlist"]);
        } else {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["message" => "Failed to remove"]);
        }
    }

    private function badRequest()
    {
        header("HTTP/1.1 400 Bad Request");
        echo json_encode(["message" => "Invalid request"]);
    }

    private function notFound()
    {
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["message" => "Not Found"]);
    }
}
?>