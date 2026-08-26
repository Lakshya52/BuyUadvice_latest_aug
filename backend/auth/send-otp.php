<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/session.php';
require_once __DIR__ . '/../config/smtp.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);

if (empty($input['email'])) {
    jsonResponse(['error' => 'Email address is required'], 400);
}

$email = strtolower(trim($input['email']));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Please enter a valid email address'], 400);
}

try {
    $db = getDB();

    $stmt = $db->prepare('SELECT id FROM otp_tokens WHERE identifier = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Please wait 60 seconds before requesting a new OTP'], 429);
    }

    $otp = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
    $expiresAt = date('Y-m-d H:i:s', time() + 10 * 60);

    $stmt = $db->prepare('DELETE FROM otp_tokens WHERE identifier = ?');
    $stmt->execute([$email]);

    $hashedOtp = password_hash($otp, PASSWORD_DEFAULT);
    $stmt = $db->prepare('INSERT INTO otp_tokens (identifier, otp, expires_at) VALUES (?, ?, ?)');
    $stmt->execute([$email, $hashedOtp, $expiresAt]);

    $smtpConfig = getSmtpConfig();

    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $smtpConfig['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtpConfig['username'];
    $mail->Password   = $smtpConfig['password'];
    $mail->SMTPSecure = $smtpConfig['secure'];
    $mail->Port       = $smtpConfig['port'];
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom($smtpConfig['from_email'], $smtpConfig['from_name']);
    $mail->addAddress($email);

    $name = explode('@', $email)[0];
    $mail->isHTML(true);
    $mail->Subject = 'Your BuyUadvice Verification Code';
    $mail->Body = '
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
        <div style="background:#182B4F;padding:30px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:22px;">BuyUadvice</h1>
        </div>
        <div style="padding:35px 30px;text-align:center;">
          <h2 style="color:#182B4F;font-size:20px;margin-bottom:10px;">Verification Code</h2>
          <p style="color:#666666;font-size:15px;margin-bottom:25px;">Hi ' . htmlspecialchars($name) . ', use the code below to sign in.</p>
          <div style="background:#f4f6f9;border-radius:8px;padding:18px;margin-bottom:25px;">
            <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#182B4F;">' . $otp . '</span>
          </div>
          <p style="color:#999999;font-size:13px;margin:0;">This code expires in 10 minutes.</p>
          <p style="color:#999999;font-size:13px;margin-top:8px;">If you didn\'t request this, please ignore this email.</p>
        </div>
        <div style="background:#f9fafb;padding:20px;text-align:center;border-top:1px solid #eee;">
          <p style="color:#bbb;font-size:12px;margin:0;">&copy; ' . date('Y') . ' BuyUadvice. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>';
    $mail->AltBody = "Your verification code is: {$otp}\n\nThis code expires in 10 minutes.";

    $mail->send();

    $domain = substr($email, strpos($email, '@') + 1);
    $masked = substr($email, 0, 2) . str_repeat('*', max(0, strpos($email, '@') - 2)) . '@' . $domain;

    jsonResponse([
        'message' => 'OTP sent to your email',
        'masked'  => $masked,
    ]);
} catch (Exception $e) {
    jsonResponse(['error' => 'Failed to send OTP. Please try again.'], 500);
}
