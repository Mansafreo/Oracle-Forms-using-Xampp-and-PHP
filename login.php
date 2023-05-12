<?php
//To get the username and password from the request
$username=$_POST["username"];
$password=$_POST["password"];
//get databasename
$databaseName=$_POST["databasename"];
$servicename=$_POST["servicename"];
//To create the connection
$conn = oci_connect($username, $password, $databaseName."/".$servicename);
//To check if the connection is successful  
if (!$conn) {
    $m = oci_error();
    echo $m['message'], "\n";
    exit;
}
else {
    //To set the session variables
    session_start();
    $_SESSION["username"]=$username;
    $_SESSION["password"]=$password;
    $_SESSION["databasename"]=$databaseName;
    $_SESSION["servicename"]=$servicename;
    //To return true if the connection is successful
    echo true;
}
?>