<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// تنظیمات دیتابیس - این مقادیر را با اطلاعات هاست خود تغییر دهید
$DB_HOST = 'localhost';
$DB_NAME = 'clinic_db';
$DB_USER = 'clinic_user';
$DB_PASS = 'your_password_here';

try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

// ایجاد جداول
function createTables($pdo) {
    $pdo->exec("CREATE TABLE IF NOT EXISTS doctors (
        id INT PRIMARY KEY DEFAULT 1,
        data JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
    
    $pdo->exec("CREATE TABLE IF NOT EXISTS articles (
        id INT PRIMARY KEY DEFAULT 1,
        data JSON NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )");
}

createTables($pdo);

$method = $_SERVER['REQUEST_METHOD'];
$path = isset($_GET['path']) ? $_GET['path'] : '';

// مسیریابی
if ($path === 'doctors') {
    handleDoctors($method, $pdo);
} elseif ($path === 'articles') {
    handleArticles($method, $pdo);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}

function handleDoctors($method, $pdo) {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT data FROM doctors WHERE id = 1");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            echo $row['data'];
        } else {
            echo json_encode([]);
        }
    } elseif ($method === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON data']);
            return;
        }
        
        $stmt = $pdo->prepare("SELECT id FROM doctors WHERE id = 1");
        $stmt->execute();
        
        if ($stmt->fetch()) {
            $stmt = $pdo->prepare("UPDATE doctors SET data = ? WHERE id = 1");
        } else {
            $stmt = $pdo->prepare("INSERT INTO doctors (id, data) VALUES (1, ?)");
        }
        
        $stmt->execute([json_encode($data, JSON_UNESCAPED_UNICODE)]);
        echo json_encode(['success' => true, 'message' => 'Doctors data saved']);
    }
}

function handleArticles($method, $pdo) {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT data FROM articles WHERE id = 1");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            echo $row['data'];
        } else {
            echo json_encode([]);
        }
    } elseif ($method === 'POST') {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON data']);
            return;
        }
        
        $stmt = $pdo->prepare("SELECT id FROM articles WHERE id = 1");
        $stmt->execute();
        
        if ($stmt->fetch()) {
            $stmt = $pdo->prepare("UPDATE articles SET data = ? WHERE id = 1");
        } else {
            $stmt = $pdo->prepare("INSERT INTO articles (id, data) VALUES (1, ?)");
        }
        
        $stmt->execute([json_encode($data, JSON_UNESCAPED_UNICODE)]);
        echo json_encode(['success' => true, 'message' => 'Articles data saved']);
    }
}
?>
