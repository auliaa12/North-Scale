<?php
class ChatController
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
        echo json_encode(["message" => "Chat API implemented"]);
    }
}
?>