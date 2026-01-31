<?php
$host = getenv("DB_HOST");
$port = getenv("DB_PORT");
$database = getenv("DB_NAME");
$username = getenv("DB_USER");
$password = getenv("DB_PASS");

$conn = new mysqli($host, $username, $password, $database, $port);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8");
?>
