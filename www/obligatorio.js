// Sector de Constantes

const menu = document.querySelector("#menu");
const ruteo = document.querySelector("#router");

const pantallaHome = document.querySelector("#pantalla-home");
const pantallaLogin = document.querySelector("#pantalla-login");
const pantallaRegistrarU = document.querySelector("#pantalla-registrarU");
const pantallaListado = document.querySelector("#pantalla-listado");
const pantallaRegistrarJugadores = document.querySelector("#pantalla-registrarJugadores");
const pantallaEstadistica = document.querySelector("#pantalla-estadistica");
const pantallaMapa = document.querySelector("#pantalla-mapa");


const urlBase = "https://worldcupfan.develotion.com";

//lista para guardar los países
let listaPaises = [];

let listaPosiciones = [];
let listaSelecciones = [];

inicio();

function inicio() {

    obtenerPaises();


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
    document.querySelector("#btnRegistrarJugador").addEventListener("click", previaAnalizarSentimiento);
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

    }

    if (evento.detail.to == "/listado") {
        pantallaListado.style.display = "block";
    }

    if (evento.detail.to == "/registrarJugadores") {
        pantallaRegistrarJugadores.style.display = "block";
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
    pantallaRegistrarJugadores.style.display = "none";
    pantallaEstadistica.style.display = "none";
    pantallaMapa.style.display = "none";
}

function ocultarTodoMenu() {
    document.querySelector("#btnMenuRegistrarUsuario").style.display = "none";
    document.querySelector("#btnMenuLogin").style.display = "none";
    document.querySelector("#btnMenuLogout").style.display = "none";
    document.querySelector("#btnMenuListado").style.display = "none";
    document.querySelector("#btnMenuRegistrarJugadores").style.display = "none";
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
    document.querySelector("#btnMenuRegistrarJugadores").style.display = "block";
    document.querySelector("#btnMenuEstadistica").style.display = "block";
    document.querySelector("#btnMenuMapa").style.display = "block";

    obtenerPosiciones();
    obtenerSelecciones();
}

function cerrarMenu() {
    menu.close();
}

// Levantar la informacion y armarme lo necesario para que despues ejecute la peticion con exito

//esto va a capturar los datos y se va a armar el objeto
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
            if (informacion.codigo >= 200 && informacion.codigo < 300) {




                localStorage.setItem("token", informacion.token);
                localStorage.setItem("usuario", usuarioLogin.usuario); // NO OBLIGATORIO

                mostrarMenuVip();



                ocultarTodasPantallas();
                pantallaHome.style.display = "block";

                document.querySelector("#lblMensajeLogin").innerHTML = "";

                mostrarBienvenida(); // NO OBLIGATORIO
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

// Cuando el usuario toca el botón Registrar los datos se capturan en el registro
// Se ingresa usuario, contraseña y país de residencia

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

// hacer el POST y enviar el registro al endpoint /usuarios

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

            if (informacion.codigo >= 200 && informacion.codigo < 300) {

                // guardar token
                localStorage.setItem("token", informacion.token);
                localStorage.setItem("usuario", nuevoUsuario.usuario);


                mostrarBienvenida(); // no obligatorio


                // cambiar menú
                mostrarMenuVip();

                // volver al inicio
                ocultarTodasPantallas();
                pantallaHome.style.display = "block";

                // limpiar mensaje
                document.querySelector("#lblMensajeRegistro").innerHTML = "";

                // Toast de éxito
                mostrarMensaje(
                    "SUCCESS",
                    "Registro exitoso",
                    "El usuario fue registrado correctamente."
                );

            }
            else {

                // Mostrar el error en la interfaz (esto lo voy a borrar despues dale)
                document.querySelector("#lblMensajeRegistro").innerHTML =
                    informacion.mensaje;

                // Toast de error
                mostrarMensaje(
                    "ERROR",
                    "Error",
                    informacion.mensaje
                );

            }

        })
        .catch(function (error) {

            console.log(error);

            mostrarMensaje(
                "ERROR",
                "Error de conexion",
                "No fue posible comunicarse con el servidor."
            );

        });

}

