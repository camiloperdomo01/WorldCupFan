// Sector de Constantes

const menu = document.querySelector("#menu");
const ruteo = document.querySelector("#router");

const pantallaHome = document.querySelector("#pantalla-home");
const pantallaLogin = document.querySelector("#pantalla-login");
const pantallaRegistrarU = document.querySelector("#pantalla-registrarU");
const pantallaListado = document.querySelector("#pantalla-listado");
const pantallaRendimiento = document.querySelector("#pantalla-rendimiento");
const pantallaEstadistica = document.querySelector("#pantalla-estadistica");
const pantallaMapa = document.querySelector("#pantalla-mapa");


const urlBase = "https://worldcupfan.develotion.com";

//lista para guardar los países
let listaPaises = [];

inicio();

function inicio() {

    // obtenerPaises();


    // cuando el usuario vuelva a abrir la aplicación, ya entra como logueado.
    if (localStorage.getItem("token") != null) {

        mostrarMenuVip();

        ocultarTodasPantallas();
        pantallaHome.style.display = "block";

        mostrarBienvenida(); // NO OBLIGATORIO
    }
    else {

        mostrarMenuAnonimo();

    }

    ruteo.addEventListener("ionRouteDidChange", navegar);

    document.querySelector("#btnLogin").addEventListener("click", previaHacerLogin);
    document.querySelector("#btnMenuLogout").addEventListener("click", hacerLogout);
    document.querySelector("#btnRegistrar").addEventListener("click", previaRegistrarUsuario);
}

function navegar(evento) {
    ocultarTodasPantallas();

    if (evento.detail.to == "/") {
        pantallaHome.style.display = "block";
    }

    if (evento.detail.to == "/login") {
        pantallaLogin.style.display = "block";
    }

    if (evento.detail.to == "/registrarU") {
        pantallaRegistrarU.style.display = "block";

        if (listaPaises.length == 0) {
            // Se pone aca asi los países se cargan cuando realmente se necesitan y se evita hacer una petición al iniciar la aplicación si el usuario nunca va a registrarse
            obtenerPaises(); // Cada vez que el usuario entra a la pantalla de registro se llama a obtenerPaises
        }
    }

    if (evento.detail.to == "/listado") {
        pantallaListado.style.display = "block";
    }

    if (evento.detail.to == "/rendimiento") {
        pantallaRendimiento.style.display = "block";
    }

    if (evento.detail.to == "/estadistica") {
        pantallaEstadistica.style.display = "block";
    }

    if (evento.detail.to == "/mapa") {
        pantallaMapa.style.display = "block";
    }
}


function ocultarTodasPantallas() {
    pantallaHome.style.display = "none";
    pantallaLogin.style.display = "none";
    pantallaRegistrarU.style.display = "none";
    pantallaListado.style.display = "none";
    pantallaRendimiento.style.display = "none";
    pantallaEstadistica.style.display = "none";
    pantallaMapa.style.display = "none";
}

function ocultarTodoMenu() {
    document.querySelector("#btnMenuRegistrarUsuario").style.display = "none";
    document.querySelector("#btnMenuLogin").style.display = "none";
    document.querySelector("#btnMenuLogout").style.display = "none";
    document.querySelector("#btnMenuListado").style.display = "none";
    document.querySelector("#btnMenuRegistrarRendimiento").style.display = "none";
    document.querySelector("#btnMenuEstadistica").style.display = "none";
    document.querySelector("#btnMenuMapa").style.display = "none";
}

function mostrarMenuAnonimo() {
    ocultarTodoMenu();
    document.querySelector("#btnMenuRegistrarUsuario").style.display = "block";
    document.querySelector("#btnMenuLogin").style.display = "block";
}

function mostrarMenuVip() {
    ocultarTodoMenu();
    document.querySelector("#btnMenuLogout").style.display = "block";
    document.querySelector("#btnMenuListado").style.display = "block";
    document.querySelector("#btnMenuRegistrarRendimiento").style.display = "block";
    document.querySelector("#btnMenuEstadistica").style.display = "block";
    document.querySelector("#btnMenuMapa").style.display = "block";
}

function cerrarMenu() {
    menu.close();
}

// Levantar la informacion y armarme lo necesario para que despues ejecute la peticion con exito

