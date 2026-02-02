<?php
$host = getenv("DB_HOST") ?: 'mysql';
$port = getenv("DB_PORT");
$database = getenv("DB_NAME");
$username = getenv("DB_USER");
$password = getenv("DB_PASS");

$conn = new mysqli($host, $username, $password, $database, 3306);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>
