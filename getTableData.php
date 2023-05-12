<?php
include_once 'connect.php';
//Get The table from reuqeust
$table=$_POST["table"];

$fields = array();
//To get the fields for the database table
$sql = "SELECT column_name FROM user_tab_columns WHERE table_name = '$table'";
//To parse the sql query
$stmt = oci_parse($conn, $sql);
//To execute the sql query
oci_execute($stmt);
//To get the fields
while ($row = oci_fetch_array($stmt, OCI_ASSOC+OCI_RETURN_NULLS)) {
    foreach ($row as $item) {
        array_push($fields, $item);
    }
}
oci_free_statement($stmt);
//To get the data from the database table
$sql = "SELECT * FROM $table";
//To parse the sql query
$stmt = oci_parse($conn, $sql);
//To execute the sql query
oci_execute($stmt);
//To get the data
$data = array();
while ($row = oci_fetch_array($stmt, OCI_ASSOC+OCI_RETURN_NULLS)) {
    $row_data = array();
    foreach ($row as $item) {
        array_push($row_data, $item);
    }
    array_push($data, $row_data);
}
oci_free_statement($stmt);
//To close the connection
oci_close($conn);
//To print the fields as json
$response=["fields"=>[],"data"=>[],"table"=>"$table"];
$response["fields"] = $fields;
$response["data"] = $data;
echo json_encode($response);
?>