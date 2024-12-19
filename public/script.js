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

        if (!response.ok) {
            // Se a resposta não for OK, lançar erro
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        // Tentar converter a resposta para JSON
        const resultados = await response.json();

        // Atualizar a interface com os resultados
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = resultados.join('<br>');
    } catch (error) {
        console.error('Erro ao realizar a requisição:', error);
        // Exibir erro para o usuário
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = 'Houve um erro ao processar sua solicitação. Por favor, tente novamente.';
    }
});
