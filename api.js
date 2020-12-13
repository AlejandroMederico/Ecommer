const formulario = document.getElementById('formulario'),
      productoCreados = document.getElementById('productoCreados'),
      btnMostarJson = document.getElementById('btnMostarJson'),
      btnBorrarJson = document.getElementById('btnBorrarJson'),
      formCrearCuenta = document.getElementById('formCrearCuenta'),
      crearUsuario = document.querySelector('#navegador .navIzquierdo .fa-user-plus'),
      loginNav = document.querySelector('#navegador .navIzquierdo .fa-lock'),
      formLogin = document.getElementById('formLogin'),
      navCuenta = document.getElementById('navCuenta'),
      mensajeLogin = document.getElementById('mensajeLogin'),
      ventaDerecha = document.getElementById('ventaDerecha'),
      busquedaNav = document.querySelector('.navDerecho input'),
      busquedaSdibar = document.querySelectorAll('#ventaIzq a'),
      logo =document.getElementById('logo'),
      carrito= document.getElementById('carrito'),
      btnVentasJson = document.getElementById('btnVentasJson'),
      btnForm = document.getElementById('btnForm');

class producto{
    constructor(ID, Nombre, Precio,Imagen,cantidad){
        this.ID = ID;
        this.Nombre = Nombre;
        this.Precio = Precio;
        this.Imagen= Imagen;
        this.cantidad = cantidad;
        } 
    }

// carga de imagen de Json
function leerStock() {
    fetch('stock.json')
    .then( data => data.json())
    .then( data =>{
        // console.log(data);
        ventaDerecha.innerHTML='';
        data.forEach( elemento =>{
            // console.log(elemento);
            ventaDerecha.innerHTML+=`
                                <div class="cadaArticulo " data-nombre="${elemento.Nombre}">
                                    <img src="img/${elemento.Imagen}" alt="">
                                    <p class="id">${elemento.ID}</p>
                                    <p>${elemento.Nombre}</p>
                                    <p>${elemento.Precio} $</p>
                                    <a href="#" id="compra">Comprar</a>
                                </div>
                                    `;
        })

        //////////////////////*****COMPRAR PRODUCTO******* */
        document.querySelectorAll('#venta .cadaArticulo').forEach( (elemento, index) =>{
            elemento.addEventListener('click', e =>{
                e.preventDefault();
                let usuario = localStorage.getItem('CuentaActiva');
                      
                if (!(usuario == null)) {
                    if (e.target.id=="compra") {
                        let padre = e.target.parentElement,
                            id = padre.getElementsByTagName('p')[0].textContent,
                            nombre = padre.getElementsByTagName('p')[1].textContent,
                            preciopro = padre.getElementsByTagName('p')[2].textContent,
                            precio = preciopro.slice(0,preciopro.length-2),
                            imgPro = padre.getElementsByTagName('img')[0].src,
                            imagen = imgPro.slice(imgPro.lastIndexOf('/')+1,imgPro.length);
                           
                          
                        let productosLocal = JSON.parse(localStorage.getItem('Compra')),
                            productos= new producto (id, nombre, precio,imagen,1);
                        
                        if(productosLocal != null) {
                            if(productosLocal[productos.ID]==undefined){
                                productosLocal = {
                                    ...productosLocal,// transforma array [] a una lista de argumentos ()
                                    [productos.ID]:productos // this.tag= nombre del tag
                                }
                            }else{
                                productosLocal[productos.ID].cantidad +=1;
                            }  
                        }else{
                            productosLocal =  {
                                [productos.ID]: productos
                            }
                        } 
                        localStorage.setItem('Compra',JSON.stringify(productosLocal));

                        //carrito suma
                        let carritolocal = localStorage.getItem('carritolocal'); 
                        carritolocal=parseInt(carritolocal);
                        carrito.textContent= `  ${carritolocal+1}`;
                        localStorage.setItem('carritolocal',carritolocal+1);
                        
                        //compra totales
                        let compraTotal = localStorage.getItem('compraTotal'),
                            totalCadaProducto= parseInt(productosLocal[productos.ID].Precio) ;  
                        if (compraTotal == null) {
                            localStorage.setItem('compraTotal',totalCadaProducto)
                            document.getElementById('totalLocalStore').textContent =`${totalCadaProducto}  $`
                        } else {
                            compraTotal = parseInt(compraTotal);
                            compraTotal =totalCadaProducto+compraTotal;
                            localStorage.setItem('compraTotal',compraTotal);
                        }

                    }
                }
            });
            
        })
    });

    //carrito suma
    let carritolocal = localStorage.getItem('carritolocal'); 
    if (carritolocal == null) {
        localStorage.setItem('carritolocal',0);
        carrito.textContent= `  0`;
    }else{
        carritolocal=parseInt(carritolocal);
        carrito.textContent= `  ${carritolocal}`;
    }

}

