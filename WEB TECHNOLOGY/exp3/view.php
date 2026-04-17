<?php
include 'db.php';

$id = $_GET['id'];
$result = mysqli_query($conn, "SELECT * FROM products WHERE id=$id");
$row = mysqli_fetch_assoc($result);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Product Details</title>
</head>
<body>
    <h2>Product Details</h2>
    <p><strong>ID:</strong> <?php echo $row['id']; ?></p>
    <p><strong>Name:</strong> <?php echo $row['name']; ?></p>
    <p><strong>Price:</strong> <?php echo $row['price']; ?></p>
    <p><strong>Quantity:</strong> <?php echo $row['quantity']; ?></p>
</body>
</html>