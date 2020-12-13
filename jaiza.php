<?php 
  
// data strored in array
// $array = Array (
//     Array (
//         "id" => "01",
//         "name" => "Olivia Mason",
//         "designation" => "System Architect"
//     ),
//     Array (
//         "id" => "02",
//         "name" => "Jennifer Laurence",
//         "designation" => "Senior Programmer"
//     ),
//     Array (
//         "id" => "03",
//         "name" => "Medona Oliver",
//         "designation" => "Office Manager"
//     )
// );

// pasar array a string
// $json = json_encode($array);
// $bytes = file_put_contents("myfile.json", $json); 
// prints array
// var_dump($array);
$Json = file_get_contents("stock.json");
if ($Json =="") {
    file_put_contents("stock.json","[]");
} 

// leer jsom
$Json = file_get_contents("stock.json");
// Pasar de string a array 
$myarray = json_decode($Json, true);
// prints array
// var_dump($myarray); 

$nombreFor = $_POST['nombreForm'];
$precioFor = $_POST['precioForm'];
$cantidadFor = $_POST['cantidadForm'];
$imgForm = $_FILES[ "imgForm" ] [ "name" ];
//la imagen subida se guarda en el sitio
move_uploaded_file($_FILES[ "imgForm" ] [ "tmp_name" ], "img/$imgForm");
//Nueva cadera
$array2 = Array (
    Array (
        "ID" => count($myarray)+1,
        "Nombre" => $nombreFor,
        "Precio" => $precioFor,
        "Cantidad" => $cantidadFor,
        "Imagen" => $imgForm
));
// prints array
// var_dump($array2); 


$resultado = array_merge($myarray, $array2);
var_dump($resultado);
$sumajson = json_encode($resultado);
$bytes1 = file_put_contents("stock.json", $sumajson); 



// el otro documento php

// $usuario = $_POST['usuario'];
// $pass = $_POST['pass'];

// $arr_clientes = array('nombre'=> $usuario, 'Password'=> $pass);


//Creamos el JSON
// $json_string = json_encode($arr_clientes);
// $file = 'clientes.json';
// file_put_contents($file, $json_string);

//Leemos el JSON
// $datos_clientes = file_get_contents("clientes.json");


// $json1_string = json_encode($suma);
// $file = 'jaiza.json';
// file_put_contents($file, $json1_string);

// $json_clientes = json_decode($datos_clientes, true);
// $suma = array();
// $suma = $datos_clientes.$arr_clientes;
// if($usuario === '' || $pass=== ''){
//     echo json_encode('error'.$pass);
// }else{
//     echo json_encode('Correcto: <br>Usuario: '.$usuario.'<br>Contraseña: '.$pass.$datos_clientes);
// }

?>