leerStock();


// desactivar todos los menus
function desactivar() {
    document.querySelectorAll('#contenido>div').forEach( e => {
        e.classList.add('desactivo');
    });
} 


//mostar usuario y cierre de seccion
function usuarioLocal() {
    let usuario = localStorage.getItem('CuentaActiva')
    
    usuario = JSON.parse(usuario);
    if (usuario == null) {
        navCuenta.innerHTML = ``;
    }else{
            if (usuario.ID == 1) {
                navCuenta.innerHTML = ` 
                <a href="#" class="fas fa-power-off" id="cerrarSeccion">   Cerrar Seccion</a>
                <a href="#" class="fas fa-server" id="administrador">  ${usuario.Nombre}</a>
                `;
                desactivar();
                document.getElementById('venta').classList.remove('desactivo');

                //   Volver ADMIN
                document.getElementById('administrador').addEventListener('click', e =>{
                e.preventDefault()
                desactivar();
                document.getElementById('crearProducto').classList.remove('desactivo');   
                });
            }else{
                navCuenta.innerHTML = ` 
                <a href="#" class="fas fa-power-off" id="cerrarSeccion">   Cerrar Seccion</a>
                <a href="#" class="fas fa-user-check">  ${usuario.Nombre}</a>
                `;
            }
            //   Cerrar seccion
            document.getElementById('cerrarSeccion').addEventListener('click', e =>{
                e.preventDefault()
                // console.log(e.target);
                localStorage.removeItem('CuentaActiva');
                navCuenta.innerHTML = ``; 
                localStorage.removeItem('Compra');
                localStorage.removeItem('carritolocal');  
                localStorage.removeItem('compraTotal'); 
                desactivar();
                document.getElementById('venta').classList.remove('desactivo'); 
                    //carrito suma
                let carritolocal = localStorage.getItem('carritolocal'); 
                if (carritolocal == null) {
                    localStorage.setItem('carritolocal',0);
                    carrito.textContent= `  0`;
                }else{
                    carritolocal=parseInt(carritolocal);
                    carrito.textContent= `  ${carritolocal}`;
                }
                });
        }
}
usuarioLocal();

