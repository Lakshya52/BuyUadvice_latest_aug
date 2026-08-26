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

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (str_starts_with($uri, '/backend/')) {
    require __DIR__ . '/index.php';
    return true;
}

$filePath = __DIR__ . '/../frontend/dist' . $uri;

if ($uri !== '/' && file_exists($filePath) && !is_dir($filePath)) {
    $mimeTypes = [
        'html'  => 'text/html',
        'css'   => 'text/css',
        'js'    => 'application/javascript',
        'json'  => 'application/json',
        'png'   => 'image/png',
        'jpg'   => 'image/jpeg',
        'jpeg'  => 'image/jpeg',
        'gif'   => 'image/gif',
        'svg'   => 'image/svg+xml',
        'ico'   => 'image/x-icon',
        'woff'  => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf'   => 'font/ttf',
    ];
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);
    if (isset($mimeTypes[$ext])) {
        header('Content-Type: ' . $mimeTypes[$ext]);
    }
    readfile($filePath);
    return true;
}

header('Content-Type: ' . mime_content_type(__DIR__ . '/../frontend/dist/index.html'));
readfile(__DIR__ . '/../frontend/dist/index.html');
return true;
