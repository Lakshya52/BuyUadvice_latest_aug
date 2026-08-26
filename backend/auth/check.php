<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

if (empty($_SESSION['user'])) {
    jsonResponse(['authenticated' => false], 401);
}

$hasPassword = false;
try {
    $db = getDB();
    $stmt = $db->prepare('SELECT password FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user']['id']]);
    $row = $stmt->fetch();
    $hasPassword = $row && !empty($row['password']);
} catch (Exception $e) {}

jsonResponse([
    'authenticated' => true,
    'user'          => $_SESSION['user'],
    'has_password'  => $hasPassword,
]);
