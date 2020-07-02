//
var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    
    name: 'My App',
    // App id
    id: 'com.agendamiento',
    // Enable swipe panel
    panel: {
        swipe: 'left'
    },
    // Add default routes
    routes: [
        {
            path: '/home/',
            url: 'index.html',
            
        },
        {
            path: '/usuario/',
            url: 'usuario.html',
            on: {
                pageAfterIn: function () {
                    // do something after page gets into the view
                },
                pageInit: function () {
                    // do something when page initialized
                    CargarSelectEmpresasTurno();
                    RestablecerHoras();
                }
            }
        },
        {
            path: '/servicio/',
            url: 'servicios.html',
        },
        {
            path: '/subservicio/',
            url: 'subservicio.html',
        },
        {
            path: '/tikect/',
            url: 'tikectturno.html',
        },
        {
            path: '/ajustarhora/',
            url: 'ajustarhora.html',
        },
        {
            path: '/ultimotikect/',
            url: 'ultimotikect.html',
            on: {
                pageAfterIn: function () {
                    // do something after page gets into the view
                },
                pageInit: function () {
                    // do something when page initialized
                    TraerUltimoTurno();
                }
            }
        },
        {
            path: '/moduloturnos/',
            url: 'historialturno.html',
            on: {
                pageAfterIn: function () {
                    // do something after page gets into the view
                },
                pageInit: function () {
                    // do something when page initialized
                    CargarTablaTurnos();
                    
                }
            }
        },
        {
            path: '/perfil/',
            url: 'perfil.html',
            on: {
                pageAfterIn: function () {
                    // do something after page gets into the view
                },
                pageInit: function () {
                    // do something when page initialized
                    TraerDatosUsuario();
                }
            }
        },
        {
            path: '/entidades/',
            url: 'entidades.html',
            on: {
                pageAfterIn: function () {
                    // do something after page gets into the view
                },
                pageInit: function () {
                    // do something when page initialized
                    CargarTablaEmpresas();
                    CargarSelectEmpresas();
                }
            }
        }
    ],
    
});
//
//
var $$ = Dom7;
//
var mainView = app.views.create('.view-main');
//
 document.addEventListener('deviceready', function () {

    if(localStorage.IdUsuario != undefined){
        app.views.main.router.navigate('/usuario/');
        restaurar()
    }else{
        ocultar();
    }
    
//     if(localStorage.IdUsuario == undefined){
//         alert("Hola otra vez");
//         location.href ="index.html";
//     }else{
    
//         //location.href ="usuario.html";
        
//     }


});
$(document).ready(function(){
    var conn = true;
    checkConnection();

    //alert(conn ? "Hay Internet" : "No hay internet");
    if (conn) {
        //app.dialog.alert('Hay Internet', 'Alerta');
    }else{
        app.dialog.alert('No hay internet', 'Alerta');
    }

    function checkConnection(){
        $.ajax({
            url: 'http://167.71.248.182/Agendamientoweb/conexion/archivo.php',
            async: false,
            data: {'tag': 'connection'}
        })
        .done(function(){conn = true; })
        .fail(function(){conn = false; })

    }
})

function ocultar(){
    var x = document.getElementById("myDIV");
    x.style.display = "none";
}
function restaurar(){
    var x = document.getElementById("myDIV");
    x.style.display = "block";
}

function DatosLogin(){
    var formulario = document.forms['form_login'];
    var cedula = formulario['cedula'].value;
    var contrasena = formulario['contrasena'].value;
    if (cedula != "") {
        if (contrasena != "") {
            login(cedula, contrasena);
        }else{
            app.dialog.alert('Debe ingresar una contraseña', 'Atención');
            
           
        }
    }else{
        app.dialog.alert('Debe ingresar una cédula registrada', 'Atención');
        
    }
}
//
function DatosEmpresa(){
    var formulario = document.forms['my-form'];
    var IdSede = formulario['sede'].value;
    var IdEmpresa = formulario['enti'].value;

    if(IdEmpresa != ""){
        app.views.main.router.navigate('/servicio/');
        TraerServicios(IdSede, IdEmpresa);
    }else{
        app.dialog.create({
            title: '¡Por favor seleccione una entidad!',
            //text: '<form id="form_nueva_contra"><div class="list no-hairlines-md"> <li class="item-content item-input item-input-outline"><div class="item-inner"><div class="item-title item-floating-label">Contraseña</div><div class="item-input-wrap"><input type="password" placeholder="Nueva contraseña" id="contrasena" required><span class="input-clear-button"></span></div></div></li></div></form>',
            buttons: [
              {
                text: '<a > <button class="col button button-fill servi"  > Aceptar </button></a>',
              }
            ],
            verticalButtons: true,
          }).open();
    }
}
//
function DatosRegistro(){
    var formulario = document.forms['formu_registro'];
    var nombre = formulario['nombre'].value;
    var apellido = formulario['apellido'].value;
    var cedula = formulario['cedulaR'].value;
    var correo = formulario['correo'].value;
    var contrasena = formulario['contrasenaR'].value;
    var entidad = formulario['empresas_registro'].value;
    var sede = formulario['sedes_registro'].value;

    if(nombre != ""){
        if (apellido != "") {
            if (cedula != "") {
                if (correo != "") {
                    if (contrasena != "") {
                        if(entidad != ""){
                            GuardarRegistro(nombre,apellido,cedula,correo,contrasena,entidad,sede);
                        }else{
                            
                            app.dialog.alert('Debe seleccionar una entidad', 'Atención');
                        }
                    }else{
                        
                        app.dialog.alert('Debe ingresar una contraseña', 'Atención');
                    }
                }else{
                    
                    app.dialog.alert('Debe ingresar un correo', 'Atención');
                }
            }else{
                
                app.dialog.alert('Debe ingresar una contraseña', 'Atención');
            }
        }else{
            
            app.dialog.alert('Debe ingresar un apellido', 'Atención');
        }
    }else{
        
        app.dialog.alert('Debe ingresar un nombre', 'Atención');
    }
}

