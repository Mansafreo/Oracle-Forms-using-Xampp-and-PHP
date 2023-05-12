<?php
include_once 'connect.php';
//To get all the tables present in the oracle database
$sql = "SELECT table_name FROM user_tables";
$stmt = oci_parse($conn, $sql);
oci_execute($stmt);
//To get the tables
$tables = array();
while ($row = oci_fetch_array($stmt, OCI_ASSOC+OCI_RETURN_NULLS)) {
    foreach ($row as $item) {
        array_push($tables, $item);
    }
}
oci_free_statement($stmt);
oci_close($conn);
//To print the tables as json
echo json_encode($tables);
