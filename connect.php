<?php
// Create connection to Oracle
$username = "admin";
$databaseName = "freighto4.cv8tg5uhwfih.eu-west-2.rds.amazonaws.com/orcl";
$password = "freighto";
$conn = oci_connect($username, $password, $databaseName);

if (!$conn) {
    $m = oci_error();
    echo $m['message'], "\n";
    exit;
}
else {
    return $conn;
}
?>