function ActualizarUsuario(){
    var formulario = document.forms['form_editar_usuario'];
    var nombre = formulario['nombre'].value;
    var apellido = formulario['apellido'].value;
    var cedula = formulario['cedula'].value;
    var correo = formulario['correo'].value;
    var contrasena = formulario['contrasena'].value;
    if(nombre != ""){
        if (apellido != "") {
            if (cedula != "") {
                if (correo != "") {
                    DatosNuevosUsuario(nombre, apellido,cedula,correo, contrasena);
                }else{
                    
                    app.dialog.alert('Debe ingresar un correo', 'Atención');
                }
            }else{
                
                app.dialog.alert('Debe ingresar una cédula', 'Atención');
            }
        }else{
            
            app.dialog.alert('Debe ingresar un apellido', 'Atención');
        }
    }else{
        
        app.dialog.alert('Debe ingresar un nombre', 'Atención');
    }
}

function NuevaEntidad(){
    var formulario = document.forms['form_nueva_entidad'];
    var EntidadNueva = formulario['EntidadNueva'].value;
    var NuevaSede = formulario['NuevaSede'].value;
    
    if (EntidadNueva != "") {
        
        AgregarEntidad(EntidadNueva,NuevaSede);
    }else{
        app.dialog.create({
            title: '¡Por favor seleccione una entidad!',
            //text: '<form id="form_nueva_contra"><div class="list no-hairlines-md"> <li class="item-content item-input item-input-outline"><div class="item-inner"><div class="item-title item-floating-label">Contraseña</div><div class="item-input-wrap"><input type="password" placeholder="Nueva contraseña" id="contrasena" required><span class="input-clear-button"></span></div></div></li></div></form>',
            buttons: [
              {
                text: '<a > <button class="col button button-fill servi"  > Aceptar </button></a>',
              }
            ],
            verticalButtons: true,
          }).open();
    }
}



function verTurno(){
    hora = localStorage.hora;
    TikectTurnoConHora(hora);
}
function RecuperarContrasena(){
    app.dialog.create({
        title: '<center>Ingrese la cédula</center>  ',
        text: '<form id="form_cedula"><div class="list no-hairlines-md insertcedula"><img src="img/ID.png" style="width: 60px; margin-left: 35%;" class="idimg"> <li class="item-content item-input item-input-outline"><div class="item-inner"><div class="item-title item-floating-label">Cédula</div><div class="item-input-wrap"><input type="tel" placeholder="Tú identificacion" required name="cedula" id="cedula"><span class="input-clear-button"></span></div></div></li></div></form>',

        buttons: [
          {
            text: '<a > <button   onclick="CedulaParaContrasena()" class="col button button-fill servi"  > Aceptar </button></a>',
          },
          {
              text: '<a > <button  class="col button button-fill servi"  > Cancelar </button></a>',
          }
        ],
        verticalButtons: true,
      }).open();
}
function CedulaParaContrasena(){

    var formulario = document.forms['form_cedula'];
    var cedula = formulario['cedula'].value;
    if (cedula == "") {
        
        app.dialog.alert('Debe ingresar una cédula registrada', 'Atención');
        RecuperarContrasena();
    }else{
        ConfirmarCedula(cedula);
    }
}

//urlServer = 'http://localhost/AgendamientoPhp/';

//urlServer = 'http://localhost/AgendaPhp/';

//Darwin//
//urlServer = 'http://192.168.1.16/AgendaPhp/';

urlServer = 'http://167.71.248.182/AgendaPhp/';