//Funcion que va a capturar los datos y se va a armar el objeto
function previaHacerLogin() {
    const usuario = document.querySelector("#txtUsuarioLogin").value;
    const password = document.querySelector("#txtPasswordLogin").value;

    // creo el objeto
    // ojo que los campos tienen que ser iguales a los de la documentacion
    // 
    let usuarioLogin = new Object();
    usuarioLogin.usuario = usuario;
    usuarioLogin.password = password;



    hacerLogin(usuarioLogin)
}

function hacerLogin(usuarioLogin) {
    fetch(`${urlBase}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioLogin) // El objeto es lo que recibe por parametro
    })
        .then(function (response) {
            console.log(response)
            return response.json()
        })
        .then(function (informacion) {
            if (informacion.codigo == 200) {

                ocultarTodasPantallas();

                pantallaHome.style.display = "block";

                mostrarMenuVip();

                localStorage.setItem("token", informacion.token);
                localStorage.setItem("usuario", usuarioLogin.usuario); // NO OBLIGATORIO

                mostrarBienvenida(); // NO OBLIGATORIO

                document.querySelector("#lblMensajeLogin").innerHTML = "";

            }
            else {
                // agregue un caso de error
                document.querySelector("#lblMensajeLogin").innerHTML =
                    informacion.mensaje;

            }




        })
        .catch(function (error) {
            console.log(error)
        })
}

function hacerLogout() {
    //ocultar todas las pantallas
    ocultarTodasPantallas();
    //mostrar pantalla home
    pantallaHome.style.display = "block";
    //mostrar menu anonimo
    mostrarMenuAnonimo();
    //borrar el token del local storage
    localStorage.removeItem("token");
    localStorage.removeItem("usuario"); // NO OBLIGATORIO

    mostrarBienvenida(); // NO OBLIGATORIO
}

// Funciones de países

function obtenerPaises() {

    fetch(`${urlBase}/paises`)

        .then(function (response) {
            return response.json();
        })

        .then(function (informacion) {

            listaPaises = informacion.paises;

            cargarPaises();

        })

        .catch(function (error) {

            console.log(error);

        });

}

function cargarPaises() {

    let opciones = "";

    for (let pais of listaPaises) {

        opciones += `
            <ion-select-option value="${pais.id}">
                ${pais.nombre}
            </ion-select-option>
        `;

    }

    document.querySelector("#slcPais").innerHTML = opciones;

}

// Cuando el usuario toca el botón Registrar los datos se captura el registro. Se ingresará usuario, contraseña y país de residencia

function previaRegistrarUsuario() {

    let usuario = document.querySelector("#txtUsuarioRegistro").value;

    let password = document.querySelector("#txtPasswordRegistro").value;

    let idPais = document.querySelector("#slcPais").value;

    let nuevoUsuario = {};

    nuevoUsuario.usuario = usuario;
    nuevoUsuario.password = password;
    nuevoUsuario.idPais = Number(idPais);

    registrarUsuario(nuevoUsuario);

}

// hacer el POST y enviar el registro suponiendo que el endpoint sea /usuarios

function registrarUsuario(nuevoUsuario) {

    fetch(`${urlBase}/usuarios`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoUsuario)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (informacion) {

            console.log(informacion);

            // auto-login.

            if (informacion.codigo == 200) {

                // guardar token
                localStorage.setItem("token", informacion.token);
                localStorage.setItem("usuario", nuevoUsuario.usuario); // NO OBLIGATORIO

                // cambiar menú
                mostrarMenuVip();

                // volver al inicio
                ocultarTodasPantallas();
                pantallaHome.style.display = "block";

                // limpiar mensaje
                document.querySelector("#lblMensajeRegistro").innerHTML = "";

            }
            else {

                document.querySelector("#lblMensajeRegistro").innerHTML =
                    informacion.mensaje;

            }

        })
        .catch(function (error) {
            console.log(error);
        });

}



// NO OBLIGATORIO

function mostrarBienvenida() {

    let usuario = localStorage.getItem("usuario");

    if (usuario != null) {

        document.querySelector("#lblBienvenida").innerHTML =
            "Bienvenido " + usuario + " a World Cup Fan";

    }
    else {

        document.querySelector("#lblBienvenida").innerHTML =
            "Bienvenido al sitio de World Cup Fan";

    }

}