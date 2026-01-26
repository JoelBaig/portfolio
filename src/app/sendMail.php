<?php
declare(strict_types=1);

header('Content-Type: text/plain; charset=utf-8');

// ===== CORS (nur deine Domain erlauben) =====
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

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// Nur POST erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header('Allow: POST, OPTIONS', true, 405);
  echo "Method Not Allowed";
  exit;
}

// ===== JSON lesen =====
$raw = file_get_contents('php://input');
$data = json_decode($raw ?? '', true);

if (!is_array($data)) {
  http_response_code(400);
  echo "Bad JSON";
  exit;
}

// ===== Felder (passen zu Angular) =====
$name = trim((string) ($data['contactName'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));

// Honeypot optional (wenn du es im Frontend ergänzt)
$honeypot = trim((string) ($data['website'] ?? ''));
if ($honeypot !== '') {
  // Bots "erfolgreich" antworten lassen
  http_response_code(200);
  echo "OK";
  exit;
}

// ===== Validierung =====
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

// Begrenzen
if (mb_strlen($name) > 120)
  $name = mb_substr($name, 0, 120);
if (mb_strlen($email) > 200)
  $email = mb_substr($email, 0, 200);
if (mb_strlen($message) > 5000)
  $message = mb_substr($message, 0, 5000);

// ===== Mail =====
$to = 'joelb93@outlook.de';
$subject = "Portfolio Kontaktformular";

// WICHTIG: From muss Domain sein (All-Inkl/DMARC)
$subject = "Neue Portfolio Anfrage";
$fromAddr = 'contact@joelbaig.com';
$fromName = 'Joel Baig Portfolio';

$body =
  "Name: {$name}\n" .
  "Email: {$email}\n\n" .
  "Message:\n{$message}\n";

$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: ' . sprintf('"%s" <%s>', $fromName, $fromAddr);
$headers[] = 'Reply-To: ' . $email;

$ok = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$ok) {
  http_response_code(500);
  echo "Mail failed";
  exit;
}

echo "OK";