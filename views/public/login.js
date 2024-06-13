const login = document.getElementById('loginForm');
const cadastro = document.getElementById('cadastroForm');
const aplicacao = document.getElementById('aplicacao');
const localizarErro = document.getElementById('localErro');
let user = Object;


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
    if(typeof user.lat == 'undefined'){
        localErro();
        
    } else {
        mudarLogin();
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
            liberarEntrada();
            //window.location.href = 'index.html'; // Redireciona para a página de cadastro de alunos
        })
        .catch((error) => {
            console.error('Erro ao fazer login: ', error.message);
            alert('Falha ao entrar: ' + error.message);
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

//função para mudar para a tela de cadastro
function mudarCadastro() {
    login.style.display = "none";
    cadastro.style.display = "flex";
}

//função para mudar para a tela de login
function mudarLogin() {
    login.style.display = "flex";
    cadastro.style.display = "none";
    localizarErro.style.display = "none";
}

//função para liberar a entrada
function liberarEntrada() {
    login.style.display = "none";
    cadastro.style.display = "none";
    aplicacao.style.display = "block";
}

//função para bloquear a aplicação caso a localização não esteja habilitada.
function localErro() {
    login.style.display = "none";
    cadastro.style.display = "none";
    aplicacao.style.display = "none";
    localizarErro.style.display = "block";
}

localizarUsuario();
setTimeout(checarLocal,100);