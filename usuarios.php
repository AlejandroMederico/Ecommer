<?php 
// leer jsom
$Json = file_get_contents("usuarios.json");
if ($Json =="") {
    file_put_contents("usuarios.json","[]");
}
$Json = file_get_contents("usuarios.json");
// Pasar de string a array 
$myarray = json_decode($Json, true);
// prints array
// var_dump($myarray); 

$nombreCrearCuenta = $_POST['nombreCrearCuenta'];
$apellidoCrearCuenta = $_POST['apellidoCrearCuenta'];
$cuentaCrearCuenta = $_POST['cuentaCrearCuenta'];
$passCrearCuenta = $_POST['passCrearCuenta'];
$emailCrearCuenta = $_POST['emailCrearCuenta'];
//Nueva cadera
$array2 = Array (
    Array (
        "ID" => count($myarray)+1,
        "Nombre" => $nombreCrearCuenta,
        "Apellido" => $apellidoCrearCuenta,
        "Cuenta" => $cuentaCrearCuenta,
        "Pass" => $passCrearCuenta,
        "Email" => $emailCrearCuenta
));

$resultado = array_merge($myarray, $array2);
var_dump($resultado);
$sumajson = json_encode($resultado);
$bytes1 = file_put_contents("usuarios.json", $sumajson); 
