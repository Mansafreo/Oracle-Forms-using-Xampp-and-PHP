<?php
include_once 'connect.php';
//Get The table from reuqeust
$table=$_POST["table"];
//To get the primary key of the table
$primary_key_value=$_POST["primary_key_value"];
$primary_key=$_POST["primary_key"];
//To generate the sql query for deleting the record
$sql = "DELETE FROM $table WHERE \"$primary_key\"='$primary_key_value'";
//To parse the sql query
$stmt = oci_parse($conn, $sql);
//To execute the sql query
oci_execute($stmt);
//To close the connection
oci_close($conn);
//To check if the record is deleted
if($stmt){
   echo true;
}
else{
    echo false;
}
?>