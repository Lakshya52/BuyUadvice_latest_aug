<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['password'])) {
    jsonResponse(['error' => 'Password is required'], 400);
}

$password = $input['password'];

if (strlen($password) < 8) {
    jsonResponse(['error' => 'Password must be at least 8 characters'], 400);
}

if (!preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/[0-9]/', $password)) {
    jsonResponse(['error' => 'Password must include uppercase, lowercase, and a number'], 400);
}

try {
    $db = getDB();
    $hashed = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare('UPDATE users SET password = ? WHERE id = ?');
    $stmt->execute([$hashed, $user['id']]);

    jsonResponse([
        'message' => 'Password set successfully',
    ]);
} catch (Exception $e) {
    jsonResponse(['error' => 'Something went wrong. Please try again.'], 500);
}
