<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['name']) || empty($input['email']) || empty($input['password'])) {
    jsonResponse(['error' => 'Name, email, and password are required'], 400);
}

$name     = trim($input['name']);
$email    = trim(strtolower($input['email']));
$password = $input['password'];

if (strlen($password) < 6) {
    jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Invalid email format'], 400);
}

$db = getDB();

$stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    jsonResponse(['error' => 'Email already registered'], 409);
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$stmt = $db->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
$stmt->execute([$name, $email, $hashedPassword]);

$userId = (int) $db->lastInsertId();

$_SESSION['user'] = [
    'id'    => $userId,
    'name'  => $name,
    'email' => $email,
];

jsonResponse([
    'message' => 'Registration successful',
    'user'    => $_SESSION['user'],
], 201);