//////////////  *****************Carrito de compras************ ////////////
carrito.addEventListener('click', e => {
    let carritoLocalStore = localStorage.getItem('Compra'),
        CuentaActiva = localStorage.getItem('CuentaActiva');
        
    e.preventDefault();
    desactivar();
    // console.log(carritoLocalStore);
    document.getElementById('carritoCompra').classList.remove('desactivo');
    if(carritoLocalStore == null){
        document.getElementById('mensajeCompra').classList.remove('desactivo');
        document.getElementById('ComprasCarritoLocal').innerHTML =``;
        // console.log(document.querySelector('#contenedorCarritoCompra .totalcompra'));
        document.querySelector('#contenedorCarritoCompra .totalcompra').classList.add('desactivo');       
    }else{
        document.getElementById('mensajeCompra').classList.add('desactivo');
        document.querySelector('#contenedorCarritoCompra .totalcompra').classList.remove('desactivo');   
        carritoLocalStore = JSON.parse(carritoLocalStore);
        // console.log(carritoLocalStore);
        document.getElementById('ComprasCarritoLocal').innerHTML =``;
        Object.values(carritoLocalStore).forEach(element => {
            // console.log(element.Nombre);
            let totalCadaProducto = element.cantidad*element.Precio;
            document.getElementById('ComprasCarritoLocal').innerHTML +=`
            <div class="cadaproducto">
                <div class="conteImgCreado">
                     <i class="far fa-trash-alt"></i>
                    <img src="img/${element.Imagen}" alt="" class="imgCreado">
                    <p id="cadaproductoID">${element.ID}</p>
                </div>
                <div class="nombreCreado">
                    <p>${element.Nombre}</p>
                </div>
                <div class="cantidadCreado">
                    <i class="fas fa-arrow-circle-down"></i>
                    <p>${element.cantidad}</p>
                    <i class="fas fa-arrow-circle-up"></i>
                </div>
                <div class="precioCreado">
                    <p>${element.Precio}</p>
                    <p> $</p>
                </div>
                <div class="btnCadaProducto">
                    <p>${totalCadaProducto} $</p>
                </div>    
            </div>
                `;
            let compraTotal = localStorage.getItem('compraTotal');    
            if (compraTotal == null) {
                localStorage.setItem('compraTotal',totalCadaProducto)
                document.getElementById('totalLocalStore').textContent =`${totalCadaProducto}  $`
            } else {
                compraTotal = parseInt(compraTotal);
                // compraTotal =totalCadaProducto+compraTotal;
                localStorage.setItem('compraTotal',compraTotal);
                document.getElementById('totalLocalStore').textContent =`${compraTotal}  $`
            }

        });
    }

    //modificar 
    document.getElementById('ComprasCarritoLocal').addEventListener('click', e =>{
        let Compra = localStorage.getItem('Compra'),
            compraLocal = JSON.parse(Compra);
        e.preventDefault();
        //borrar
        if(e.target.classList.contains('fa-trash-alt')){
            let id = e.target.parentElement.parentElement.getElementsByTagName('p')[0].textContent;
            
            //carrito local
            let carroStore = localStorage.getItem('carritolocal');
            carroStore= parseInt(carroStore);
            carroStore = carroStore - compraLocal[id].cantidad ;
            localStorage.setItem('carritolocal',carroStore)
            carrito.textContent= `  ${carroStore}`;

            //compra total
            let compraTotal = localStorage.getItem('compraTotal');    
            compraTotal = parseInt(compraTotal);
            compraTotal -= (compraLocal[id].Precio*compraLocal[id].cantidad);
            localStorage.setItem('compraTotal',compraTotal);
            document.getElementById('totalLocalStore').textContent =`${compraTotal}  $`;   

            delete compraLocal[id];
            localStorage.setItem('Compra',JSON.stringify(compraLocal));
            e.target.parentElement.parentElement.remove();

        }
        //decrementar
        if(e.target.classList.contains('fa-arrow-circle-down')){
            let id = e.target.parentElement.parentElement.getElementsByTagName('p')[0].textContent;
            console.log(compraLocal[id].cantidad);
            if (compraLocal[id].cantidad >= 2) {
                compraLocal[id].cantidad -= 1;
                e.target.parentElement.parentElement.getElementsByTagName('p')[2].textContent = compraLocal[id].cantidad;
                localStorage.setItem('Compra',JSON.stringify(compraLocal));

                //carrito local
                let carroStore = localStorage.getItem('carritolocal');
                carroStore= parseInt(carroStore);
                carroStore = carroStore -1;
                localStorage.setItem('carritolocal',carroStore)
                carrito.textContent= `  ${carroStore}`;

                //precio del producto
                e.target.parentElement.parentElement.getElementsByTagName('p')[5].textContent = `${compraLocal[id].cantidad*compraLocal[id].Precio}  $`;

                //compra total
                let compraTotal = localStorage.getItem('compraTotal');    
                compraTotal = parseInt(compraTotal);
                compraTotal -= compraLocal[id].Precio;
                localStorage.setItem('compraTotal',compraTotal);
                document.getElementById('totalLocalStore').textContent =`${compraTotal}  $`;    
            }
            
        }
        //incrementar
        if(e.target.classList.contains('fa-arrow-circle-up')){
            let id = e.target.parentElement.parentElement.getElementsByTagName('p')[0].textContent;
            fetch('stock.json')
            .then( data => data.json())
            .then( data =>{
                // console.log(data);
                data.forEach(elemento =>{
                    if (elemento.ID==id) {
                      let cantidadmax = elemento.Cantidad;  
                    //   console.log(cantidadmax);
                      if (compraLocal[id].cantidad < cantidadmax) {
                        compraLocal[id].cantidad += 1;
                        e.target.parentElement.parentElement.getElementsByTagName('p')[2].textContent = compraLocal[id].cantidad;
                        localStorage.setItem('Compra',JSON.stringify(compraLocal));
            
                        //carrito local
                        let carroStore = localStorage.getItem('carritolocal');
                        carroStore= parseInt(carroStore);
                        carroStore = carroStore +1;
                        localStorage.setItem('carritolocal',carroStore)
                        carrito.textContent= `  ${carroStore}`;
            
                        //precio del producto
                        e.target.parentElement.parentElement.getElementsByTagName('p')[5].textContent = `${compraLocal[id].cantidad*compraLocal[id].Precio}  $`;
            
                        //compra total
                        let compraTotal = localStorage.getItem('compraTotal');    
                        compraTotal = parseInt(compraTotal);
                        compraTotal += parseInt(compraLocal[id].Precio);
                        localStorage.setItem('compraTotal',compraTotal);
                        document.getElementById('totalLocalStore').textContent =`${compraTotal}  $`;
                      }
                    }
                });
            });
            
            
        }
    });
    //presionar comprar
    document.getElementById('btnComprar').addEventListener('click', e =>{
        e.preventDefault();
        let compraFinal = Object.values(JSON.parse(localStorage.getItem('Compra')));
        console.log(compraFinal);  
        // Agregar compra a la cuenta
        CuentaActiva = JSON.parse(CuentaActiva); 
        fetch('usuarios.json')
        .then( data => data.json())
        .then( data =>{
            console.log(data);
            data.forEach (element =>{
                if(element.ID == CuentaActiva.ID){
                    element.Compra = carritoLocalStore;
                }
            });
            console.log(data);
            fetch('compra.php',{
                method: 'POST',
                body: JSON.stringify(data)
            })   
        });
        // disminuir stock

        fetch('stock.json')
        .then( data => data.json())
        .then( data =>{
            console.log(data);
            compraFinal.forEach( cadaCompra =>{
                let compraID = cadaCompra.ID,
                    compraCantidad = cadaCompra.cantidad;
                data.forEach( stockProducto =>{
                    if (stockProducto.ID == compraID) {
                        stockProducto.Cantidad = parseInt(stockProducto.Cantidad);
                        stockProducto.Cantidad -= compraCantidad;

                    }
                });            
            });            
            // console.log(cadaCompra);
            // console.log(compraCantidad);
            fetch('borrar.php',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)})
            .then( data =>{
            //limpiar variables
            localStorage.removeItem('Compra');
            localStorage.removeItem('carritolocal');  
            localStorage.removeItem('compraTotal'); 
            desactivar();
            document.getElementById('venta').classList.remove('desactivo'); 
                //carrito suma
            let carritolocal = localStorage.getItem('carritolocal'); 
            if (carritolocal == null) {
                localStorage.setItem('carritolocal',0);
                carrito.textContent= `  0`;
            }else{
                carritolocal=parseInt(carritolocal);
                carrito.textContent= `  ${carritolocal}`;
            } 
            });
        }); 
    });

});

