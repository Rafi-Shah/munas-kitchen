<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── Load env variables (set in Vercel dashboard) ────────────
$supabase_url = getenv('SUPABASE_URL');
$supabase_key = getenv('SUPABASE_SERVICE_ROLE_KEY');

if (!$supabase_url || !$supabase_key) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server misconfiguration: missing Supabase credentials']);
    exit;
}

// ── Parse request body ───────────────────────────────────────
$body = json_decode(file_get_contents('php://input'), true);

if (!$body) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON body']);
    exit;
}

$name   = trim($body['name']   ?? '');
$email  = trim($body['email']  ?? '');
$phone  = trim($body['phone']  ?? '');
$guests = trim($body['guests'] ?? '');
$date   = trim($body['date']   ?? '');
$time   = trim($body['time']   ?? '');
$notes  = trim($body['notes']  ?? '');

// ── Validate ─────────────────────────────────────────────────
if (!$name || !$email || !$date) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name, email, and date are required']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || strtotime($date) < strtotime('today')) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Date must be today or in the future']);
    exit;
}

// ── Insert into Supabase via REST API ────────────────────────
$payload = json_encode([
    'name'   => htmlspecialchars($name, ENT_QUOTES),
    'email'  => strtolower($email),
    'phone'  => htmlspecialchars($phone, ENT_QUOTES),
    'guests' => htmlspecialchars($guests, ENT_QUOTES),
    'date'   => $date,
    'time'   => htmlspecialchars($time, ENT_QUOTES),
    'notes'  => htmlspecialchars($notes, ENT_QUOTES),
    'status' => 'pending'
]);

$ch = curl_init($supabase_url . '/rest/v1/reservations');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'apikey: '         . $supabase_key,
        'Authorization: Bearer ' . $supabase_key,
        'Prefer: return=representation'
    ],
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response    = curl_exec($ch);
$http_status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error  = curl_error($ch);
curl_close($ch);

if ($curl_error) {
    http_response_code(502);
    echo json_encode(['success' => false, 'error' => 'Could not reach database: ' . $curl_error]);
    exit;
}

if ($http_status === 201) {
    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Reservation created successfully']);
} else {
    $decoded = json_decode($response, true);
    $msg = $decoded['message'] ?? $decoded['error'] ?? 'Database error';
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $msg]);
}
