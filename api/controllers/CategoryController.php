<?php
class CategoryController
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
            if ($this->id) {
                $this->update($this->id);
            } else {
                $this->create();
            }
        } elseif ($this->requestMethod === 'DELETE') {
            $this->delete($this->id);
        }
    }

    private function getAll()
    {
        $sql = "SELECT * FROM categories WHERE 1=1";
        if (isset($_GET['type'])) {
            $sql .= " AND type = '" . $_GET['type'] . "'";
        }
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["data" => $categories]);
    }

    private function getById($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM categories WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $category = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($category) {
            echo json_encode(["data" => $category]);
        } else {
            header("HTTP/1.1 404 Not Found");
            echo json_encode(["message" => "Category not found"]);
        }
    }

    private function create()
    {
        $data = json_decode(file_get_contents("php://input"));
        $sql = "INSERT INTO categories (name, slug, type, description) VALUES (:name, :slug, :type, :description)";
        $stmt = $this->conn->prepare($sql);
        $slug = strtolower(str_replace(' ', '-', $data->name));
        $stmt->execute([
            ':name' => $data->name,
            ':slug' => $slug,
            ':type' => $data->type ?? 'jenis',
            ':description' => $data->description ?? ''
        ]);
        echo json_encode(["data" => ["id" => $this->conn->lastInsertId(), "name" => $data->name]]);
    }

    private function update($id)
    {
        $data = json_decode(file_get_contents("php://input"));
        $sql = "UPDATE categories SET name = :name, type = :type, description = :description WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            ':name' => $data->name,
            ':type' => $data->type ?? 'jenis',
            ':description' => $data->description ?? '',
            ':id' => $id
        ]);
        echo json_encode(["message" => "Category updated"]);
    }

    private function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM categories WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Category deleted"]);
    }
}
?>