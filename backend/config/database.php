<?php

// Reads DB credentials from $_ENV (loaded from backend/.env by index.php /
// router.php), falling back to backend/.env directly and then local defaults.
// This is what makes the same backend/ folder work locally AND on Hostinger:
// just set DB_* in backend/.env before uploading.

function envVal(string $key, string $default): string {
    if (isset($_ENV[$key]) && $_ENV[$key] !== '') {
        return $_ENV[$key];
    }
    $getenv = getenv($key);
    if ($getenv !== false && $getenv !== '') {
        return $getenv;
    }
    return $default;
}

function loadBackendEnvOnce(): void {
    static $loaded = false;
    if ($loaded) {
        return;
    }
    $loaded = true;
    if (!empty($_ENV['DB_NAME'])) {
        return;
    }
    $envFile = __DIR__ . '/../.env';
    if (!file_exists($envFile)) {
        return;
    }
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2 && !isset($_ENV[trim($parts[0])])) {
            $_ENV[trim($parts[0])] = trim($parts[1]);
        }
    }
}

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        loadBackendEnvOnce();
        $host = envVal('DB_HOST', 'localhost');
        $name = envVal('DB_NAME', 'buyuadvice_latest');
        $user = envVal('DB_USER', 'root');
        $pass = envVal('DB_PASS', '');
        $dsn = "mysql:host={$host};dbname={$name};charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}
