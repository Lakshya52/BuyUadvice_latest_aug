<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/session.php';

if (empty($_SESSION['user'])) {
    jsonResponse(['authenticated' => false], 401);
}

jsonResponse([
    'authenticated' => true,
    'user'          => $_SESSION['user'],
]);
