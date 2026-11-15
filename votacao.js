const formVotacao = document.getElementById("formVotacao");
const areaResultados = document.getElementById("resultados");
const graficoResultados = document.getElementById("graficoResultados");

const opcoes = document.querySelectorAll('input[name="opcao"]');

// Contagem inicial de votos (demonstração)
const votos = {};

opcoes.forEach(function(opcao) {
    votos[opcao.value] = 0;
});

formVotacao.addEventListener("submit", function(event) {
    event.preventDefault();

    const opcaoSelecionada = document.querySelector(
        'input[name="opcao"]:checked'
    );

    if (!opcaoSelecionada) {
        alert("Selecione uma opção antes de votar!");
        return;
    }

    votos[opcaoSelecionada.value]++;

    mostrarResultados();

    formVotacao.hidden = true;
    areaResultados.hidden = false;
});

function mostrarResultados() {
    const totalVotos = Object.values(votos).reduce(
        function(total, quantidade) {
            return total + quantidade;
        }, 0
    );

    graficoResultados.innerHTML = "";

    for (const opcao in votos) {
        const quantidade = votos[opcao];
        const porcentagem = (quantidade / totalVotos) * 100;

        const resultado = document.createElement("div");
        resultado.classList.add("resultado-item");

        resultado.innerHTML = `
            <p>${opcao} - ${quantidade} voto(s) (${porcentagem.toFixed(0)}%)</p>
            <div class="barra-fundo">
                <div class="barra-preenchida" style="width: ${porcentagem}%"></div>
            </div>
        `;

        graficoResultados.appendChild(resultado);
    }
}