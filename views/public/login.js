const login = document.getElementById('loginForm');
const cadastro = document.getElementById('cadastroForm');
Cookies.set = ('teste','1');
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('emailLogin').value;
    const password = document.getElementById('passwordLogin').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login bem-sucedido
            console.log(userCredential)
            //window.location.href = 'index.html'; // Redireciona para a página de cadastro de alunos
        })
        .catch((error) => {
            console.error('Erro ao fazer login: ', error.message);
            alert('Falha ao entrar: ' + error.message);
        });
});
document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('emailCadastro').value;
    const password = document.getElementById('passwordCadastro').value;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login bem-sucedido
            console.log('userCredential')
            window.location.href = 'index.html'; // Redireciona para a página de cadastro de alunos
        })
        .catch((error) => {
            console.error('Erro ao fazer cadastro: ', error.message);
            alert('Falha ao cadastrar: ' + error.message);
        });
});
function mudarCadastro(){
    login.style.display = "none"
    cadastro.style.display = "flex"
    titulo.innerHTML = "Cadastro"
}

function mudarLogin(){
    login.style.display = "flex"
    cadastro.style.display = "none"
    titulo.innerHTML = "Login"
}