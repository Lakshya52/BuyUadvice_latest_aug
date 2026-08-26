<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['email'])) {
    jsonResponse(['error' => 'Email is required'], 400);
}

$email = strtolower(trim($input['email']));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Please enter a valid email address'], 400);
}

try {
    $db = getDB();

    $stmt = $db->prepare('SELECT id, password FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse([
            'exists'      => false,
            'has_password' => false,
        ]);
    }

    jsonResponse([
        'exists'       => true,
        'has_password' => !empty($user['password']),
    ]);
} catch (Exception $e) {
    jsonResponse(['error' => 'Something went wrong. Please try again.'], 500);
}
