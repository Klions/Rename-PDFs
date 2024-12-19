const express = require('express');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const app = express();

// Middleware para parsear dados JSON e urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Função para renomear os arquivos com base no RA
async function renomearPorRa(pasta, simular) {
    let resultados = [];
    const arquivos = fs.readdirSync(pasta);  // Lê os arquivos da pasta

    for (const arquivo of arquivos) {
        if (arquivo.toLowerCase().endsWith('.pdf')) { // Filtra apenas PDFs
            const caminhoArquivo = path.join(pasta, arquivo);

            try {
                // Lê o arquivo PDF
                const data = fs.readFileSync(caminhoArquivo);
                const pdf = await pdfParse(data); // Usa await para esperar a Promise

                const texto = pdf.text;  // Extraí o texto do PDF
                const ra = texto.match(/\d{9}/);  // Regex para encontrar o RA

                if (ra) {
                    const novoNome = ra[0] + '.pdf';  // Novo nome baseado no RA
                    if (!simular) {
                        const novoCaminho = path.join(pasta, novoNome);
                        fs.renameSync(caminhoArquivo, novoCaminho);  // Renomeia o arquivo
                        resultados.push(`Renomeado: ${arquivo} -> ${novoNome}`);
                    } else {
                        resultados.push(`[SIMULAÇÃO] Renomearia: ${arquivo} -> ${novoNome}`);
                    }
                } else {
                    resultados.push(`RA não encontrado em: ${arquivo}`);
                }
            } catch (error) {
                resultados.push(`Erro ao processar o arquivo ${arquivo}: ${error}`);
            }
        }
    }
    return resultados;
}

// Rota para renderizar a página inicial (HTML)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para realizar o processo de renomeação
app.post('/renomear', async (req, res) => {
    const pasta = req.body.pasta;
    
    // Verifica se a pasta foi fornecida e se é válida
    if (!pasta) {
        return res.json(["Erro: O caminho da pasta não foi fornecido."]);
    }
    if (!fs.existsSync(pasta) || !fs.statSync(pasta).isDirectory()) {
        return res.json([`Erro: O caminho '${pasta}' não é uma pasta válida.`]);
    }

    // Verifica se o processo será simulado
    const simular = req.body.simular === 'on'; // Checkbox retorna "on" quando marcado
    const resultados = await renomearPorRa(pasta, simular);  // Chama a função de renomeação
    res.json(resultados);  // Retorna os resultados como JSON
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});
