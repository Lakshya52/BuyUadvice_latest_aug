<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['email']) || empty($input['password'])) {
    jsonResponse(['error' => 'Email and password are required'], 400);
}

$email = strtolower(trim($input['email']));
$password = $input['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Please enter a valid email address'], 400);
}

try {
    $db = getDB();

    $stmt = $db->prepare('SELECT id, name, email, avatar, password FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse(['error' => 'No account found with this email'], 400);
    }

    if (empty($user['password'])) {
        jsonResponse(['error' => 'Please login with OTP first'], 400);
    }

    if (!password_verify($password, $user['password'])) {
        jsonResponse(['error' => 'Incorrect password. Please try again.'], 400);
    }

    unset($user['password']);

    $_SESSION['user'] = [
        'id'     => (int) $user['id'],
        'name'   => $user['name'],
        'email'  => $user['email'],
        'avatar' => $user['avatar'],
    ];

    jsonResponse([
        'message' => 'Login successful',
        'user'    => $_SESSION['user'],
    ]);
} catch (Exception $e) {
    jsonResponse(['error' => 'Something went wrong. Please try again.'], 500);
}
