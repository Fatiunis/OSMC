<?php
$passwordIngresada = "12345";
$hash = '$2y$10$Qcvo7j9FV5B83eGJOcQIYOKvVOtjpKYcgtRwVPTd4WqSaBgSjfQU2';

if (password_verify($passwordIngresada, $hash)) {
    echo "✅ Coincide";
} else {
    echo "❌ No coincide";
}
?>