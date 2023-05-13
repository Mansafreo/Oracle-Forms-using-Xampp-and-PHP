<?php
//To check if the user is logged in
session_start();
if(!isset($_SESSION['username'])){
    echo false;
}
else{
 echo true;
}
?>