function RestablecerHoras(){
    app.request.post(urlServer + 'Read/RestablecerHoras', {},
    function (rsp) {       
        //
        var data = JSON.parse(rsp);
        //
    });
}

function TraerHoras() {
    app.request.post(urlServer + 'Read/TraerHoras', {IdSede: localStorage.IdSedeServicio},
    function (rsp) {       
        //
        var data = JSON.parse(rsp);
        //
        
            camposV = '';
            camposV += '<option value="">Seleccionar</option>' ;
            for (var i = 0; i < data.length; i++) {

                camposV += '<option value="' + data[i]['Hora'] + '">' + data[i]['Hora'] + '</option>' ;
            }
    
            document.getElementById("horas").innerHTML = camposV;
        
    });
}
function EnviarHora(){
    var formulario = document.forms['form_hora'];
    var hora = formulario['horas'].value;
    TikectTurnoConHora(hora);
    console.log(hora);
}
function TraerUltimoTurno() {

    

    app.request.post(urlServer + 'Read/TraerUltimoTurno', {IdUsuario: localStorage.IdUsuario},
    function (rsp) {       
        //
        var data = JSON.parse(rsp);
        //
        if (data != "No hay") {
        

        document.getElementById("divUltimoTikect").innerHTML = "<center><h1>Turno #</h1><h2>"+ data[0]['Turno'] +"</h2><h4>Hora: "+ data[0]['Hora'] +" <br> Fecha: "+ data[0]['Fecha'] +" <br>Nombre: "+ data[0]['Nombre'] +" <br>Cédula: "+ data[0]['Cedula']+"</h4></center><div class='info'></div>";
           
        }else{
           
           app.dialog.alert('No tiene turno', 'Atención');
        }
    
    });
}

function login(cedula, contrasena){
    app.preloader.show();
    app.request.post(urlServer + 'Read/login', {cedula: cedula, contrasena: contrasena},
    function (rsp) {       
        //
        var data = JSON.parse(rsp);
        //
        if (data[0]['Estado'] == "RECUPERANDO") {
           localStorage.IdUsuarioRecuperando = data[0]['ID'];
          
            IngresarContra();
            app.preloader.hide();
        }else{
            if(data != "La cedula no existe" && data != "Contrasena incorrecta"){
                var x = document.getElementById("myDIV");
                x.style.display = "block";

                localStorage.IdUsuario = data[0]['ID'];
                localStorage.NombreUsuario = data[0]['Nombre'];
                localStorage.CedulaUsuario = data[0]['Cedula'];

                app.views.main.router.navigate('/usuario/');
                //location.href ="usuario.html";

                localStorage.inicio = 1;
                app.preloader.hide();
                CargarSelectEmpresasTurno();
            }else{
                
                app.dialog.alert('Datos incorrectos', 'Atención');
                app.preloader.hide();
            }
        }
    
    });
}
function IngresarContra(){
    app.dialog.create({
        title: 'Ingrese la nueva contraseña',
        text: '<form id="form_nueva_contra"><div class="list no-hairlines-md"> <li class="item-content item-input item-input-outline"><div class="item-inner"><div class="item-title item-floating-label">Contraseña</div><div class="item-input-wrap"><input type="password" placeholder="Nueva contraseña" id="contrasena" required><span class="input-clear-button"></span></div></div></li></div></form>',
        buttons: [
          {
            text: '<a > <button  onclick="NuevaContrasena()" class="col button button-fill servi"  > Aceptar </button></a>',
          }
        ],
        verticalButtons: true,
      }).open();
      app.preloader.hide();
}

function ConfirmarCedula(cedula){
    app.request.post(urlServer + 'Read/ConfirmarCedula', {cedula: cedula},
    function (rsp) {       
        //
        var data = JSON.parse(rsp);
        //
        if(data != "La cedula es incorrecta"){

            GenerarNuevaContrasena(data[0]['Correo'],data[0]['ID']);
        }else{

           
            app.dialog.alert(data, 'Atención');
        }
    });
}

