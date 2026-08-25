<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['identifier'])) {
    jsonResponse(['error' => 'Email or phone is required'], 400);
}

$identifier = trim($input['identifier']);
$isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);
$isPhone = preg_match('/^[6-9]\d{9}$/', $identifier);

if (!$isEmail && !$isPhone) {
    jsonResponse(['error' => 'Enter a valid email or 10-digit phone number'], 400);
}

$db = getDB();

$stmt = $db->prepare('SELECT id, name, email, avatar FROM users WHERE email = ?');
$stmt->execute([$isEmail ? $identifier : null]);
$user = $stmt->fetch();

if (!$user && $isPhone) {
    $stmt = $db->prepare('SELECT id, name, email, avatar FROM users WHERE phone = ?');
    $stmt->execute([$identifier]);
    $user = $stmt->fetch();
}

if (!$user) {
    $name = $isEmail ? explode('@', $identifier)[0] : 'User';
    if ($isEmail) {
        $stmt = $db->prepare('INSERT INTO users (name, email) VALUES (?, ?)');
        $stmt->execute([$name, $identifier]);
    } else {
        $stmt = $db->prepare('INSERT INTO users (name, phone) VALUES (?, ?)');
        $stmt->execute([$name, $identifier]);
    }
    $user = [
        'id'     => (int) $db->lastInsertId(),
        'name'   => $name,
        'email'  => $isEmail ? $identifier : null,
        'avatar' => null,
    ];
}

$_SESSION['user'] = $user;

jsonResponse([
    'message' => 'Login successful',
    'user'    => $user,
]);
