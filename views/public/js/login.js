const login = document.getElementById('loginForm');
const cadastro = document.getElementById('cadastroForm');
const aplicacao = document.getElementById('mainFrame');
const localizarErro = document.getElementById('localErro');
const loginFrame = document.getElementById('loginFrame');
const modal = document.getElementById('modal');
const modalTexto = document.getElementById('modalTexto');
const modalImagem = document.getElementById('modalImagem');
const fecharModal = document.getElementsByClassName("fecharModal")[0];
const botaoMarcar = document.getElementById('marcar');
const marcarContent = document.getElementById('marcarContent');
const botaoVisualizar = document.getElementById('visualizar');
const visualizarContent = document.getElementById('visualizarContent');
const mapController = document.getElementById('map');
let intervalo = setInterval(atualizarHora, 500);;
let visualizarAberto = false;
let marcarAberto = false;
let user = Object;
let map = L.map('map');
let marker;

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//função para definir cookies.
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
}

//função para receber o valor de cookies.
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


//função utilizada para receber a geolocalização;
function localizarUsuario() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(guardarLocalizacao);
    } else {
        localErro();
        document.getElementById('erroDescricao').innerHTML = "Infelizmente seu dispositivo ou navegador não suporta geolocalização.";
        document.getElementById('erroBotao').style.display = "none";
    }
}

//função utilizada para armazenar a geolocalização em uma variável.
function guardarLocalizacao(pos) {
    user.lat = pos.coords.latitude;
    user.lon = pos.coords.longitude;
}

function checarLocal() {
    if (typeof user.lat == 'undefined') {
        localErro();

    } else {
        if (getCookie('uid') != '') {
            mudarLogin();
            liberarEntrada();
        } else {
            mudarLogin();
        }

    }
}

function encerrarSessao() {
    setCookie('uid', '');
    user = null;
    location.reload();
}

//função para mudar para a tela de cadastro
function mudarCadastro() {
    login.style.display = "none";
    loginFrame.style.display = "block";
    cadastro.style.display = "flex";
}

//função para mudar para a tela de login
function mudarLogin() {
    login.style.display = "flex";
    loginFrame.style.display = "block";
    cadastro.style.display = "none";
    localizarErro.style.display = "none";
}

//função para liberar a entrada
function liberarEntrada() {
    aplicacao.style.display = "block";
    loginFrame.style.display = "none";
}

//função para bloquear a aplicação caso a localização não esteja habilitada.
function localErro() {
    login.style.display = "none";
    cadastro.style.display = "none";
    aplicacao.style.display = "none";
    loginFrame.style.display = "none";
    localizarErro.style.display = "block";
}

function visualizarLocalizacao(latitude, longitude) {
    modal.style.display = "block";
    modalTexto.innerHTML = `Latitude: ${latitude}; Longitude: ${longitude}`;
    mapController.style.display = "block";
    map.setView([latitude, longitude], 16);
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
        .then((response) => response.json())
        .then((json) => {
            marker = new L.marker([latitude, longitude]);
            map.addLayer(marker);
            marker.bindPopup(`${json.address.road}, ${json.address.city}, ${json.address.state}, ${json.address.postcode}`).openPopup();
            console.log(json.address);

        });
}

function visualizarImagem(src) {
    modal.style.display = "block";
    modalTexto.innerHTML = ``;
    modalImagem.src = src;
    modalImagem.style.display = "inline-block";
    modalImagem.style.height = "400px";
    modalImagem.style.width = "400px";
}

function atualizarHora() {
    horaAtual = new Date();
    let horas;
    let minutos;
    let segundos;
    let dia;
    let mes;
    if (horaAtual.getHours() < 10) {
        horas = `0${horaAtual.getHours()}`;
    } else {
        horas = horaAtual.getHours();
    }

    if (horaAtual.getMinutes() < 10) {
        minutos = `0${horaAtual.getMinutes()}`;
    } else {
        minutos = horaAtual.getMinutes();
    }

    if (horaAtual.getSeconds() < 10) {
        segundos = `0${horaAtual.getSeconds()}`;
    } else {
        segundos = horaAtual.getSeconds();
    }

    if (horaAtual.getDate() < 10) {
        dia = `0${horaAtual.getDate()}`;
    } else {
        dia = horaAtual.getDate();
    }

    if ((horaAtual.getMonth() + 1) < 10) {
        mes = `0${horaAtual.getMonth() + 1}`;
    } else {
        mes = horaAtual.getMonth() + 1;
    }
    document.getElementById('hora').innerHTML = dia + "/" + mes + "/" + horaAtual.getFullYear() + " - " + horas + ":" + minutos + ":" + segundos;
}

fecharModal.onclick = function () {
    modal.style.display = "none";
    mapController.style.display = "none";
    modalImagem.style.display = "none";
    try {
        map.removeLayer(marker)
    } catch (error) {}

}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        mapController.style.display = "none";
        modalImagem.style.display = "none";
        try {
            map.removeLayer(marker)
        } catch (error) {}
    }
}

botaoMarcar.onclick = function () {
    if (!marcarAberto) {
        marcarAberto = true;
        botaoVisualizar.style.display = "none";
        botaoMarcar.innerHTML = "Voltar ao menu principal";
        marcarContent.style.display = "flex";

    } else {
        marcarAberto = false;
        botaoVisualizar.style.display = "block";
        botaoMarcar.innerHTML = "Marcar ponto";
        marcarContent.style.display = "none";
    }
}

botaoVisualizar.onclick = function () {
    if (!visualizarAberto) {
        visualizarAberto = true;
        botaoMarcar.style.display = "none";
        botaoVisualizar.innerHTML = "Voltar ao menu principal";
        visualizarContent.style.display = "flex";
    } else {
        visualizarAberto = false;
        botaoMarcar.style.display = "block";
        botaoVisualizar.innerHTML = "Visualizar marcações";
        visualizarContent.style.display = "none";
    }
}

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login bem-sucedido
            user = userCredential;
            setCookie('uid', user.user.uid);
            location.reload();
        })
        .catch((error) => {
            modal.style.display = "block";
            modalTexto.innerHTML = 'Erro ao fazer login:<br>E-mail/Senha inválidos.';
        });
});

document.getElementById('cadastroForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('emailCadastro').value;
    const password = document.getElementById('passwordCadastro').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login bem-sucedido
            console.log('userCredential')

        })
        .catch((error) => {
            console.error('Erro ao fazer cadastro: ', error.message);
            alert('Falha ao cadastrar: ' + error.message);
        });
});

if (getCookie('uid') != '') {
    liberarEntrada();
    user.uid = getCookie('uid');
}

localizarUsuario();
setTimeout(checarLocal, 100);