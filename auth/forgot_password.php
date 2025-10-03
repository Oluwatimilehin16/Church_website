<?php
include 'config.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

$msg = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    // check if email exists
    $sql = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $otp = rand(100000, 999999); // 6 digit OTP
        $expiry = date("Y-m-d H:i:s", strtotime("+10 minutes"));

        // save otp + expiry in db
        $update = $conn->prepare("UPDATE users SET otp=?, otp_expiry=? WHERE email=?");
        $update->bind_param("sss", $otp, $expiry, $email);
        $update->execute();

        // send OTP via email
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com'; // or your mail server
            $mail->SMTPAuth   = true;
            $mail->Username   = 'yourgmail@gmail.com'; // your email
            $mail->Password   = 'your_app_password';   // app password (not normal password)
            $mail->SMTPSecure = 'tls';
            $mail->Port       = 587;

            $mail->setFrom('yourgmail@gmail.com', 'Auth System');
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = "Password Reset OTP";
            $mail->Body    = "Your OTP code is <b>$otp</b>. It will expire in 10 minutes.";

            $mail->send();
            $msg = "OTP has been sent to your email.";
        } catch (Exception $e) {
            $msg = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
        }

    } else {
        $msg = "Email not found!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Forgot Password</title>
</head>
<body>
    <h2>Forgot Password</h2>
    <form method="POST">
        <input type="email" name="email" placeholder="Enter your email" required><br><br>
        <button type="submit">Send OTP</button>
    </form>
    <p><?php echo $msg; ?></p>
</body>
</html>
