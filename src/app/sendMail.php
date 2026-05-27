<?php

header('Content-Type: text/plain; charset=utf-8');

// =========================
// CORS
// =========================

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

$allowedOrigins = [
  'https://joelbaig.com',
  'https://www.joelbaig.com',
  'http://localhost:4200',
];

if ($origin && in_array($origin, $allowedOrigins, true)) {

  header("Access-Control-Allow-Origin: $origin");

  header('Vary: Origin');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');

header('Access-Control-Allow-Headers: Content-Type');

// =========================
// PREFLIGHT
// =========================

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {

  http_response_code(204);

  exit;
}

// =========================
// ONLY POST
// =========================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

  header('Allow: POST, OPTIONS', true, 405);

  echo "Method Not Allowed";

  exit;
}

// =========================
// READ JSON
// =========================

$raw = file_get_contents('php://input');

$data = json_decode($raw ?? '', true);

if (!is_array($data)) {

  http_response_code(400);

  echo "Bad JSON";

  exit;
}

// =========================
// FIELDS
// =========================

$name =
  trim((string) ($data['contactName'] ?? ''));

$email =
  trim((string) ($data['email'] ?? ''));

$message =
  trim((string) ($data['message'] ?? ''));

// =========================
// HONEYPOT
// =========================

$honeypot =
  trim((string) ($data['website'] ?? ''));

if ($honeypot !== '') {

  http_response_code(200);

  echo "OK";

  exit;
}

// =========================
// VALIDATION
// =========================

if ($name === '' || $message === '') {

  http_response_code(400);

  echo "Missing fields";

  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

  http_response_code(400);

  echo "Invalid email";

  exit;
}

// =========================
// LIMITS
// =========================

if (mb_strlen($name) > 120) {
  $name = mb_substr($name, 0, 120);
}

if (mb_strlen($email) > 200) {
  $email = mb_substr($email, 0, 200);
}

if (mb_strlen($message) > 5000) {
  $message = mb_substr($message, 0, 5000);
}

// =========================
// MAIL
// =========================

$to =
  'joelb93@outlook.de';

$subject =
  'Neue Portfolio Anfrage';

$fromAddr =
  'contact@joelbaig.com';

$fromName =
  'Joel Baig Portfolio';

$body =
  "Name: {$name}\n" .
  "Email: {$email}\n\n" .
  "Message:\n{$message}\n";

// =========================
// HEADERS
// =========================

$headers = [];

$headers[] =
  'MIME-Version: 1.0';

$headers[] =
  'Content-Type: text/plain; charset=UTF-8';

$headers[] =
  'From: "' .
  $fromName .
  '" <' .
  $fromAddr .
  '>';

$headers[] =
  'Reply-To: ' .
  $fromAddr;

// =========================
// SEND MAIL
// =========================

$ok = mail(
  $to,
  $subject,
  $body,
  implode("\r\n", $headers)
);

// =========================
// DEBUG
// =========================

if (!$ok) {

  error_log('MAIL FAILED');

  http_response_code(500);

  echo "Mail failed";

  exit;
}

echo "OK";