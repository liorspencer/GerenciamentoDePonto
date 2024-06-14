const login = document.getElementById('loginForm');
const cadastro = document.getElementById('cadastroForm');
const aplicacao = document.getElementById('mainFrame');
const localizarErro = document.getElementById('localErro');
const loginFrame = document.getElementById('loginFrame');
const modal = document.getElementById('modalErro');
const modalTexto = document.getElementById('modalTexto')
const fecharModal = document.getElementsByClassName("fecharModal")[0];
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
        if(getCookie('uid')!=''){
            mudarLogin();
            liberarEntrada();
        }else{
            mudarLogin();
        }
        
    }
}

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
    aplicacao.style.display = "block";
    loginFrame.style.display = "none";
}

//função para bloquear a aplicação caso a localização não esteja habilitada.
function localErro() {
    login.style.display = "none";
    cadastro.style.display = "none";
    aplicacao.style.display = "none";
    localizarErro.style.display = "block";
}

fecharModal.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
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
            setCookie('uid',user.user.uid);
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

if (getCookie('uid')!=''){
    liberarEntrada();
}

localizarUsuario();
setTimeout(checarLocal,100);