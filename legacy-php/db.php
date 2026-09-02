<?php

$conn = mysqli_connect("localhost", "root", "", "nikunj_creation");

if(!$conn){
    die("Connection Failed: " . mysqli_connect_error());
}

?>