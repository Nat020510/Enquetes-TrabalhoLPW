
const formVotacao = document.getElementById("formVotacao");
const areaResultados = document.getElementById("resultados");
const graficoResultados = document.getElementById("graficoResultados");
const btnVerResultados = document.getElementById("btnVerResultados");

const opcoes = document.querySelectorAll('input[name="opcao"]');

// Contagem inicial de votos (demonstração)
const votos = {};

opcoes.forEach(function(opcao) {
    votos[opcao.value] = 0;
});

// REGISTRAR VOTO
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

soltarConfetes();



    formVotacao.hidden = true;
    areaResultados.hidden = false;
});

// BOTÃO VER RESULTADOS
btnVerResultados.addEventListener("click", function() {
    mostrarResultados();
    areaResultados.hidden = false;
});

// EXIBIR RESULTADOS
function mostrarResultados() {
    const totalVotos = Object.values(votos).reduce(
        function(total, quantidade) {
            return total + quantidade;
        }, 0
    );

    graficoResultados.innerHTML = "";

    // Verificar se existem votos
    if (totalVotos === 0) {
        graficoResultados.innerHTML =
            "<p>Ainda não há votos nesta enquete.</p>";
        return;
    }

    // Calcular porcentagens
    for (const opcao in votos) {
        const quantidade = votos[opcao];
        const porcentagem = (quantidade / totalVotos) * 100;

        const resultado = document.createElement("div");
        resultado.classList.add("resultado-item");

        resultado.innerHTML = `
            <p>${opcao} - ${quantidade} voto(s) (${porcentagem.toFixed(0)}%)</p>

            <div class="barra-fundo">
                <div class="barra-preenchida"
                     style="width: ${porcentagem}%">
                </div>
            </div>
        `;

        graficoResultados.appendChild(resultado);
    }
}


// ANIMAÇÃO DE CONFETES
function soltarConfetes() {
    const cores = ["#ff8c00", "#3498db", "#ff4d6d", "#f1c40f", "#9b59b6"];

    for (let i = 0; i < 50; i++) {
        const confete = document.createElement("div");

        confete.classList.add("confete");
        confete.style.left = Math.random() * 100 + "vw";
        confete.style.backgroundColor =
            cores[Math.floor(Math.random() * cores.length)];
        confete.style.animationDuration = (2 + Math.random() * 2) + "s";

        document.body.appendChild(confete);

        setTimeout(function() {
            confete.remove();
        }, 4000);
    }
}