<?php
// Dev + single-port router. Also mirrors production where backend/ IS the web root.
// Usage (pick one):
//   cd backend && php -S localhost:8080 router.php
//   php -S localhost:8080 -t backend backend/router.php   (from repo root)

$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
            $_ENV[trim($parts[0])] = trim($parts[1]);
        }
    }
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. API -> backend/index.php (keeps /backend/* URLs working locally + in production)
if (str_starts_with($uri, '/backend/')) {
    require __DIR__ . '/index.php';
    return true;
}

// 2. Block direct access to PHP source / secrets (mirrors .htaccess on Hostinger).
//    API must go through /backend/* -> index.php, never /auth/*.php directly.
$blockedPrefixes = ['/auth/', '/config/', '/vendor/', '/sql/', '/.git'];
foreach ($blockedPrefixes as $prefix) {
    if (str_starts_with($uri, $prefix)) {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Not found']);
        return true;
    }
}
$blockedFiles = ['/.env', '/composer.json', '/composer.lock', '/router.php'];
if (in_array($uri, $blockedFiles, true)) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Not found']);
    return true;
}
// Never serve .php source as static text.
if (str_ends_with($uri, '.php')) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Not found']);
    return true;
}

// 3. Frontend: serve built copy inside backend/ (this is what gets uploaded to
//    public_html). Fall back to frontend/dist so `php -S` works even before the
//    first `npm run build` sync.
$candidates = [
    __DIR__ . $uri,                    // backend/index.html, backend/assets/* (deploy copy)
    __DIR__ . '/../frontend/dist' . $uri, // dev fallback (no sync yet)
];

foreach ($candidates as $filePath) {
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
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        if (isset($mimeTypes[$ext])) {
            header('Content-Type: ' . $mimeTypes[$ext]);
        }
        readfile($filePath);
        return true;
    }
}

// 4. SPA fallback (React Router): serve index.html, prefer the backend/ copy.
$indexCandidates = [__DIR__ . '/index.html', __DIR__ . '/../frontend/dist/index.html'];
foreach ($indexCandidates as $indexFile) {
    if (file_exists($indexFile)) {
        header('Content-Type: text/html');
        readfile($indexFile);
        return true;
    }
}

http_response_code(404);
header('Content-Type: application/json');
echo json_encode(['error' => 'Frontend not built. Run: cd frontend && npm run build']);
return true;
