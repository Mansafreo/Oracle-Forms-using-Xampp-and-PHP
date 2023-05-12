<?php
//To include the connect.php file
include_once 'connect.php';
//To get the table name from the request
$table=$_POST["table"];
$data=$_POST['data'];
$data_without_keys=[];
foreach($data as $key=>$value){
    array_push($data_without_keys,$value);
}
$data=$data_without_keys;
//To get the fields for the database table
$sql = "SELECT column_name FROM user_tab_columns WHERE table_name = '$table'";
//To parse the sql query
$stmt = oci_parse($conn, $sql);
//To execute the sql query
oci_execute($stmt);
//To get the fields
$fields = array();
while ($row = oci_fetch_array($stmt, OCI_ASSOC+OCI_RETURN_NULLS)) {
    foreach ($row as $item) {
        array_push($fields, $item);
    }
}
oci_free_statement($stmt);
//To create the insert sql query
$sql = "INSERT INTO $table (";
for($i=0;$i<count($fields);$i++){
    $sql=$sql.$fields[$i].",";
}
$sql=substr($sql,0,-1);
$sql=$sql.") VALUES (";
for($i=0;$i<count($data);$i++){
    $sql=$sql."'".$data[$i]."',";
}
$sql=substr($sql,0,-1);
$sql=$sql.")";
//To parse the sql query
$stmt = oci_parse($conn, $sql);
//To execute the sql query
oci_execute($stmt);
//To close the connection
oci_close($conn);
//To check if the record is inserted
if($stmt){
    echo true;
}
else{
    echo false;
}
?>