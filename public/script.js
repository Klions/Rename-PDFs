document.getElementById('formRenomeacao').addEventListener('submit', async (event) => {
    event.preventDefault();

    const pasta = document.getElementById('pasta').value;
    const simular = document.getElementById('simular').checked ? 'on' : 'off';

    const response = await fetch('/renomear', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pasta, simular })
    });

    const resultados = await response.json();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = resultados.join('<br>');
});
