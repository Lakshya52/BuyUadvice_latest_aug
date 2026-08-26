<?php

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['email']) || empty($input['otp'])) {
    jsonResponse(['error' => 'Email and OTP are required'], 400);
}

$email = strtolower(trim($input['email']));
$otp = trim($input['otp']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Please enter a valid email address'], 400);
}

if (!preg_match('/^\d{6}$/', $otp)) {
    jsonResponse(['error' => 'OTP must be a 6-digit number'], 400);
}

try {
    $db = getDB();

    $stmt = $db->prepare('SELECT id, otp, expires_at FROM otp_tokens WHERE identifier = ? ORDER BY id DESC LIMIT 1');
    $stmt->execute([$email]);
    $record = $stmt->fetch();

    if (!$record) {
        jsonResponse(['error' => 'No OTP found. Please request a new one.'], 400);
    }

    if (strtotime($record['expires_at']) < time()) {
        $db->prepare('DELETE FROM otp_tokens WHERE identifier = ?')->execute([$email]);
        jsonResponse(['error' => 'OTP has expired. Please request a new one.'], 400);
    }

    if (!password_verify($otp, $record['otp'])) {
        jsonResponse(['error' => 'Incorrect OTP. Please try again.'], 400);
    }

    $db->prepare('DELETE FROM otp_tokens WHERE identifier = ?')->execute([$email]);

    $stmt = $db->prepare('SELECT id, name, email, avatar, password FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        $name = explode('@', $email)[0];
        $stmt = $db->prepare('INSERT INTO users (name, email) VALUES (?, ?)');
        $stmt->execute([$name, $email]);
        $user = [
            'id'     => (int) $db->lastInsertId(),
            'name'   => $name,
            'email'  => $email,
            'avatar' => null,
        ];
        $hasPassword = false;
    } else {
        $hasPassword = !empty($user['password']);
        unset($user['password']);
        $user['id'] = (int) $user['id'];
    }

    $_SESSION['user'] = $user;

    jsonResponse([
        'message'      => 'Login successful',
        'user'         => $user,
        'has_password' => $hasPassword,
    ]);
} catch (Exception $e) {
    jsonResponse(['error' => 'Something went wrong. Please try again.'], 500);
}
