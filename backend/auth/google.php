<?php

header('Access-Control-Allow-Origin: ' . ($_SERVER['HTTP_ORIGIN'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';

$clientId     = $_ENV['GOOGLE_CLIENT_ID'] ?? '';
$clientSecret = $_ENV['GOOGLE_CLIENT_SECRET'] ?? '';
$frontendUrl  = '/';
$redirectUri  = (isset($_SERVER['HTTPS']) ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/backend/auth/google.php';

function findOrCreateUser(string $googleId, string $email, string $name, ?string $avatar): array {
    $db = getDB();

    $stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        if ($user['google_id'] === null) {
            $stmt = $db->prepare('UPDATE users SET google_id = ?, avatar = ? WHERE id = ?');
            $stmt->execute([$googleId, $avatar, $user['id']]);
        }
        $stmt = $db->prepare('SELECT id, name, email, avatar FROM users WHERE id = ?');
        $stmt->execute([$user['id']]);
        return $stmt->fetch();
    } else {
        $stmt = $db->prepare('INSERT INTO users (name, email, google_id, avatar) VALUES (?, ?, ?, ?)');
        $stmt->execute([$name, $email, $googleId, $avatar]);

        return [
            'id'     => (int) $db->lastInsertId(),
            'name'   => $name,
            'email'  => $email,
            'avatar' => $avatar,
        ];
    }
}

function decodeGoogleCredential(string $credential): ?array {
    $tokenParts = explode('.', $credential);
    if (count($tokenParts) !== 3) return null;

    $payload = json_decode(base64_decode(strtr($tokenParts[1], '-_', '+/')), true);
    if (!$payload || empty($payload['sub']) || empty($payload['email'])) return null;

    return $payload;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['credential'])) {
        jsonResponse(['error' => 'Google credential is required'], 400);
    }

    $payload = decodeGoogleCredential($input['credential']);
    if (!$payload) {
        jsonResponse(['error' => 'Invalid Google token'], 400);
    }

    $user = findOrCreateUser(
        $payload['sub'],
        strtolower($payload['email']),
        $payload['name'] ?? $payload['email'],
        $payload['picture'] ?? null
    );

    $_SESSION['user'] = $user;

    jsonResponse([
        'message' => 'Google login successful',
        'user'    => $user,
    ]);
}

if (empty($_GET['code'])) {
    $scope = 'openid email profile';
    $params = http_build_query([
        'client_id'     => $clientId,
            'redirect_uri'  => $redirectUri,
        'response_type' => 'code',
        'scope'         => $scope,
        'access_type'   => 'offline',
        'prompt'        => 'select_account',
    ]);
    header('Location: https://accounts.google.com/o/oauth2/v2/auth?' . $params);
    exit;
}

$code = $_GET['code'];

$tokenResponse = json_decode(file_get_contents('https://oauth2.googleapis.com/token', false, stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query([
            'code'          => $code,
            'client_id'     => $clientId,
            'client_secret' => $clientSecret,
        'redirect_uri'  => $redirectUri,
            'grant_type'    => 'authorization_code',
        ]),
    ],
])));

if (empty($tokenResponse->id_token)) {
    echo '<script>if(window.opener){window.opener.postMessage({type:"google-auth-error"},"*");window.close();}else{window.location.href="/";}</script>';
    exit;
}

$payload = decodeGoogleCredential($tokenResponse->id_token);
if (!$payload) {
    echo '<script>if(window.opener){window.opener.postMessage({type:"google-auth-error"},"*");window.close();}else{window.location.href="/";}</script>';
    exit;
}

$user = findOrCreateUser(
    $payload['sub'],
    strtolower($payload['email']),
    $payload['name'] ?? $payload['email'],
    $payload['picture'] ?? null
);

$_SESSION['user'] = $user;

?>
<!DOCTYPE html>
<html>
<body>
<script>
  if (window.opener) {
    window.opener.postMessage({ type: 'google-auth-success' }, '*');
    window.close();
  } else {
    window.location.href = '/';
  }
</script>
</body>
</html>
<?php exit;