//////////////  *****************Filtrado de Producto************ ////////////

// nav//
busquedaNav.addEventListener('input', e => {
    // console.log(e.target.value);
    document.querySelectorAll('#venta .cadaArticulo').forEach( elemento =>{
        // console.log(elemento.getElementsByTagName('p')[1].textContent);
        elemento.classList.add('desactivo');
        let elementoNombre=elemento.getElementsByTagName('p')[1].textContent.toUpperCase();
        if (elementoNombre.includes(e.target.value.toUpperCase())) {
            console.log(elemento);
            elemento.classList.remove('desactivo');       
        } 
    });
    
});

//sdibar//
busquedaSdibar.forEach( enlace => {
    enlace.addEventListener('click', e =>{
        e.preventDefault();
        // console.log(e.target.textContent.toUpperCase());
        //leer cada articulo
        document.querySelectorAll('#venta .cadaArticulo').forEach( elemento =>{
            // console.log(elemento.getElementsByTagName('p')[1].textContent);
            elemento.classList.add('desactivo');
            let elementoNombre=elemento.getElementsByTagName('p')[1].textContent.toUpperCase();
            if (elementoNombre.includes(e.target.textContent.toUpperCase())) {
                // console.log(elemento);
                elemento.classList.remove('desactivo');       
            } 
        });
    });
});


