<?php
//to get the view name from post request
@$viewName = $_POST['viewName'];
if(!isset($viewName)){
    $viewName = $_GET['viewName'];
}
//include database connection
include 'connect.php';
//To get the view data
$sql = "SELECT * FROM ".$viewName;
//Prepare sql using conn and returns the statement identifier
$stid = oci_parse($conn, $sql);
//Execute a statement returned from oci_parse()
oci_execute($stid);
//if error, retrieve the error using the oci_error() function & output an error message
if (!$stid) {
    $e = oci_error($conn);
    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
}
$fields = array();
//To get all the fields in the view
$num_fields = oci_num_fields($stid);
for ($i = 1; $i <= $num_fields; $i++) {
    //Returns the name of a field from the statement
    $fieldName= oci_field_name($stid, $i);
    $fieldType= oci_field_type($stid, $i);
    $arr=['name'=>$fieldName,'type'=>$fieldType];
    //Push one or more elements onto the end of array
    array_push($fields, $arr);
}
$probableFields = array();//An array to store fields that we might need to find the average of or the total of
//Loop through the fields and get the ones that are numbers and do not include the word ID and is not the first field
foreach($fields as $field){
    if(strpos($field['type'], 'NUMBER') !== false && strpos($field['name'], 'ID') === false && $field['name'] !== $fields[0]['name']){
        array_push($probableFields, $field['name']);
    }
}
//Fetches multiple rows from a query into a two-dimensional array
$data = array();
while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {
    //Push one or more elements onto the end of array
    array_push($data, $row);
}
//Free all resources associated with the statement identifier, and close the connection
oci_free_statement($stid);
oci_close($conn);
$response=['fields'=>$fields,'data'=>$data,'probableFields'=>$probableFields];
printf(json_encode($response));
?>