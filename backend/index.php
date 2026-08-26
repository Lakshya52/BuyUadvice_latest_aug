<?php

$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $_ENV[trim($parts[0])] = trim($parts[1]);
        }
    }
}

header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

if ($uri[0] !== 'backend') {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

$routes = [
    'auth/register'       => __DIR__ . '/auth/register.php',
    'auth/login'          => __DIR__ . '/auth/login.php',
    'auth/logout'         => __DIR__ . '/auth/logout.php',
    'auth/check'          => __DIR__ . '/auth/check.php',
    'auth/google'         => __DIR__ . '/auth/google.php',
    'auth/identifier'     => __DIR__ . '/auth/identifier.php',
    'auth/send-otp'       => __DIR__ . '/auth/send-otp.php',
    'auth/verify-otp'     => __DIR__ . '/auth/verify-otp.php',
    'auth/check-email'    => __DIR__ . '/auth/check-email.php',
    'auth/login-password' => __DIR__ . '/auth/login-password.php',
    'auth/set-password'   => __DIR__ . '/auth/set-password.php',
];

$key = implode('/', array_slice($uri, 1));
$key = str_replace('.php', '', $key);

if (isset($routes[$key])) {
    require_once $routes[$key];
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
}
