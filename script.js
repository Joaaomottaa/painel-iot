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

const loginContainer = document.getElementById('login-container');
const emailInput = document.getElementById('email');
// ... (outros elementos)
const sensacaoElement = document.getElementById('sensacao');
const ultimaMedicaoElement = document.getElementById('ultimaMedicao');
const btnSair = document.getElementById('btnSair');

let dataInterval;

// --- PARTE 3: LÓGICA DE AUTENTICAÇÃO ---
// (Esta parte continua a mesma)
btnCadastrar.addEventListener('click', () => { /* ... */ });
btnLogin.addEventListener('click', () => { /* ... */ });
btnSair.addEventListener('click', () => { /* ... */ });
auth.onAuthStateChanged(user => { /* ... */ });

// --- PARTE 4: LÓGICA DE BUSCA DE DADOS ---
function startDataFetching() { /* ... */ }
function stopDataFetching() { /* ... */ }

async function buscarDados() {
    const user = auth.currentUser;
    if (!user) return;

    try {
        const idToken = await user.getIdToken();
        const URL_SEGURA = `https://iotsenaiat2-default-rtdb.firebaseio.com/sensores.json?auth=${idToken}`;

        const response = await fetch(URL_SEGURA);
        const dados = await response.json();

        // --- LINHA ESPIÃ ADICIONADA ---
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