function GenerarNuevaContrasena(correo, IdUsuario){
    //alert("Por favor espere..");
    //
    app.preloader.show();
    app.request.post(urlServer + 'Read/GenerarNuevaContrasena', {correo: correo, IdUsuario: IdUsuario},
    function (rsp) {       
        //
        var data = JSON.parse(rsp);
        //
        if(data === "hecho"){
            app.dialog.create({
                title: 'RECUPERAR CONTRASEÑA',
                text: 'Se ha enviado una contraseña al correo electronico',
        
                buttons: [
                  {
                    text: '<a > <button  class="col button button-fill servi"  > Aceptar </button></a>',
                  }
                ],
                verticalButtons: true,
              }).open();
              app.preloader.hide();
        }else{
            
            app.dialog.alert(data, 'Atención');
            app.preloader.hide();
        }
    
    });
}
function NuevaContrasena(){
    var formulario = document.forms['form_nueva_contra'];
    var contrasena = formulario['contrasena'].value;
    if (contrasena == "") {
        
        app.dialog.alert('Debe agregar una contraseña nueva', 'Atención');
        IngresarContra();
    }else{
        app.preloader.show();
        IdUsuarioRecuperando = localStorage.IdUsuarioRecuperando;
        app.request.post(urlServer + 'Read/ActualizarContrasena', {contrasena: contrasena, IdUsuarioRecuperando: IdUsuarioRecuperando},
        function (rsp) {       
            //
            var data = JSON.parse(rsp);
            //
            if(data === "Actualizado"){
                app.dialog.create({
                    title: 'Contraseña Actualizada!',
                    text: '',
                    buttons: [
                    {
                        text: '<button class="col button button-fill link popup-close" id="cancelar">Aceptar</button>'
                    }
                    ],
                    verticalButtons: true,
                }).open();
                app.preloader.hide();
                delete localStorage.IdUsuarioRecuperando;
            }else{
                
                app.dialog.alert(data, 'Atención');
                app.preloader.hide();
            }
        
        });
    }
}

function GuardarRegistro(nombre,apellido,cedula,correo,contrasena,entidad,sede){
    //
    app.request.post(urlServer + 'Read/GuardarRegistro', {nombre: nombre, apellido: apellido, cedula: cedula, correo: correo, contrasena:contrasena,entidad: entidad, NoSede: sede},
    function (rsp) {       
        //
        var data = JSON.parse(rsp);
        //
        if(data === "Registro Exitoso!"){
            app.dialog.create({
                title: 'Registro Exitoso!',
                text: '',
                buttons: [
                  {
                    text: '<button class="col button button-fill link popup-close" id="cancelar">Aceptar</button>'
                  }
                ],
                verticalButtons: true,
              }).open();

              document.getElementById("formu_registro").reset();
        }else{
            
            app.dialog.alert(data, 'Atención');
        }
    });
}

function TraerDatosUsuario(){
    app.preloader.show();
    app.request.post(urlServer + 'Read/TraerDatosUsuario', {IdUsuario: localStorage.IdUsuario},
    function (rsp) {       
        //
        var data = JSON.parse(rsp);
        //
        if(data != 2){
            var nombre = data[0]['Nombre'];
            var apellido = data[0]['Apellidos'];
            var cedula = data[0]['Cedula'];
            var correo = data[0]['Correo'];

                var formData = {
                  'nombre': nombre,
                  'apellido': apellido,
                  'cedula': cedula,
                  'correo': correo,
                }
                app.form.fillFromData('#form_editar_usuario', formData);
                app.preloader.hide();
        }else{
            
            app.dialog.alert(data, 'Atención');
            app.preloader.hide();
        }
    
    });
}

 function DatosNuevosUsuario(nombre, apellido,cedula,correo, contrasena){
        
        app.request.post(urlServer + 'Read/EditarUsuario', {IdUsuario: localStorage.IdUsuario, nombre: nombre, apellido: apellido, cedula: cedula, correo: correo, contrasena: contrasena},
        function (rsp) {       
            //
            var data = JSON.parse(rsp);
            //
            if(data === "Actualizado Correctamente!"){
                app.dialog.create({
                    title: 'Actualizacion Exitosa!',
                    text: '',
                    buttons: [
                    {
                        text: '<button class="col button button-fill link popup-close" id="cancelar">Aceptar</button>'
                    }
                    ],
                    verticalButtons: true,
                }).open();
            }else{
                app.dialog.create({
                    title: 'Actualizacion Erronea!',
                    text: '',
                    buttons: [
                    {
                        text: '<button class="col button button-fill link popup-close" id="cancelar">Aceptar</button>'
                    }
                    ],
                    verticalButtons: true,
                }).open();
            }
        });
 }

function TraerServicios(IdSede, IdEmpresa){
    app.preloader.show();
    localStorage.IdEmpresaServicio = IdEmpresa;
    localStorage.IdSedeServicio = IdSede;
    app.request.post(urlServer + 'Read/TraerServicios', {empresa: IdSede},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        
        if (data != "No hay") {
            //
            camposV = '<div class="servicios2 infinite-scroll-content">';
            for (var i = 0; i < data.length; i++) {
                camposV +=  '<a href="/subservicio/"> <button  class="col button button-fill servi" onclick="TraerSubServicios(' + data[i]['IdServicio'] + ')" >' + data[i]['Servicio'] + '</button></a>' ;
            }
            camposV += '</div>';
    
            document.getElementById("divListaServicios").innerHTML = camposV;
            app.preloader.hide();
            
        }else{
            
            app.dialog.alert('La empresa no tiene Servicios', 'Atención');
            app.preloader.hide();
            app.views.main.router.navigate('/entidades/');
        }
    });
}

