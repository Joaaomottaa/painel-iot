
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
const ultimaMedicaoElement = document.getElementById('ultimaMedicao');
const btnSair = document.getElementById('btnSair');

let dataInterval; 

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

btnLogin.addEventListener('click', () => {
    const email = emailInput.value;
    const senha = senhaInput.value;
    auth.signInWithEmailAndPassword(email, senha)
        .catch(error => {
            errorMessage.textContent = error.message;
        });
});

btnSair.addEventListener('click', () => {
    auth.signOut();
});

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