// Configure o Firebase com suas credenciais
const firebaseConfig = {
    apiKey: "AIzaSyB2isxLBvIa7sBel74086yXDuB_jupO6SA",
    authDomain: "liorspencer-lspec.firebaseapp.com",
    databaseURL: "https://liorspencer-lspec-default-rtdb.firebaseio.com",
    projectId: "liorspencer-lspec",
    storageBucket: "liorspencer-lspec.appspot.com",
    messagingSenderId: "97100777465",
    appId: "1:97100777465:web:f573661064ea78f2525f28"
};

firebase.initializeApp(firebaseConfig); // Inicialize o Firebase

const database = firebase.database(); // Inicialize o banco de dados
const storage = firebase.storage(); // Inicialize o storage

// Função para enviar dados para o Firebase
function enviarDadosParaFirebase() {
    const uid = user.uid;
    const data = dataAtual();
    const nome = document.getElementById('nome').value;
    const latitude = user.lat;
    const longitude = user.lon;
    let imagem = 0;
    if(document.getElementById('imagem').files[0].type.match('image.*')){
        imagem = document.getElementById('imagem').files[0];// Obtém o arquivo de imagem
    }
    if (!imagem == 0) {
        const storageRef = storage.ref('imagens/' + imagem.name);
        storageRef.put(imagem).then(snapshot => {
            snapshot.ref.getDownloadURL().then(downloadURL => {
                const dados = {
                    uid: uid,
                    data: data,
                    nome: nome,
                    latitude: latitude,
                    longitude: longitude,
                    imagemURL: downloadURL // Salva a URL da imagem
                };
                database.ref('pontos').push(dados)
                    .then(() => {
                        alert('Dados enviados com sucesso!');
                        document.getElementById('nome').value = '';
                        document.getElementById('imagem').value = '';
                    })
                    .catch(error => {
                        console.error('Erro ao enviar os dados: ', error);
                    });
            });
        }).catch(error => {
            console.error('Erro ao fazer upload da imagem: ', error);
        });
    } else {
        alert('Por favor, selecione uma imagem.');
    }
}

// Função para consultar dados dos pontos
function consultarPontos() {
    const pontosRef = database.ref('pontos');
    pontosRef.once('value', snapshot => {
        const lista = document.getElementById('listaPontos');
        lista.style.display = "table";
        lista.innerHTML = ''; // Limpar lista anterior
        let encontrado = false;
        const tablerow = document.createElement('tr');
        tablerow.innerHTML = `<th class="tablePonto">Data</th><th class="tablePonto">Nome</th><th class="tablePonto">Visualizar</th>`;
        lista.appendChild(tablerow);
        snapshot.forEach(childSnapshot => {
            const ponto = childSnapshot.val();
            // Verifica se o nome do aluno inclui o texto buscado
            if (ponto.uid.includes(user.uid)) {
                encontrado = true;
                const item = document.createElement('tr');
                item.innerHTML = `<td class="tablePonto">${ponto.data}</td><td class="tablePonto">${ponto.nome}</td><td class="tablePonto"><img src="img/location.png" class="acoes" onclick="visualizarLocalizacao(${ponto.latitude},${ponto.longitude})" alt="Visualizar Localização" title="Visualizar Localização"><img src="img/photo.png" class="acoes" onclick="visualizarImagem('${ponto.imagemURL}')" alt="Visualizar Imagem" title="Visualizar Imagem"></td>`;
                lista.appendChild(item);
            }
        });

        if (!encontrado) {
            lista.innerHTML = '<li>Nenhum ponto marcado nesse usuário.</li>';
        }
    }).catch(error => {
        console.error('Erro ao buscar pontos: ', error);
    });
}

// Função para limpar a consulta
function limparConsulta() {
    const lista = document.getElementById('listaPontos');
    lista.innerHTML = ''; // Limpar lista anterior
    lista.style.display = "none";
}

function dataAtual() {
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

    return dia + "/" + mes + "/" + horaAtual.getFullYear() + " - " + horas + ":" + minutos + ":" + segundos;
}