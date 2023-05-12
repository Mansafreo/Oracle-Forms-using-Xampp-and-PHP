<?php
include_once 'connect.php';
$data=$_POST['data'];
//Get The table from reuqeust
$table=$_POST["table"];
//To create the sql query for updating based on the table and the fields
$sql = "UPDATE $table SET ";
//To get the fields for the database table
$fields = array();
//To get the fields for the database table
$sql1 = "SELECT column_name FROM user_tab_columns WHERE table_name = '$table'";
//To parse the sql query
$stmt1 = oci_parse($conn, $sql1);
//To execute the sql query
oci_execute($stmt1);
//To get the fields
while ($row = oci_fetch_array($stmt1, OCI_ASSOC+OCI_RETURN_NULLS)) {
    foreach ($row as $item) {
        array_push($fields, $item);
    }
}
oci_free_statement($stmt1);
//To create the sql statement for updating the current record passed from the request
for($i=0;$i<count($fields);$i++){
    $sql=$sql.$fields[$i]."='".$data[$i]."',";
}
$sql=substr($sql,0,-1);
//To get the primary key of the table
$sql2 = "SELECT column_name FROM user_cons_columns WHERE constraint_name = (SELECT constraint_name FROM user_constraints WHERE table_name = '$table' AND constraint_type = 'P')";
//To parse the sql query
$stmt2 = oci_parse($conn, $sql2);
//To execute the sql query
oci_execute($stmt2);
//To get the primary key
$primary_key="";
while ($row = oci_fetch_array($stmt2, OCI_ASSOC+OCI_RETURN_NULLS)) {
    foreach ($row as $item) {
        $primary_key=$item;
    }
}
oci_free_statement($stmt2);
//To get the primary key value from the request
$primary_key_value=$_POST["primary_key_value"];
//To create the sql statement for updating the current record passed from the request
$sql=$sql." WHERE $primary_key='$primary_key_value'";
//To parse the sql query
$stmt = oci_parse($conn, $sql);
//To execute the sql query
oci_execute($stmt);
//To close the connection
oci_close($conn);
//To check if the record is updated
if($stmt){
   echo true;
}
else{
    echo false;
}