//////////////  *****************LOGIN USUARIO************ ////////////

document.getElementById('btnLoginIngresar').addEventListener('click', e =>{
    e.preventDefault();
    let datos = new FormData(formLogin),
        nombreLogin = datos.get('nombreLogin'),
        passLogin = datos.get('passLogin');

    fetch('usuarios.json')
    .then( data => data.json())
    .then( datos =>{
        console.log(datos);
        
        datos.forEach(element => {   
            if (element.Cuenta == nombreLogin && element.Pass == passLogin) {
                // console.log(element);
                localStorage.setItem('CuentaActiva',JSON.stringify(element));
                usuarioLocal();
                desactivar();
                document.getElementById('venta').classList.remove('desactivo');
                if (element.ID == 1) {
                    usuarioLocal();
                    desactivar();
                    document.getElementById('crearProducto').classList.remove('desactivo');
                }   
            }else{
                mensajeLogin.classList.remove('desactivo');
                mensajeLogin.innerHTML=`
                <p>Debe Registrarse su usuario para poder ingresar</p>
                `;
                setTimeout(function(){
                    mensajeLogin.classList.add('desactivo')
                    // console.log('hola');
                },3000);

            }
            document.getElementById('nombreLogin').value ='';
            document.getElementById('passLogin').value ='';           
        });
    })
});

//nav boton login
loginNav.addEventListener('click', e => {
    e.preventDefault(); 
    desactivar();
    document.getElementById('login').classList.remove('desactivo');
});
//boton crear cuenta en login
document.getElementById('btnLoginCrearUsuario').addEventListener('click', e => {
    e.preventDefault();
    desactivar();
    document.getElementById('crearCuenta').classList.remove('desactivo');
});

//////////////  *****************CREAR USUARIOS************ ////////////  

//nav crear usuario
crearUsuario.addEventListener('click', e => {
    e.preventDefault();
    desactivar();
    document.getElementById('crearCuenta').classList.remove('desactivo');
});
//crear usuario envian por php
formCrearCuenta.addEventListener('submit', e =>{
    e.preventDefault();
    let datos = new FormData(formCrearCuenta);
    const mensajeCrearCuenta = document.getElementById('mensajeCrearCuenta');
    fetch('usuarios.php',{
        method: 'POST',
        body: datos
    })
    .then( response => response.text())
    .then( text => {
        mensajeCrearCuenta.classList.remove('desactivo');
        mensajeCrearCuenta.innerHTML=`
                                    <p>LA CUENTA ${datos.get('cuentaCrearCuenta')} SE A CREADO EXITOSAMENTE</p>
                                    `;
        setTimeout(function(){
            mensajeCrearCuenta.classList.add('desactivo')
        },3000);
        formCrearCuenta.reset();
    });
});


