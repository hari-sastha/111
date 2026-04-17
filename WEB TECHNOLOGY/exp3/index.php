<?php include 'db.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <title>Inventory Management</title>
    <style>
        body { font-family: Arial; margin: 30px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 10px; text-align: center; }
        input { padding: 8px; margin: 5px; }
        button { padding: 8px; }
    </style>
</head>
<body>

<h2>Inventory Management System</h2>

<!-- Add Product Form -->
<form action="add.php" method="POST">
    <input type="text" name="name" placeholder="Product Name" required>
    <input type="number" step="0.01" name="price" placeholder="Price" required>
    <input type="number" name="quantity" placeholder="Quantity" required>
    <button type="submit">Add Product</button>
</form>

<br>

<!-- Product Table -->
<table>
    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>QR Code</th>
        <th>Action</th>
    </tr>

    <?php
    $result = mysqli_query($conn, "SELECT * FROM products");
    while ($row = mysqli_fetch_assoc($result)) {
    ?>
    <tr>
        <td><?php echo $row['id']; ?></td>
        <td><?php echo $row['name']; ?></td>
        <td><?php echo $row['price']; ?></td>
        <td><?php echo $row['quantity']; ?></td>
        <td>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=http://localhost/inventory/view.php?id=<?php echo $row['id']; ?>">
        </td>
        <td>
            <a href="delete.php?id=<?php echo $row['id']; ?>">Delete</a>
        </td>
    </tr>
    <?php } ?>
</table>

</body>
</html>