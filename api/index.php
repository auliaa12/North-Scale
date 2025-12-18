<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include_once './config/database.php';
include_once './controllers/AuthController.php';
include_once './controllers/ProductController.php';
include_once './controllers/CategoryController.php';
include_once './controllers/OrderController.php';
include_once './controllers/CartController.php';
include_once './controllers/CartController.php';
include_once './controllers/ChatController.php';
include_once './controllers/UserController.php';
include_once './controllers/WishlistController.php';

$database = new Database();
$db = $database->getConnection();

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Adjust based on your local path, e.g., /northscale/api/products
// $uri[1] might be 'northscale', $uri[2] 'api', $uri[3] 'products'
// We need to find where 'api' is and take the next segment
$apiIndex = array_search('api', $uri);
$resource = null;
$id = null;

if ($apiIndex !== false && isset($uri[$apiIndex + 1])) {
    $resource = $uri[$apiIndex + 1];
    // Handle trailing slash (empty resource)
    if ($resource === '') {
        echo json_encode(["message" => "Welcome to North Scale API"]);
        exit;
    }
    if (isset($uri[$apiIndex + 2])) {
        $id = $uri[$apiIndex + 2];
    }
} else {
    echo json_encode(["message" => "Welcome to North Scale API"]);
    exit;
}

$requestMethod = $_SERVER["REQUEST_METHOD"];

switch ($resource) {
    case 'check_status.php':
        include __DIR__ . '/check_status.php';
        exit;
    case 'update_db.php':
        include __DIR__ . '/update_db.php';
        exit;
    case 'auth':
        $controller = new AuthController($db, $requestMethod, $id);
        $controller->processRequest();
        break;
    case 'products':
        $controller = new ProductController($db, $requestMethod, $id);
        $controller->processRequest();
        break;
    case 'categories':
        $controller = new CategoryController($db, $requestMethod, $id);
        $controller->processRequest();
        break;
    case 'orders':
        $controller = new OrderController($db, $requestMethod, $id);
        $controller->processRequest();
        break;
    case 'cart':
        $controller = new CartController($db, $requestMethod, $id);
        $controller->processRequest();
        break;
    case 'chat':
        $controller = new ChatController($db, $requestMethod, $id);
        $controller->processRequest();
        break;
    case 'users':
        $controller = new UserController($db, $requestMethod, $id);
        $controller->processRequest();
        break;
    case 'wishlist':
        $controller = new WishlistController($db, $requestMethod, $id);
        $controller->processRequest();
        break;
    default:
        header("HTTP/1.1 404 Not Found");
        echo json_encode(["message" => "Resource not found"]);
        break;
}
?>