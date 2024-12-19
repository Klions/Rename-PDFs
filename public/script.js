document.getElementById('formRenomeacao').addEventListener('submit', async (event) => {
    event.preventDefault();

    const pasta = document.getElementById('pasta').value;
    const simular = document.getElementById('simular').checked ? 'on' : 'off';

    try {
        const response = await fetch('https://rename-pdfs-584f4g2aw-daviduartesilvas-projects.vercel.app/renomear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pasta, simular }),
        });

        // Verificar se a resposta foi bem-sucedida (status 200-299)
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        // Verificar o tipo de conteúdo da resposta
        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
            // Se for JSON, analisar a resposta como JSON
            const resultados = await response.json();
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = resultados.join('<br>');
        } else {
            // Se não for JSON, exibir uma mensagem de erro
            const text = await response.text();
            throw new Error('Resposta não foi em JSON: ' + text);
        }

    } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = 'Houve um erro ao processar sua solicitação. Por favor, tente novamente.';
    }
});