function TraerSubServicios(IdServicio){
    localStorage.IdServicio = IdServicio;
    app.request.post(urlServer + 'Read/TraerSubServicios', {IdServicio: IdServicio},
    function (rsp) {
        //
        var data = JSON.parse(rsp);

        if(data == 2){
            soloservicio ="soloservicio";
                app.dialog.create({
                  title: 'Tipo de solicitud',
                  text: '¿Cómo desea solicitar el turno? <br> Solicitar ahora mismo <br> Ajustar hora del turno',

                  buttons: [
                    {
                      text: '<a href="/tikect/"> <button   onclick="TikectTurno('+ soloservicio +')" class="col button button-fill servi"  > Ahora mismo </button></a>',
                    },
                    {
                        text: '<a href="/ajustarhora/"> <button onclick="Servicio('+ soloservicio +')" class="col button button-fill servi"  >Ajustar hora </button></a>',
                    }
                  ],
                  verticalButtons: true,
                }).open();

        }else{

            for (var i = 0; i < data.length; i++) {
                
                TraerNameSubservicio(data);
            }
        }
        //
    });
}
function TraerNameSubservicio(IdServicio){
    
    app.request.post(urlServer + 'Read/TraerNameSubServicios', {IdServicio: IdServicio[0]},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        camposV = '<div class="servicios2 infinite-scroll-content">';
        for (var i = 0; i < data.length; i++) {
            camposV +=  ' <button  class="col button button-fill servi" onclick="preguntar('+IdServicio+')"  >' + data + '</button>' ;
        }
        camposV += '</div>';

        document.getElementById("divListaSubServicios").innerHTML = camposV;
    });
}
function TikectTurno(tipo){
    if(tipo == "soloservicio"){
        delete localStorage.IdSubServicio;
        
        IdEmpresa = localStorage.IdEmpresaServicio;
        IdSede = localStorage.IdSedeServicio;
        IdServicio = localStorage.IdServicio;
        IdUsuario = localStorage.IdUsuario;

        app.request.post(urlServer + 'Read/TraerTurno', {IdEmpresa: IdEmpresa,IdSede: IdSede, IdServicio: IdServicio, IdUsuario: IdUsuario},
        function (rsp) {
            //
            var data = JSON.parse(rsp);
 
            if (data != "No hay") {
                //
                

                Turno = data[0]['Turno'];
                Prioridad = data[0]['Prioridad'];
                idrelacionservicio = data[1]['idrelacionservicio'];
                Fecha = data[2]['Fecha'];
                Cedula = localStorage.CedulaUsuario;
                Nombre = localStorage.NombreUsuario;
                
                GuardarTikectTurno(IdEmpresa,IdSede,IdServicio,IdUsuario,idrelacionservicio,Turno,Prioridad,Fecha,Nombre,Cedula);

                var str = Fecha; 
                Fecha2 = str.substr(0, str.length-8);

                document.getElementById("divListaTikect").innerHTML = "<center><h1>Turno #</h1><h2>"+ Turno +"</h2><h4>Hora: Indefinida <br> Fecha: "+ Fecha2 +" <br>Nombre: "+ Nombre +" <br>Cédula: "+ Cedula +"</h4></center><div class='info'></div>";
            }else{
                
                app.dialog.alert('No Puede solicitar el turno', 'Atención');
            }
        });
    }else{
        IdEmpresa = localStorage.IdEmpresaServicio;
        IdSede = localStorage.IdSedeServicio;
        IdServicio = localStorage.IdServicio;
        IdSubServicio = localStorage.IdSubServicio;
        IdUsuario = localStorage.IdUsuario;

        app.request.post(urlServer + 'Read/TraerTurnoConSubservicio', {IdEmpresa: IdSede, IdServicio: IdServicio, IdSubServicio: IdSubServicio,IdUsuario: IdUsuario},
        function (rsp) {
            //
            var data = JSON.parse(rsp);
            
            if (data != "No hay") {
                //
                Turno = data[0]['Turno'];
                Prioridad = data[0]['Prioridad'];
                idrelacionservicio = data[1]['idrelacionservicio'];
                Fecha = data[2]['Fecha'];
                Cedula = localStorage.CedulaUsuario;
                Nombre = localStorage.NombreUsuario;

                GuardarTikectTurno(IdEmpresa,IdSede,IdSubServicio,IdUsuario,idrelacionservicio,Turno,Prioridad,Fecha,Nombre,Cedula);

                var str = Fecha; 
                Fecha2 = str.substr(0, str.length-8);
            
                document.getElementById("divListaTikect").innerHTML = "<center><h1>Turno #</h1><h2>"+ Turno +"</h2><h4>Hora: Indefinida <br> Fecha: "+ Fecha2 +" <br>Nombre: "+ Nombre +" <br>Cédula: "+ Cedula +"</h4></center><div class='info'></div>";
            }else{
                
                app.dialog.alert('No Puede solicitar el turno', 'Atención');
            }
        });
    }
}

