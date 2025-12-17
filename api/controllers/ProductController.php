<?php
class ProductController
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
        if ($this->requestMethod === 'GET') {
            if ($this->id) {
                $this->getById($this->id);
            } else {
                $this->getAll();
            }
        } elseif ($this->requestMethod === 'POST') {
            if ($this->id && $_POST['_method'] === 'PUT') {
                // PHP doesn't parse FormData for PUT requests natively
                $this->update($this->id);
            } else {
                $this->create();
            }
        } elseif ($this->requestMethod === 'POST' && isset($_POST['_method']) && $_POST['_method'] === 'DELETE') {
            // For easy delete via POST
            $this->delete($this->id);
        } elseif ($this->requestMethod === 'DELETE') {
            $this->delete($this->id);
        } else {
            // Check for update via path if POST doesn't work well with FormData (common issue)
            if ($this->id && $this->requestMethod === 'POST') {
                $this->update($this->id);
            } else {
                header("HTTP/1.1 405 Method Not Allowed");
            }
        }
    }

    private function getAll()
    {
        // Build query with filters
        $sql = "SELECT p.*, c1.name as category_jenis_name, c2.name as category_merk_name 
                FROM products p
                LEFT JOIN categories c1 ON p.category_jenis_id = c1.id
                LEFT JOIN categories c2 ON p.category_merk_id = c2.id
                WHERE 1=1";

        $params = [];

        if (isset($_GET['category_jenis'])) {
            $sql .= " AND p.category_jenis_id = :category_jenis";
            $params[':category_jenis'] = $_GET['category_jenis'];
        }
        if (isset($_GET['category_merk'])) {
            $sql .= " AND p.category_merk_id = :category_merk";
            $params[':category_merk'] = $_GET['category_merk'];
        }
        if (isset($_GET['featured']) && $_GET['featured'] == 'true') {
            $sql .= " AND p.is_featured = 1";
        }
        if (isset($_GET['bestseller']) && $_GET['bestseller'] == 'true') {
            $sql .= " AND p.is_bestseller = 1";
        }
        if (isset($_GET['search'])) {
            $sql .= " AND (p.name LIKE :search OR p.description LIKE :search)";
            $params[':search'] = "%" . $_GET['search'] . "%";
        }

        $stmt = $this->conn->prepare($sql);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch images for each product (could be optimized)
        foreach ($products as &$product) {
            $stmtImg = $this->conn->prepare("SELECT * FROM product_images WHERE product_id = :pid");
            $stmtImg->execute([':pid' => $product['id']]);
            $product['images'] = $stmtImg->fetchAll(PDO::FETCH_ASSOC);

            // Format categories as expected by frontend
            $product['category_jenis'] = $product['category_jenis_id'] ? ['id' => $product['category_jenis_id'], 'name' => $product['category_jenis_name']] : null;
            $product['category_merk'] = $product['category_merk_id'] ? ['id' => $product['category_merk_id'], 'name' => $product['category_merk_name']] : null;

            // Fix boolean types
            $product['is_featured'] = (bool) $product['is_featured'];
            $product['is_bestseller'] = (bool) $product['is_bestseller'];
            // Main image
            $mainImg = current(array_filter($product['images'], fn($i) => $i['is_main']));
            $product['main_image'] = $mainImg ? $mainImg['image_path'] : ($product['images'][0]['image_path'] ?? null);
        }

        echo json_encode([
            "data" => $products,
            "total" => count($products),
            "per_page" => count($products),
            "current_page" => 1,
            "last_page" => 1
        ]);
    }

    private function getById($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            header("HTTP/1.1 404 Not Found");
            echo json_encode(["message" => "Product not found"]);
            return;
        }

        // Get images
        $stmtImg = $this->conn->prepare("SELECT * FROM product_images WHERE product_id = :pid");
        $stmtImg->execute([':pid' => $id]);
        $product['images'] = $stmtImg->fetchAll(PDO::FETCH_ASSOC);

        // Get Categories
        // Should fetch detailed category objects usually

        echo json_encode($product);
    }

    private function create()
    {
        // Using $_POST and $_FILES
        $name = $_POST['name'] ?? null;
        if (!$name) {
            header("HTTP/1.1 400 Bad Request");
            echo json_encode(["message" => "Name is required"]);
            return;
        }

        try {
            $query = "INSERT INTO products (name, slug, description, price, stock, weight, category_jenis_id, category_merk_id, is_featured, is_bestseller) 
                      VALUES (:name, :slug, :description, :price, :stock, :weight, :cat_jenis, :cat_merk, :featured, :bestseller)";

            $stmt = $this->conn->prepare($query);
            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));

            // Handle duplicate slug manually or just append time if needed, but for now simple format
            // Better: just let unique constraint fail if any, but we prefer not to fail.
            // Let's assume user handles unique names or we append random info?
            // For now, let's keep it simple but handle the error if it happens.

            $catJenis = !empty($_POST['category_jenis_id']) ? $_POST['category_jenis_id'] : null;
            $catMerk = !empty($_POST['category_merk_id']) ? $_POST['category_merk_id'] : null;

            $stmt->bindValue(':name', $name);
            $stmt->bindValue(':slug', $slug);
            $stmt->bindValue(':description', $_POST['description'] ?? '');
            $stmt->bindValue(':price', $_POST['price'] ?? 0);
            $stmt->bindValue(':stock', $_POST['stock'] ?? 0);
            $stmt->bindValue(':weight', $_POST['weight'] ?? 0);
            $stmt->bindValue(':cat_jenis', $catJenis);
            $stmt->bindValue(':cat_merk', $catMerk);
            $stmt->bindValue(':featured', (isset($_POST['is_featured']) && $_POST['is_featured'] === 'true' ? 1 : 0));
            $stmt->bindValue(':bestseller', (isset($_POST['is_bestseller']) && $_POST['is_bestseller'] === 'true' ? 1 : 0));

            if ($stmt->execute()) {
                $productId = $this->conn->lastInsertId();

                // Handle Images
                if (!empty($_FILES['images']['name'][0])) {
                    $this->handleImageUpload($productId, $_FILES['images']);
                }

                // Return created product (or just success message to avoid fetching again fails)
                $this->getById($productId);
            } else {
                throw new Exception("Database execution failed");
            }
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            // Check for duplicate entry
            if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                echo json_encode(["message" => "Product with this name/slug already exists"]);
            } else {
                echo json_encode(["message" => "Failed to create product: " . $e->getMessage()]);
            }
        }
    }

    private function update($id)
    {
        try {
            $name = $_POST['name'] ?? null;

            $query = "UPDATE products SET name = :name, description = :description, price = :price, stock = :stock, weight = :weight, 
                      category_jenis_id = :cat_jenis, category_merk_id = :cat_merk, is_featured = :featured, is_bestseller = :bestseller 
                      WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $catJenis = !empty($_POST['category_jenis_id']) ? $_POST['category_jenis_id'] : null;
            $catMerk = !empty($_POST['category_merk_id']) ? $_POST['category_merk_id'] : null;

            $stmt->bindValue(':name', $name);
            $stmt->bindValue(':description', $_POST['description'] ?? '');
            $stmt->bindValue(':price', $_POST['price'] ?? 0);
            $stmt->bindValue(':stock', $_POST['stock'] ?? 0);
            $stmt->bindValue(':weight', $_POST['weight'] ?? 0);
            $stmt->bindValue(':cat_jenis', $catJenis);
            $stmt->bindValue(':cat_merk', $catMerk);
            $stmt->bindValue(':featured', (isset($_POST['is_featured']) && $_POST['is_featured'] === 'true' ? 1 : 0));
            $stmt->bindValue(':bestseller', (isset($_POST['is_bestseller']) && $_POST['is_bestseller'] === 'true' ? 1 : 0));
            $stmt->bindValue(':id', $id);

            $stmt->execute();

            // Handle new images
            if (!empty($_FILES['images']['name'][0])) {
                $this->handleImageUpload($id, $_FILES['images']);
            }

            // Handle images to remove
            if (isset($_POST['remove_images']) && is_array($_POST['remove_images'])) {
                foreach ($_POST['remove_images'] as $imgId) {
                    // Get path to delete file
                    $stmtPath = $this->conn->prepare("SELECT image_path FROM product_images WHERE id = :id");
                    $stmtPath->execute([':id' => $imgId]);
                    $pathRow = $stmtPath->fetch(PDO::FETCH_ASSOC);

                    if ($pathRow) {
                        // Delete from DB
                        $delStmt = $this->conn->prepare("DELETE FROM product_images WHERE id = :id");
                        $delStmt->execute([':id' => $imgId]);

                        // Delete file (convert URL path back to file path)
                        // URL: /uploads/filename -> File: ../public/uploads/filename
                        $filePath = "../public" . $pathRow['image_path'];
                        if (file_exists($filePath)) {
                            unlink($filePath);
                        }
                    }
                }
            }

            $this->getById($id);
        } catch (Exception $e) {
            header("HTTP/1.1 500 Internal Server Error");
            echo json_encode(["message" => "Update failed: " . $e->getMessage()]);
        }
    }

    private function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM products WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Product deleted"]);
    }

    private function handleImageUpload($productId, $files)
    {
        // Ensure uploads directory exists
        $targetDir = "../public/uploads/";
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        foreach ($files['name'] as $key => $name) {
            if ($files['error'][$key] == 0) {
                $fileName = time() . '_' . basename($name);
                $targetFilePath = $targetDir . $fileName;

                if (move_uploaded_file($files['tmp_name'][$key], $targetFilePath)) {
                    // Save to DB
                    // URL path: /uploads/filename (Proxied by Vite)
                    $dbPath = "/uploads/" . $fileName;

                    $stmt = $this->conn->prepare("INSERT INTO product_images (product_id, image_path, is_main) VALUES (:pid, :path, :main)");
                    $isMain = ($key === 0); // Logic can be more complex
                    $stmt->execute([':pid' => $productId, ':path' => $dbPath, ':main' => $isMain ? 1 : 0]);
                }
            }
        }
    }
}
?>