<?php 
$json = file_get_contents("php://input");
file_put_contents("usuarios.json", $json); 
?>