function Servicio(direccionar){
    if(direccionar == "soloservicio"){
        TraerHoras();
        delete localStorage.IdSubServicio;
    }else{
        TraerHoras();
    }
}

function GuardarTikectTurno(IdEmpresa,IdSede,IdServicio,IdUsuario,idrelacionservicio,Turno,Prioridad,Fecha,Nombre,Cedula){

    app.request.post(urlServer + 'Read/GuardarTikectTurno', {IdEmpresa: IdEmpresa, IdSede: IdSede, IdServicio: IdServicio,IdUsuario: IdUsuario, idrelacionservicio: idrelacionservicio, Turno: Turno, Prioridad: Prioridad, Fecha: Fecha, Nombre: Nombre, Cedula: Cedula},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        
    });
}

function GuardarTikectTurnoConHora(Hora,IdEmpresa,IdSede,IdServicio,IdUsuario,idrelacionservicio,Turno,Prioridad,Fecha,Nombre,Cedula){

    app.request.post(urlServer + 'Read/GuardarTikectTurnoConHora', {Hora: Hora, IdEmpresa: IdEmpresa, IdSede: IdSede, IdServicio: IdServicio,IdUsuario: IdUsuario, idrelacionservicio: idrelacionservicio, Turno: Turno,Prioridad: Prioridad, Fecha:Fecha,Nombre:Nombre,Cedula:Cedula},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
    });
}
function TikectTurnoConHora(Hora){
    app.views.main.router.navigate('/tikect/');
    
    IdEmpresa = localStorage.IdEmpresaServicio;
    IdSede = localStorage.IdSedeServicio;
    IdServicio = localStorage.IdServicio;
    IdUsuario = localStorage.IdUsuario;
    Hora = Hora;
    
    IdSubServicio = localStorage.IdSubServicio;
    if (localStorage.IdSubServicio == undefined) {
        app.request.post(urlServer + 'Read/TraerTurno', {IdEmpresa: IdEmpresa, IdSede: IdSede, IdServicio: IdServicio, IdUsuario: IdUsuario},
        function (rsp) {
            //
            var data = JSON.parse(rsp);
            
            if (data != "No hay") {
                //
                Turno = data[0]['Turno'];
                Prioridad = data[0]['Prioridad'];
                idrelacionservicio = data[1]['idrelacionservicio'];
                Fecha = data[2]['Fecha'];
                Cedula = localStorage.CedulaUsuario;
                Nombre = localStorage.NombreUsuario;

                GuardarTikectTurnoConHora(Hora,IdEmpresa,IdSede,IdServicio,IdUsuario,idrelacionservicio,Turno,Prioridad,Fecha,Nombre,Cedula);
                
                
                var str = Fecha; 
                Fecha2 = str.substr(0, str.length-8);

                document.getElementById("divListaTikect").innerHTML = "<center><h1>Turno #</h1><h2>"+ Turno +"</h2><h4>Hora: "+ Hora +" <br> Fecha: "+ Fecha2 +" <br>Nombre: "+ Nombre +" <br>Cédula: "+ Cedula +"</h4></center><div class='info'></div>";
                
            }else{
               
                app.dialog.alert('No Puede solicitar el turno', 'Atención');
            }
        });
    }else{
        app.request.post(urlServer + 'Read/TraerTurnoConSubservicio', {IdEmpresa: IdSede, IdServicio: IdServicio, IdSubServicio: IdSubServicio,IdUsuario: IdUsuario},
        function (rsp) {
            //
            var data = JSON.parse(rsp);
            
            if (data != "No hay") {
                //
                Turno = data[0]['Turno'];
                Prioridad = data[0]['Prioridad'];
                idrelacionservicio = data[1]['idrelacionservicio'];
                Fecha = data[2]['Fecha'];
                Cedula = localStorage.CedulaUsuario;
                Nombre = localStorage.NombreUsuario;

                GuardarTikectTurnoConHora(Hora,IdEmpresa,IdSede,IdSubServicio,IdUsuario,idrelacionservicio,Turno,Prioridad,Fecha,Nombre,Cedula);

                var str = Fecha; 
                Fecha2 = str.substr(0, str.length-8);
                document.getElementById("divListaTikect").innerHTML = "<center><h1>Turno #</h1><h2>"+ Turno +"</h2><h4>Hora: "+ Hora +" <br> Fecha: "+ Fecha2 +" <br>Nombre: "+ Nombre +" <br>Cédula: "+ Cedula +"</h4></center><div class='info'></div>";
            }else{
            
                app.dialog.alert('No Puede solicitar el turno', 'Atención');
            }
        });
    }
}