//////////////  CREAR PRODUCTOS  PHP////////////

formulario.addEventListener('submit', (e) =>{
    e.preventDefault();
    let datos = new FormData(formulario),
        nombreFor = datos.get('nombreForm'),
        precioFor = datos.get('precioForm'),
        cantidadFor = datos.get('cantidadForm'),
        imagenFor = datos.get('imgForm'),
        imgUrl = imagenFor.name;
    
    

    fetch('jaiza.php',{
        method: 'POST',
        body: datos
    })
    .then( response => response.text())
    .then( text => {
        productoCreados.innerHTML +=`
                                <div class="cadaproducto">
                                    <div class="conteImgCreado">
                                        <img src="img/${imgUrl}" alt="" class="imgCreado">
                                    </div>
                                    <div class="nombreCreado">
                                        <p>${nombreFor}</p>
                                    </div>
                                    <div class="cantidadCreado">
                                        <p>${cantidadFor}</p>
                                    </div>
                                    <div class="precioCreado">
                                         <p>${precioFor}</p>
                                         <p> $</p>
                                    </div>
                                    <div class="btnCadaProducto">
                                         <a href="#" class="fas fa-trash-alt"></a>
                                    </div>    
                                </div>
    `;
 
        document.getElementById('nombreForm').value ='';
        document.getElementById('precioForm').value =''; 
        document.getElementById('cantidadForm').value ='';
    })

 
});

//eliminar producto PHP
productoCreados.addEventListener('click', (e) =>{
    e.preventDefault();
    if (e.target.classList.contains('fa-trash-alt')) {
        let padre = e.target.parentElement.parentElement,
            nombre=padre.getElementsByTagName('p')[0].innerText,
            cantidad = padre.getElementsByTagName('p')[1].innerText,
            precio = padre.getElementsByTagName('p')[2].innerText,
            imgPro=padre.getElementsByTagName('img')[0].attributes[0].value,
            imagen = imgPro.slice(imgPro.lastIndexOf('/')+1,imgPro.length);
            console.log(nombre);
            console.log(imagen);
        fetch('stock.json')
        .then( data => data.json())
        .then( data =>{

            console.log(data);
            data.forEach((element,index) => {
                if (nombre.toUpperCase() == element.Nombre.toUpperCase() && cantidad == element.Cantidad && precio == element.Precio && imagen == element.Imagen) {
                    console.log(element);
                    
                    delete data[index];
                    data.splice(index,1);
                }
            });
            console.log(data);
            fetch('borrar.php',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)});
            padre.remove();
        })
    }
});

//MOSTAR  PRODUCTOS PHP
btnMostarJson.addEventListener('click', e =>{
    e.preventDefault();
    fetch('stock.json')
    .then( data => data.json())
    .then( data =>{
        console.log(data);
        productoCreados.innerHTML =``;
        productoCreados.innerHTML =`
                                <div class="tituloProductoCreados">
                                    <p>Imagen</p>
                                    <p>Nombre</p>
                                    <p>Cantidad</p>
                                    <p>Precio</p>
                                    <p>Borrar</p>
                                </div>
                                    `;
        data.forEach((element,index) => {
            productoCreados.innerHTML +=`
                                <div class="cadaproducto">
                                    <div class="conteImgCreado">
                                        <span>${index+1}</span>
                                        <img src="img/${element.Imagen}" alt="" class="imgCreado">
                                    </div>
                                    <div class="nombreCreado">
                                        <p>${element.Nombre}</p>
                                    </div>
                                    <div class="cantidadCreado">
                                        <p>${element.Cantidad}</p>
                                    </div>
                                    <div class="precioCreado">
                                        <p>${element.Precio}</p>
                                        <p> $</p>
                                    </div>
                                    <div class="btnCadaProducto">
                                        <a href="#" class="fas fa-trash-alt"></a>
                                    </div>    
                                </div>
                                    `;
        });
    })
  
    // });
});

