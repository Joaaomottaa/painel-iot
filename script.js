// --- CÓDIGO DE VERIFICAÇÃO FINAL PARA script.js ---

const firebaseConfig = {
    apiKey: "AIzaSyB-YofsWheB0UWDoIZN35egVLpqFILUZL8",
    authDomain: "iotsenaiat2.firebaseapp.com",
    databaseURL: "https://iotsenaiat2-default-rtdb.firebaseio.com",
    projectId: "iotsenaiat2",
    storageBucket: "iotsenaiat2.firebasestorage.app",
    messagingSenderId: "877913679706",
    appId: "1:877913679706:web:3675fc2c66214fe563",
    measurementId: "G-PQH1CMDYSL"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

const loginContainer = document.getElementById('login-container');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const btnLogin = document.getElementById('btnLogin');
const btnCadastrar = document.getElementById('btnCadastrar');
const errorMessage = document.getElementById('error-message');

const dashboardContainer = document.getElementById('dashboard-container');
const tempElement = document.getElementById('temperatura');
const umidadeElement = document.getElementById('umidade');
const sensacaoElement = document.getElementById('sensacao');
const ultimaMedicaoElement = document.getElementById('ultimaMedicao');
const btnSair = document.getElementById('btnSair');

let dataInterval;

btnCadastrar.addEventListener('click', () => { /* ...código original... */ });
btnLogin.addEventListener('click', () => { /* ...código original... */ });
btnSair.addEventListener('click', () => { auth.signOut(); });

auth.onAuthStateChanged(user => {
    if (user) {
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        startDataFetching();
    } else {
        loginContainer.style.display = 'block';
        dashboardContainer.style.display = 'none';
        stopDataFetching();
    }
});

function startDataFetching() {
    buscarDados();
    dataInterval = setInterval(buscarDados, 10000);
}

function stopDataFetching() {
    clearInterval(dataInterval);
}

async function buscarDados() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const idToken = await user.getIdToken();
        const URL_SEGURA = `https://iotsenaiat2-default-rtdb.firebaseio.com/sensores.json?auth=${idToken}`;

        const response = await fetch(URL_SEGURA);
        const dados = await response.json();

        // LINHA DE DEBUG: VAI NOS MOSTRAR OS DADOS EXATOS QUE CHEGARAM
        console.log("Dados recebidos do Firebase:", dados);

        if (dados && !dados.error) {
            const temperatura = dados.temperatura;
            const umidade = dados.umidade;
            const sensacao_termica = dados.sensacao_termica;

            tempElement.innerText = (temperatura !== undefined ? temperatura.toFixed(1) : '--') + " °C";
            umidadeElement.innerText = (umidade !== undefined ? umidade.toFixed(1) : '--') + " %";
            sensacaoElement.innerText = (sensacao_termica !== undefined ? sensacao_termica.toFixed(1) : '--') + " °C";
            
            ultimaMedicaoElement.innerText = new Date().toLocaleTimeString('pt-BR');
        } else {
            ultimaMedicaoElement.innerText = "Sem permissão para ler dados.";
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}

// Funções de login para manter o código completo
btnLogin.addEventListener('click', () => {
    const email = emailInput.value;
    const senha = senhaInput.value;
    auth.signInWithEmailAndPassword(email, senha).catch(error => errorMessage.textContent = error.message);
});

btnCadastrar.addEventListener('click', () => {
    const email = emailInput.value;
    const senha = senhaInput.value;
    auth.createUserWithEmailAndPassword(email, senha)
        .then(() => alert('Conta criada com sucesso! Você já está logado.'))
        .catch(error => errorMessage.textContent = error.message);
});
