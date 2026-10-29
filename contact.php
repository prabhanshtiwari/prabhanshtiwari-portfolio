<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

function text_length(string $value): int {
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }
    $matched = preg_match_all('/./us', $value, $characters);
    return $matched === false ? strlen($value) : $matched;
}

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'This endpoint accepts POST requests only.']);
}

$host = strtolower(trim(explode(':', (string)($_SERVER['HTTP_HOST'] ?? ''))[0]));
$allowedHosts = ['prabhanshtiwari.com', 'www.prabhanshtiwari.com', 'localhost', '127.0.0.1'];
if ($host !== '' && !in_array($host, $allowedHosts, true)) {
    respond(403, ['ok' => false, 'message' => 'This request is not allowed.']);
}
$origin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
if ($origin !== '') {
    $originHost = strtolower((string)parse_url($origin, PHP_URL_HOST));
    if (!in_array($originHost, $allowedHosts, true)) {
        respond(403, ['ok' => false, 'message' => 'The request origin could not be verified.']);
    }
}

$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 12000) {
    respond(413, ['ok' => false, 'message' => 'Your message is too large. Please shorten it and try again.']);
}

$name = trim(strip_tags((string)($_POST['name'] ?? '')));
$email = trim((string)($_POST['email'] ?? ''));
$topic = trim(strip_tags((string)($_POST['topic'] ?? '')));
$message = trim(strip_tags((string)($_POST['message'] ?? '')));
$honeypot = trim((string)($_POST['website'] ?? ''));

// Quietly accept bots that fill the hidden field, without forwarding their submission.
if ($honeypot !== '') {
    respond(200, ['ok' => true, 'message' => 'Thank you. Your message has been received.']);
}

if ($name === '' || text_length($name) > 100) {
    respond(422, ['ok' => false, 'message' => 'Please enter a name of 1–100 characters.']);
}
if (text_length($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'message' => 'Please enter a valid email address.']);
}
$allowedTopics = ['Developer opportunity', 'Freelance project', 'Website or application enquiry', 'Collaboration', 'Technical question', 'Other'];
if (!in_array($topic, $allowedTopics, true)) {
    respond(422, ['ok' => false, 'message' => 'Please select a valid enquiry topic.']);
}
if (text_length($message) < 20 || text_length($message) > 5000) {
    respond(422, ['ok' => false, 'message' => 'Please write a message between 20 and 5,000 characters.']);
}

// Lightweight per-IP rate limit: at most 3 real attempts per 10 minutes.
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateFile = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'pt-contact-' . hash('sha256', $ip) . '.json';
$now = time();
$recent = [];
$handle = @fopen($rateFile, 'c+');
if ($handle !== false) {
    if (flock($handle, LOCK_EX)) {
        $contents = stream_get_contents($handle);
        $decoded = json_decode($contents !== false ? $contents : '', true);
        if (is_array($decoded)) {
            $recent = array_values(array_filter($decoded, static fn($stamp) => is_int($stamp) && $stamp > $now - 600));
        }
        if (count($recent) >= 3) {
            flock($handle, LOCK_UN);
            fclose($handle);
            respond(429, ['ok' => false, 'message' => 'Too many messages were sent from this network. Please try again in a few minutes or email me directly.']);
        }
        $recent[] = $now;
        ftruncate($handle, 0);
        rewind($handle);
        fwrite($handle, json_encode($recent));
        fflush($handle);
        flock($handle, LOCK_UN);
    }
    fclose($handle);
}

$recipient = 'prabhansh.dev@gmail.com';
$sender = getenv('PORTFOLIO_CONTACT_FROM') ?: 'no-reply@prabhanshtiwari.com';
$cleanTopic = preg_replace('/[\r\n]+/', ' ', $topic) ?: 'Website enquiry';
$subject = 'Portfolio enquiry: ' . $cleanTopic;
if (function_exists('mb_encode_mimeheader')) {
    $subject = mb_encode_mimeheader($subject, 'UTF-8', 'B', "\r\n");
}
$body = "A new message was sent through prabhanshtiwari.com.\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Topic: {$cleanTopic}\n\n"
    . "Message:\n{$message}\n\n"
    . "IP hash: " . substr(hash('sha256', $ip), 0, 16) . "\n";
$headers = [
    'From' => 'Prabhansh Tiwari Website <' . $sender . '>',
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'X-Mailer' => 'PHP/' . PHP_VERSION
];
$headerLines = [];
foreach ($headers as $key => $value) {
    $headerLines[] = $key . ': ' . str_replace(["\r", "\n"], '', $value);
}
$sent = @mail($recipient, $subject, $body, implode("\r\n", $headerLines));
if (!$sent) {
    respond(503, ['ok' => false, 'message' => 'The website could not hand this message to the mail server. Please use the direct email link instead.']);
}
respond(200, ['ok' => true, 'message' => 'Your message has been sent. Thank you for reaching out.']);
