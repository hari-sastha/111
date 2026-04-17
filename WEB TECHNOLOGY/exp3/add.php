<?php
include 'db.php';

$name = $_POST['name'];
$price = $_POST['price'];
$quantity = $_POST['quantity'];

mysqli_query($conn, "INSERT INTO products(name, price, quantity) VALUES('$name','$price','$quantity')");

header("Location: index.php");
?>