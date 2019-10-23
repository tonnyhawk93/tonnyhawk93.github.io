<?php
$db_user = 'shootnbofl123456';
$db_pass = 'jvaLaurytal2';
$db_name = 'shootnbofl123456';

$conn = mysqli_connect('shootnbofl123456.mysql.db', $db_user, $db_pass, $db_name) or die("Error connecting to database!");
mysqli_select_db($conn, $db_name) or die ("Cannot connect to ".strtoupper($db_name)."!");

mysqli_query($conn, "set names utf8mb4");
mysqli_query($conn, "set character_set_client='utf8mb4'");
mysqli_query($conn, "set character_set_results='utf8mb4'");
mysqli_query($conn, "set collation_connection='utf8mb4_general_ci'");

mb_internal_encoding("UTF-8");
?>