//BORRAR TODOS PRODUCTOS PHP
btnBorrarJson.addEventListener('click', e =>{
    e.preventDefault();
    const borrarTodo = '[]';
    fetch('borrar.php',{
    method: 'POST',
    headers:{
        'Content-Type': 'application/json'
    },
    body: borrarTodo});
    productoCreados.innerHTML =`
                                <div class="tituloProductoCreados">
                                    <p>Imagen</p>
                                    <p>Nombre</p>
                                    <p>Cantidad</p>
                                    <p>Precio</p>
                                    <p>Borrar</p>
                                </div>
                                    `;
});

/////////////// **************** MOSTRAR VENTAS ADMINISTRADOR /////////////

btnVentasJson.addEventListener('click', e =>{
    e.preventDefault();
    fetch('usuarios.json')
    .then( data => data.json())
    .then( usuariosJson =>{
        // console.log(usuariosJson)
        document.getElementById('productoCreados').innerHTML=`
                                                            <h2>VENTAS REALIZADAS</h2>          
                                                            `;
        usuariosJson.forEach( element =>{
            // console.log(element.Compra);
            if (element.Compra != undefined) {
                let comprar =0;
                
                // console.log(element);
                document.getElementById('productoCreados').innerHTML+=`
                <P class="datosComprador">Comprador:    ${element.Nombre.toUpperCase()}      Correo:    ${element.Email}</P> 
                <div class="tituloProductoCreados">
                    <p>Imagen</p>
                    <p>Nombre</p>
                    <p>Cantidad</p>
                    <p>Precio</p>
                    <p>Total</p>
                </div>         
                `;
                // console.log(element.Compra);
                // console.log(Object.values(element.Compra));
                Object.values(element.Compra).forEach( compra =>{
                    console.log(compra);
                    comprar += compra.cantidad*compra.Precio;
                    console.log(comprar);
                    
                    document.getElementById('productoCreados').innerHTML+=`
                    <div class="cadaproducto">
                        <div class="conteImgCreado">
                            <img src="img/${compra.Imagen}" alt="" class="imgCreado">
                        </div>
                        <div class="nombreCreado">
                            <p>${compra.Nombre}</p>
                        </div>
                        <div class="cantidadCreado">
                            <p>${compra.cantidad}</p>
                        </div>
                        <div class="precioCreado">
                            <p>${compra.Precio}</p>
                            <p> $</p>
                        </div>
                        <div class="btnCadaProducto">
                            <p>${compra.cantidad*compra.Precio} $</p>
                        </div>    
                    </div>
                    
                    `;
                });
                document.getElementById('productoCreados').innerHTML+=`
                    <div class="totalPorCompra">
                            <p>TOTAL</p>
                            <p>${comprar} $</p>
                    </div>
                `;     
            }
            
        });
    });
});


// Enviar un json


// const persona = {
//     nombre: "Alejandro Jesus",
//     apellido: "Mederico Gonzalez",
//     edad: 30
// }

// fetch('borrar.php',{
//     method: 'POST',
//     headers:{
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(persona)
// })
// .then( response => response.text())
// .then( text => console.log(text))
// .catch( error => console.log(error));

   // ******** LEYENDO UN JSON *********
    
// fetch('usuarios.json') 
// .then( data => data.json())
// .then( data =>{

//     console.log(data);
    
//     //    tablaBody.innerHTML='';
//     //    data.forEach( (elemento,index) => {
//     //        tablaBody.innerHTML += `
//     //                                    <tr>
//     //                                    <th scope="row">${index+1}</th>
//     //                                    <td>${elemento.libro}</td>
//     //                                    <td>${elemento.autor}</td>
//     //                                    <td>${elemento.protagonistas}</td>
//     //                                    </tr>
//     //        `
//     // });
// })