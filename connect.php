<?php
session_start();
// Create connection to Oracle
$username = $_SESSION["username"];
$databaseName = $_SESSION["databasename"]."/".$_SESSION["servicename"];
$password = $_SESSION["password"];
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