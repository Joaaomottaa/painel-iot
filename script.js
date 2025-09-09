// --- PARTE 1: CONFIGURAÇÃO DA CONEXÃO ---
// A URL completa da API do Firebase, com o caminho e a chave secreta de autenticação.
// Exatamente como fizemos para o n8n!
const FIREBASE_URL = "https://iotsenaiat2-default-rtdb.firebaseio.com/sensores.json?auth=cf7gy734Kab1QB3VnYGVSnGnAKvQpJerlpR7FbB5";

// --- PARTE 2: ELEMENTOS DA PÁGINA ---
// Pegamos as referências dos locais na página onde vamos mostrar os dados.
const tempElement = document.getElementById('temperatura');
const umidadeElement = document.getElementById('umidade');
const ultimaMedicaoElement = document.getElementById('ultimaMedicao');

// --- PARTE 3: LÓGICA DE BUSCA E ATUALIZAÇÃO DOS DADOS ---
// Função que busca os dados no Firebase
async function buscarDados() {
    try {
        const response = await fetch(FIREBASE_URL);
        if (!response.ok) {
            throw new Error('Erro na rede: ' + response.statusText);
        }
        const dados = await response.json();

        // Se os dados existirem, atualiza a página
        if (dados) {
            const temperatura = dados.temperatura;
            const umidade = dados.umidade;

            // Atualiza a temperatura na tela
            if (temperatura !== undefined) {
                tempElement.innerText = temperatura.toFixed(1) + " °C";
            }

            // Atualiza a umidade na tela
            if (umidade !== undefined) {
                umidadeElement.innerText = umidade.toFixed(1) + " %";
            }

            // Atualiza a hora da última medição
            const agora = new Date();
            const horaFormatada = agora.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            ultimaMedicaoElement.innerText = horaFormatada;
        }

    } catch (error) {
        console.error("Falha ao buscar dados do Firebase:", error);
        ultimaMedicaoElement.innerText = "Erro na conexão.";
    }
}

// --- PARTE 4: INICIAR O PROCESSO ---
// Busca os dados imediatamente assim que a página carrega
buscarDados();

// Define um intervalo para buscar os dados a cada 5 segundos (5000 milissegundos)
// Isso simula o "tempo real" da abordagem anterior.
setInterval(buscarDados, 5000);