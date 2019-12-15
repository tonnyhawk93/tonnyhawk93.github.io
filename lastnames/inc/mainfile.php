<?php
$db_host = 'localhost';
$db_user = 'family';
$db_pass = 'Fq8GBwpr';
$db_name = 'family';

$conn = mysqli_connect($db_host, $db_user, $db_pass, $db_name) or die("Error connecting to database!");
mysqli_select_db($conn, $db_name) or die ("Cannot connect to ".strtoupper($db_name)."!");

mysqli_query($conn, "set names utf8mb4");
mysqli_query($conn, "set character_set_client='utf8'");
mysqli_query($conn, "set character_set_results='utf8'");
mysqli_query($conn, "set collation_connection='utf8_general_ci'");

mb_internal_encoding("UTF-8");
?>