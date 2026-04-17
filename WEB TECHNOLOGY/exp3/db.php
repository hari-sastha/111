<?php
// Database Connection
$conn = mysqli_connect("localhost", "root", "", "inventory_db", 3306);

if (!$conn) {
    die("Connection Failed: " . mysqli_connect_error());
}
?>