function preguntar(IdServicio){
    localStorage.IdSubServicio = IdServicio;
    subservicio ="subservicio";
        app.dialog.create({
            title: 'Tipo de solicitud',
            text: '¿Cómo desea solicitar el turno? <br> Solicitar ahora mismo <br> Ajustar hora del turno',

            buttons: [
            {
                text: '<a href="/tikect/"> <button   onclick="TikectTurno('+ subservicio +')" class="col button button-fill servi"  > Ahora mismo </button></a>',
            },
            {
                text: '<a href="/ajustarhora/"> <button onclick="Servicio('+ subservicio +')" class="col button button-fill servi"  >Ajustar hora </button></a>',
            }
            ],
            verticalButtons: true,
        }).open();
}

function CargarTablaEmpresas(){
    app.preloader.show();
    app.request.post(urlServer + 'Read/CargarEmpresasSelecionadas', {IdUsuario: localStorage.IdUsuario},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        

        if(data === "No tiene empresa seleccionadas"){
            camposV = '<tr >';
            camposV +=  '<th class="label-cell">No tiene empresa seleccionadas </th>' ;
            camposV +=  '<th class="label-cell">No tiene sede seleccionadas </th>' ;
            camposV += '</tr>';
            document.getElementById("tablaempresas").innerHTML = camposV;
            app.preloader.hide();
        }else{
            //
            for (var i = 0; i < data.length; i++) {
                camposV = '<tr >';
                for (var i = 0; i < data.length; i++) {
    
                    camposV +=  '<th class="label-cell"> ' + data[i]['NombreEmpresa'] + ' </th>' ;
                    camposV +=  '<th class="label-cell"> ' + data[i]['Nombre'] + ' </th>' ;
                    camposV += '</tr>';
                }
                document.getElementById("tablaempresas").innerHTML = camposV;
            }
            app.preloader.hide();
        }
    });
}
//
function CargarSelectEmpresas(){
    app.request.post(urlServer + 'Read/CargarTablaEmpresas', {IdUsuario: localStorage.IdUsuario},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        for (var i = 0; i < data.length; i++) {

            camposV = '';
            camposV += '<option value="">Seleccionar</option>' ;
                for (var i = 0; i < data.length; i++) {

                    camposV += '<option value="' + data[i]['emp_id'] + '">' + data[i]['NombreEmpresa'] + '</option>' ;
                }
                
                $$('#EntidadNueva').html(camposV);
        }
    });
}

function CargarSelectSedes(){
    
    app.request.post(urlServer + 'Read/CargarSelectSedes', {IdEmpresa: $$('#EntidadNueva').val()},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        if (data != "No hay sedes Registradas") {
            //

            camposV = '';
                for (var i = 0; i < data.length; i++) {

                    camposV += '<option   value="' + data[i]['ID'] + '" >' + data[i]['Nombre'] + '</option>' ;
                }
                $$('#NuevaSede').html(camposV);
        }else{
            for (var i = 0; i < data.length; i++) {
                camposV = '';
                for (var i = 0; i < data.length; i++) {
    
                    camposV += '<option value="" >No hay sedes Registradas</option>' ;
                }
                document.getElementById("NuevaSede").innerHTML = camposV;
            }
        }
    });
}

// if (localStorage.inicio == 1) {
//     app.dialog.create({
//         title: 'Bienvenido!',
//         text: '',
//         buttons: [
//         {
//             text: '<button class="col button button-fill link popup-close" onclick="CargarSelectEmpresasTurno()">Aceptar</button>'
//         }
//         ],
//         verticalButtons: true,
//     }).open();

//     localStorage.inicio = 0;
// }else{

// }

function CargarSelectEmpresasTurno(){
   
    IdUsuario = localStorage.IdUsuario;
    app.request.post(urlServer + 'Read/CargarEmpresasSelecionadasTurno', {IdUsuario: IdUsuario},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        if(data == "No tiene empresa seleccionadas"){
            camposV += '<option value="" >No tiene empresas registradas</option>' ;
            document.getElementById("enti").innerHTML = camposV;
        }else{
            // 


                
                camposV = '';
                camposV = '<option value="" selected disabled>Seleccionar</option>' ;
                for (var i = 0; i < data.length; i++) {

                    camposV += '<option value="' + data[i]['emp_id'] + '">' + data[i]['NombreEmpresa'] + '</option>' ;
                }

                $$('#enti').html(camposV);
            
        }
    });
}

