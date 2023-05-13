<?php
//Pause error reporting
error_reporting(0);
//include database connection   
include 'connect.php';
//To get what views are inside the database
$sql = "SELECT view_name FROM user_views";
//Prepare sql using conn and returns the statement identifier
$stid = oci_parse($conn, $sql);
//Execute a statement returned from oci_parse()
oci_execute($stid);
//if error, retrieve the error using the oci_error() function & output an error message
if (!$stid) {
    $e = oci_error($conn);
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}
$views = array();
//Fetches multiple rows from a query into a two-dimensional array
while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {
    //Converts the characters that have special meaning for HTML
    $row = htmlentities($row['VIEW_NAME'], ENT_QUOTES);
    //Push one or more elements onto the end of array
    array_push($views, $row);
}
//Free all resources associated with the statement identifier, and close the connection
oci_free_statement($stid);
//To loop through the views and make sure each one of them actually exists
$viewsThatExist = array();
foreach($views as $view){
    $sql = "SELECT * FROM ".$view;
    //Prepare sql using conn and returns the statement identifier
    $stid = oci_parse($conn, $sql);
    //Execute a statement returned from oci_parse()
    oci_execute($stid);
    //if error, retrieve the error using the oci_error() function & output an error message
    if (!$stid) {
        $e = oci_error($conn);
        trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
    }
    //Fetches multiple rows from a query into a two-dimensional array
    while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {
        //Push one or more elements onto the end of array
        array_push($viewsThatExist, $view);
    }
    //Free all resources associated with the statement identifier, and close the connection
    oci_free_statement($stid);
}
//Close the connection
oci_close($conn);
//To remove duplicates
$viewsThatExist = array_unique($viewsThatExist);
//To sort the array
sort($viewsThatExist);
//Print out the views that exist
printf(json_encode($viewsThatExist));
?>