function mostrarMensaje(tipo, titulo, texto, duracion) {

    const toast = document.createElement("ion-toast");

    toast.header = titulo;
    toast.message = texto;

    if (!duracion) {
        duracion = 2000;
    }

    toast.duration = duracion;

    if (tipo === "ERROR") {
        toast.color = "danger";
        toast.icon = "alert-circle-outline";
    }
    else if (tipo === "WARNING") {
        toast.color = "warning";
        toast.icon = "warning-outline";
    }
    else if (tipo === "SUCCESS") {
        toast.color = "success";
        toast.icon = "checkmark-circle-outline";
    }

    document.body.appendChild(toast);
    toast.present();
}

//  ---------------------------------------------------- REGISTRAR JUGADORES ----------------------------------------------------

// Obtiene las posiciones disponibles desde la API

function obtenerPosiciones() {

    fetch(`${urlBase}/posiciones`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // esto envia el token del usuario logueado
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (informacion) {

            console.log(informacion);

            listaPosiciones = informacion.posiciones; // guarda las posiciones recibidas

            cargarPosiciones(); // carga las opciones en el select

        })
        .catch(function (error) {

            console.log(error);

        });

}

// para cargar las posiciones en el ion-select
function cargarPosiciones() {

    let opciones = "";

    for (let posicion of listaPosiciones) {

        opciones += `
            <ion-select-option value="${posicion.id}">
                ${posicion.nombre}
            </ion-select-option>
        `;

    }

    document.querySelector("#slcPosicion").innerHTML = opciones;

}

function obtenerSelecciones() {

    fetch(`${urlBase}/selecciones`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}` // envia la autorización
        }
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (informacion) {

            console.log(informacion);

            listaSelecciones = informacion.selecciones; // guarda las selecciones

            cargarSelecciones(); // y carga el select

        })
        .catch(function (error) {

            console.log(error);

        });

}


// Carga las selecciones en el ion-select
function cargarSelecciones() {

    let opciones = "";

    for (let seleccion of listaSelecciones) {

        opciones += `
            <ion-select-option value="${seleccion.id}">
                ${seleccion.emoji} ${seleccion.nombre}
            </ion-select-option>
        `;

    }

    document.querySelector("#slcSeleccion").innerHTML = opciones;

}

// Analisis de Sentimiento

// captura el comentario y prepara el analisis de sentimiento
function previaAnalizarSentimiento() {

    let comentario = document.querySelector("#txtComentarioJugador").value;

    let sentimiento = {};

    sentimiento.prompt = comentario; // texto que analiza la IA

    analizarSentimiento(sentimiento);

}

// envia el comentario a la ia para poder clasificarlo
function analizarSentimiento(sentimiento) {

    fetch(`${urlBase}/genai`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(sentimiento)
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (informacion) {

            console.log(informacion);

            if (informacion.score > 0) {

                previaRegistrarJugador(); // continua con el registro

            }
            else {

                mostrarMensaje(
                    "ERROR",
                    "Comentario negativo",
                    "No se puede registrar el jugador."
                );

            }

        })
        .catch(function (error) {

            console.log(error);

        });

}

// captura los datos del formulario y arma el objeto jugador
function previaRegistrarJugador() {

    let nombre = document.querySelector("#txtNombreJugador").value;
    let idSeleccion = document.querySelector("#slcSeleccion").value;
    let idPosicion = document.querySelector("#slcPosicion").value;
    let fechaNacimiento = document.querySelector("#txtFechaNacimiento").value;

    let nuevoJugador = {};

    nuevoJugador.nombre = nombre;
    nuevoJugador.idSeleccion = Number(idSeleccion);
    nuevoJugador.posicion = Number(idPosicion);
    nuevoJugador.fechaNacimiento = fechaNacimiento;

    registrarJugador(nuevoJugador);

}


// envia el jugador a la api
function registrarJugador(nuevoJugador) {

    console.log(nuevoJugador); // esto se puede borrar, es para verificar los datos enviados

    fetch(`${urlBase}/jugadores`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(nuevoJugador) // enviar el jugador
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (informacion) {

            console.log(informacion);

            if (informacion.codigo >= 200 && informacion.codigo < 300) {

                mostrarMensaje(
                    "SUCCESS",
                    "Éxito",
                    "Jugador registrado correctamente.",
                    3000
                );

                ocultarTodasPantallas();
                pantallaHome.style.display = "block";

            }
            else {

                mostrarMensaje(
                    "ERROR",
                    "Error",
                    informacion.mensaje,
                    3000
                );

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