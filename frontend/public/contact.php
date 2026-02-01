<?php
// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Exit if not POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed"]);
    exit;
}

// Get the POST data
$data = json_decode(file_get_contents("php://input"), true);

// Basic validation
if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(["message" => "Please fill in all required fields."]);
    exit;
}

// Sanitize inputs
$name = strip_tags(trim($data['name']));
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$subject = !empty($data['subject']) ? strip_tags(trim($data['subject'])) : "New Website Message";
$phone = !empty($data['phone']) ? strip_tags(trim($data['phone'])) : "Not provided";
$message = strip_tags(trim($data['message']));

// Prepare the email
$to = "info@newgatechapel.org"; // Change this to the user's email
$email_subject = "New Contact Form Submission: $subject";
$email_body = "You have received a new message from your website contact form.\n\n".
              "Here are the details:\n\n".
              "Name: $name\n".
              "Email: $email\n".
              "Phone: $phone\n".
              "Subject: $subject\n\n".
              "Message:\n$message";

$headers = "From: noreply@newgatechapel.org\n"; // Change this to a domain email
$headers .= "Reply-To: $email";

// Send the email
if (mail($to, $email_subject, $email_body, $headers)) {
    http_response_code(200);
    echo json_encode(["message" => "Your message has been sent successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Oops! Something went wrong and we couldn't send your message."]);
}
?>
