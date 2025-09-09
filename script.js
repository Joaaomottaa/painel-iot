// --- PARTE 1: CONFIGURAÇÃO E CREDENCIAIS ---
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

// --- PARTE 2: INICIALIZAÇÃO E REFERÊNCIAS ---
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Elementos da tela de Login
const loginContainer = document.getElementById('login-container');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const btnLogin = document.getElementById('btnLogin');
const btnCadastrar = document.getElementById('btnCadastrar');
const errorMessage = document.getElementById('error-message');

// Elementos da tela do Painel
const dashboardContainer = document.getElementById('dashboard-container');
const tempElement = document.getElementById('temperatura');
const umidadeElement = document.getElementById('umidade');
const ultimaMedicaoElement = document.getElementById('ultimaMedicao');
const btnSair = document.getElementById('btnSair');

let dataInterval; // Variável para controlar o intervalo de busca de dados

// --- PARTE 3: LÓGICA DE AUTENTICAÇÃO ---

// Criar conta
btnCadastrar.addEventListener('click', () => {
    const email = emailInput.value;
    const senha = senhaInput.value;
    auth.createUserWithEmailAndPassword(email, senha)
        .then(userCredential => {
            alert('Conta criada com sucesso! Você já está logado.');
        })
        .catch(error => {
            errorMessage.textContent = error.message;
        });
});

// Entrar (Login)
btnLogin.addEventListener('click', () => {
    const email = emailInput.value;
    const senha = senhaInput.value;
    auth.signInWithEmailAndPassword(email, senha)
        .catch(error => {
            errorMessage.textContent = error.message;
        });
});

// Sair (Logout)
btnSair.addEventListener('click', () => {
    auth.signOut();
});

// Monitor de estado da autenticação (a mágica acontece aqui!)
auth.onAuthStateChanged(user => {
    if (user) {
        // Usuário está logado
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        startDataFetching();
    } else {
        // Usuário está deslogado
        loginContainer.style.display = 'block';
        dashboardContainer.style.display = 'none';
        stopDataFetching();
    }
});

// --- PARTE 4: LÓGICA DE BUSCA DE DADOS (AGORA SEGURA) ---

function startDataFetching() {
    buscarDados(); // Busca imediatamente
    dataInterval = setInterval(buscarDados, 10000); // E depois a cada 10 segundos
}

function stopDataFetching() {
    clearInterval(dataInterval); // Para de buscar os dados quando o usuário sai
}

async function buscarDados() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        // Pega o token de autenticação do usuário logado
        const idToken = await user.getIdToken();
        
        // Constrói a URL segura, usando o token do usuário para autenticar
        const URL_SEGURA = `https://iotsenaiat2-default-rtdb.firebaseio.com/sensores.json?auth=${idToken}`;

        const response = await fetch(URL_SEGURA);
        const dados = await response.json();

        if (dados && !dados.error) {
            tempElement.innerText = (dados.temperatura || 0).toFixed(1) + " °C";
            umidadeElement.innerText = (dados.umidade || 0).toFixed(1) + " %";
            ultimaMedicaoElement.innerText = new Date().toLocaleTimeString('pt-BR');
        } else {
            ultimaMedicaoElement.innerText = "Sem permissão para ler dados.";
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
    }
}