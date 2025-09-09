
const FIREBASE_URL = "https://iotsenaiat2-default-rtdb.firebaseio.com/sensores.json?auth=cf7gy734Kab1QB3VnYGVSnGnAKvQpJerlpR7FbB5";

const tempElement = document.getElementById('temperatura');
const umidadeElement = document.getElementById('umidade');
const ultimaMedicaoElement = document.getElementById('ultimaMedicao');


let ultimaTemperatura = null;
let ultimaUmidade = null;

async function buscarDados() {
    try {
        const response = await fetch(FIREBASE_URL);
        if (!response.ok) {
            throw new Error('Erro na rede: ' + response.statusText);
        }
        const dados = await response.json();

        if (dados) {
            const novaTemperatura = dados.temperatura;
            const novaUmidade = dados.umidade;

            if (novaTemperatura !== ultimaTemperatura || novaUmidade !== ultimaUmidade) {
                
                console.log("Novos dados recebidos! Atualizando a tela.");

                ultimaTemperatura = novaTemperatura;
                ultimaUmidade = novaUmidade;

                if (novaTemperatura !== undefined) {
                    tempElement.innerText = novaTemperatura.toFixed(1) + " °C";
                }

                if (novaUmidade !== undefined) {
                    umidadeElement.innerText = novaUmidade.toFixed(1) + " %";
                }

                const agora = new Date();
                const horaFormatada = agora.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
                ultimaMedicaoElement.innerText = horaFormatada;
            }
        }
    } catch (error) {
        console.error("Falha ao buscar dados do Firebase:", error);
        ultimaMedicaoElement.innerText = "Erro na conexão.";
    }
}

buscarDados();
setInterval(buscarDados, 5000);