function CargarSelectSedesTurno(){
    app.request.post(urlServer + 'Read/CargarSelectSedesTurno', {IdEmpresa: $$('#enti').val(), IdUsuario: localStorage.IdUsuario},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        if(data == "No tiene sedes registradas"){
            camposV += '<option value="" >No tiene sedes registradas</option>' ;
            document.getElementById("sede").innerHTML = camposV;
        }else{
            //
            // for (var i = 0; i < data.length; i++) {
            //     camposV = '';
            //     for (var i = 0; i < data.length; i++) {

            //         camposV += '<option value="' + data[i]['ID'] + '" >' + data[i]['Nombre'] + '</option>' ;
            //     }
            //     document.getElementById("sede").innerHTML = camposV;
            // }

            camposV = '';
                for (var i = 0; i < data.length; i++) {

                    camposV += '<option   value="' + data[i]['ID'] + '" >' + data[i]['Nombre'] + '</option>' ;
                }
                $$('#sede').html(camposV);

        }
    });
}

function AgregarEntidad(EntidadNueva,NuevaSede){
    app.request.post(urlServer + 'Read/AgregarEntidad', {IdUsuario: localStorage.IdUsuario, IdEmpresa: EntidadNueva, NuevaSede: NuevaSede},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        if(data == "Hecho"){
            app.dialog.create({
                title: 'Agregada Correctamente!',
                text: '',
                buttons: [
                {
                    text: '<button class="col button button-fill link popup-close" onclick="CargarTablaEmpresas()">Aceptar</button>'
                }
                ],
                verticalButtons: true,
            }).open();
        }else{
           
            app.dialog.alert(data, 'Atención');
        }
    });
}

function TraerEmpresas(){

    app.request.post(urlServer + 'Read/TraerEmpresas',
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        if(data == "No hay empresas"){
            camposV += '<option value="" >No tiene empresas registradas</option>' ;
            document.getElementById("empresas_registro").innerHTML = camposV;
        }else{
            // 
            //for (var i = 0; i < data.length; i++) {
                camposV = '';
                camposV += '<option value="">Seleccionar</option>' ;
                for (var i = 0; i < data.length; i++) {

                    camposV += '<option value="' + data[i]['emp_id'] + '">' + data[i]['NombreEmpresa'] + '</option>' ;
                }
                //TraerSede(data[0]['emp_id']);
                $$('#empresas_registro').html(camposV);
                //document.getElementById("empresas_registro").innerHTML = camposV;
           // }
        }
    });
}
//donde esta el read ? 
function TraerSede(){

  
    app.request.post(urlServer + 'Read/TraerSedes', {IdEmpresa: $$('#empresas_registro').val()},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        if(data == "No hay sedes"){
            camposV += '<option value="" >No tiene sedes registradas</option>' ;
            document.getElementById("sedes_registro").innerHTML = camposV;
        }else{
            // 
           // for (var i = 0; i < data.length; i++) {
                camposV = '';
                for (var i = 0; i < data.length; i++) {

                    camposV += '<option   value="' + data[i]['ID'] + '" >' + data[i]['Nombre'] + '</option>' ;
                }
                $$('#sedes_registro').html(camposV);
                //document.getElementById("sedes_registro").innerHTML = camposV;
            //}
        }
    });

}

function CargarTablaTurnos(){
    app.preloader.show();
    app.request.post(urlServer + 'Read/CargarTablaHistorial', {IdUsuario: localStorage.IdUsuario},
    function (rsp) {
        //
        var data = JSON.parse(rsp);
        //
        
        if(data != 2){

            for (var i = 0; i < data.length; i++) {
                camposV = '<tr >';
                for (var i = 0; i < data.length; i++) {
    
                    camposV +=  '<th class="label-cell"> ' + data[i]['Turno'] + ' </th>' ;
                    camposV +=  '<th class="label-cell"> ' + data[i]['FechaLlegada'] + ' </th>' ;
                    camposV +=  '<th class="label-cell"> ' + data[i]['Nombre'] + ' </th>' ;
                    camposV += '</tr>';
                }
                document.getElementById("tablahistorial").innerHTML = camposV;
            }
            app.preloader.hide();
        }else{
            camposV = '<tr >';
            camposV +=  '<th class="label-cell"></th>' ;
            camposV +=  '<th class="label-cell">  No hay Historial para mostrar</th>' ;
            camposV +=  '<th class="label-cell">  </th>' ;
            camposV += '</tr>';
            document.getElementById("tablahistorial").innerHTML = camposV;
            app.preloader.hide();
        }
    });
}

function cerrarSesion(){
    var x = document.getElementById("myDIV");

    x.style.display = "none";
    delete localStorage.IdServicio;
    delete localStorage.IdSubServicio;
    delete localStorage.IdSedeServicio;
    delete localStorage.IdEmpresaServicio;
    delete localStorage.IdUsuario;
    delete localStorage.NombreUsuario;
    delete localStorage.CedulaUsuario;
    delete localStorage.hora;

    app.views.main.router.navigate('/home/');

    //location.href ="index.html";
}