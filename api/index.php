<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// تنظیمات دیتابیس - این مقادیر را تغییر دهید
$DB_HOST = 'localhost';
$DB_NAME = 'clinic_db';
$DB_USER = 'clinic_user';
$DB_PASS = 'your_password';

try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Connection failed']);
    exit;
}

// ایجاد جداول
$pdo->exec("CREATE TABLE IF NOT EXISTS doctors (id INT PRIMARY KEY DEFAULT 1, data JSON NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
$pdo->exec("CREATE TABLE IF NOT EXISTS articles (id INT PRIMARY KEY DEFAULT 1, data JSON NOT NULL, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");

$path = $_GET['path'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if ($path === 'doctors') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT data FROM doctors WHERE id = 1");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo $row ? $row['data'] : '[]';
    } elseif ($method === 'POST') {
        $input = file_get_contents('php://input');
        $stmt = $pdo->prepare("SELECT id FROM doctors WHERE id = 1");
        $stmt->execute();
        if ($stmt->fetch()) {
            $stmt = $pdo->prepare("UPDATE doctors SET data = ? WHERE id = 1");
        } else {
            $stmt = $pdo->prepare("INSERT INTO doctors (id, data) VALUES (1, ?)");
        }
        $stmt->execute([$input]);
        echo json_encode(['success' => true]);
    }
} elseif ($path === 'articles') {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT data FROM articles WHERE id = 1");
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo $row ? $row['data'] : '[]';
    } elseif ($method === 'POST') {
        $input = file_get_contents('php://input');
        $stmt = $pdo->prepare("SELECT id FROM articles WHERE id = 1");
        $stmt->execute();
        if ($stmt->fetch()) {
            $stmt = $pdo->prepare("UPDATE articles SET data = ? WHERE id = 1");
        } else {
            $stmt = $pdo->prepare("INSERT INTO articles (id, data) VALUES (1, ?)");
        }
        $stmt->execute([$input]);
        echo json_encode(['success' => true]);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
}
?>
