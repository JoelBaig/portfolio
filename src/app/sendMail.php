<?php

// switch ($_SERVER['REQUEST_METHOD']) {
//     case ("OPTIONS"): //Allow preflighting to take place.
//         header("Access-Control-Allow-Origin: *");
//         header("Access-Control-Allow-Methods: POST");
//         header("Access-Control-Allow-Headers: content-type");
//         exit;
//         case("POST"): //Send the email;
//             header("Access-Control-Allow-Origin: *");
//             // Payload is not send to $_POST Variable,
//             // is send to php:input as a text
//             $json = file_get_contents('php://input');
//             //parse the Payload from text format to Object
//             $params = json_decode($json);
    
//             $email = $params->email;
//             $name = $params->name;
//             $message = $params->message;
    
//             $recipient = 'joelb93@outlook.de';  
//             $subject = "Contact From <$email>";
//             $message = "From:" . $name . "<br>" . $message ;
    
//             $headers   = array();
//             $headers[] = 'MIME-Version: 1.0';
//             $headers[] = 'Content-type: text/html; charset=utf-8';

//             // Additional headers
//             $headers[] = "From: noreply@mywebsite.com";

//             mail($recipient, $subject, $message, implode("\r\n", $headers));
//             break;
//         default: //Reject any non POST or OPTIONS requests.
//             header("Allow: POST", true, 405);
//             exit;
//     } 

<?php
// === CORS: Erlaube Anfragen NUR von deinen Seiten (in Dev etwas offener) ===
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
  'https://joelbaig.com',          // deine Live-Domain
  'http://localhost:4200',         // Angular Dev
  'http://localhost:4201',         // Angular Dev anderer Port
  // Beispiel für VS Code Tunnel (ersetzen, wenn du ihn nutzt):
  // 'https://DEIN-TUNNEL-ID-4201.euw.devtunnels.ms',
];

if (in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Vary: Origin");
} else {
  // Optional: in Dev alles erlauben (auskommentiert lassen, wenn du strikt sein willst)
  // header("Access-Control-Allow-Origin: *");
  // header("Vary: Origin");
}

// Preflight für Browser (bei POST mit JSON)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header("Access-Control-Allow-Methods: POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  http_response_code(204);
  exit;
}

// Nur POST erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  header("Allow: POST, OPTIONS", true, 405);
  echo 'Method Not Allowed';
  exit;
}

// Rohdaten lesen (JSON vom Frontend)
$raw = file_get_contents('php://input');
$params = json_decode($raw, true);

if (!$params) {
  http_response_code(400);
  echo 'Bad JSON';
  exit;
}

// Felder aus Angular (müssen zum Frontend passen!)
$name    = trim($params['contactName'] ?? '');
$email   = trim($params['email'] ?? '');
$message = trim($params['message'] ?? '');

// Einfache Validierung
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo 'Validation failed';
  exit;
}

// Empfänger (DEINE Mailadresse)
$to = 'joelb93@outlook.de'; // <— HIER deine Zieladresse eintragen

// Betreff (mit UTF-8 sicher)
$subject = "Kontaktformular von {$name} <{$email}>";

// WICHTIG: Absender sollte zu deiner Domain passen (SPF/DMARC)
$fromAddr = 'noreply@joelbaig.com'; // <— Diese Adresse idealerweise im All-inkl-Postfach anlegen
$fromName = 'Portfolio Kontakt';

// HTML-Mailtext
$body = '<html><body>'
      . '<h2>Neue Kontaktanfrage</h2>'
      . '<p><strong>Name:</strong> ' . htmlspecialchars($name) . '</p>'
      . '<p><strong>E-Mail:</strong> ' . htmlspecialchars($email) . '</p>'
      . '<p><strong>Nachricht:</strong><br>' . nl2br(htmlspecialchars($message)) . '</p>'
      . '</body></html>';

// Header korrekt aufbauen
$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: ' . sprintf('"%s" <%s>', $fromName, $fromAddr);
// Wenn du der Person direkt antworten willst:
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Mail senden
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$ok = @mail($to, $encodedSubject, $body, implode("\r\n", $headers));

// Antwort an das Frontend
if ($ok) {
  http_response_code(200);
  echo 'OK';
} else {
  http_response_code(500);
  echo 'Mail failed';
}
