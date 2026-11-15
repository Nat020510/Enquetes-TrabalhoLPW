
// =====================================
// ELEMENTOS DA PÁGINA
// =====================================

const conteudoEnquete = document.getElementById("conteudoEnquete");

const categoriaEnquete = document.getElementById("categoriaEnquete");
const tituloEnquete = document.getElementById("tituloEnquete");
const descricaoEnquete = document.getElementById("descricaoEnquete");
const autorEnquete = document.getElementById("autorEnquete");

const imagemContainer = document.getElementById("imagemContainer");
const imagemEnquete = document.getElementById("imagemEnquete");

const listaOpcoes = document.getElementById("listaOpcoes");
const formVoto = document.getElementById("formVoto");

const resultadosEnquete = document.getElementById("resultadosEnquete");
const graficoResultados = document.getElementById("graficoResultados");

const botaoExcluir = document.getElementById("botaoExcluir");

const discoBotao = document.getElementById("discoBotao");
const efeitosNotas = document.getElementById("efeitosNotas");

let graficoVotos = null;


// =====================================
// IDENTIFICAR A ENQUETE
// =====================================

const parametros = new URLSearchParams(window.location.search);
const idEnquete = parametros.get("id");


// =====================================
// CARREGAR DADOS DA ENQUETE
// =====================================

async function carregarEnquete() {

    if (!idEnquete || !Number.isInteger(Number(idEnquete)) || Number(idEnquete) < 1) {
        mostrarErro("Enquete inválida.");
        return;
    }

    try {

        const resposta = await fetch(
            `api/visualizar-enquete.php?id=${encodeURIComponent(idEnquete)}`
        );

        const enquete = await resposta.json();

        if (!resposta.ok) {
            throw new Error(enquete.mensagem || "Não foi possível carregar a enquete.");
        }

        mostrarEnquete(enquete);

    } 
    
    catch (erro) {

        console.error("Erro ao carregar enquete:", erro);
        mostrarErro(erro.message);

    }

}


// =====================================
// MOSTRAR DADOS DA ENQUETE
// =====================================

function mostrarEnquete(enquete) {

    conteudoEnquete.style.setProperty("--cor-enquete", enquete.cor);
    document.documentElement.style.setProperty("--cor-enquete", enquete.cor);

    categoriaEnquete.textContent = enquete.categoria;
    categoriaEnquete.style.backgroundColor = enquete.cor_categoria;

    tituloEnquete.textContent = enquete.titulo;

    descricaoEnquete.textContent =
        enquete.descricao || "Esta enquete não possui descrição.";

    autorEnquete.textContent = `Criada por ${enquete.autor}`;

    if (enquete.imagem) {

        imagemEnquete.src = enquete.imagem;
        imagemContainer.hidden = false;
    } 
    
    else {
        imagemContainer.hidden = true;
    }

    botaoExcluir.hidden = !enquete.eh_autor;

    if (enquete.ja_votou) {

        formVoto.hidden = true;
        mostrarResultados(enquete);
    } 
    
    else {

        formVoto.hidden = false;
        resultadosEnquete.hidden = true;

        criarAlternativas(enquete.opcoes);
    }

    if (enquete.eh_autor) {
        mostrarResultados(enquete);
    }

}


// =====================================
// CRIAR ALTERNATIVAS
// =====================================

function criarAlternativas(opcoes) {

    listaOpcoes.innerHTML = "<legend>Escolha uma alternativa:</legend>";

    opcoes.forEach(function (opcao) {

        const label = document.createElement("label");
        label.classList.add("opcao-voto");

        const radio = document.createElement("input");

        radio.type = "radio";
        radio.name = "alternativa";
        radio.value = opcao.id;
        radio.required = true;

        const texto = document.createElement("span");
        texto.textContent = opcao.texto;

        label.appendChild(radio);
        label.appendChild(texto);

        listaOpcoes.appendChild(label);

    });

}


// =====================================
// MOSTRAR RESULTADOS
// =====================================


function mostrarResultados(enquete) {

    resultadosEnquete.hidden = false;
    graficoResultados.innerHTML = "";

    // Evita acumular gráficos quando a enquete é atualizada.
    if (graficoVotos) {
        graficoVotos.destroy();
        graficoVotos = null;
    }

    const totalVotos = Number(enquete.total_votos);

    const alternativas = enquete.opcoes;
    const textos = alternativas.map(opcao => opcao.texto);
    const votos = alternativas.map(opcao => Number(opcao.votos));

    const canvas = document.createElement("canvas");
    canvas.style.maxHeight = "320px";

    graficoResultados.appendChild(canvas);

    const corDestaque = getComputedStyle(document.documentElement)
        .getPropertyValue("--cor-destaque")
        .trim() || "#ffb400";

    graficoVotos = new Chart(canvas, {

        type: "bar",

        data: {
            labels: textos,

            datasets: [{
                label: "Votos",
                data: votos,
                backgroundColor: corDestaque,
                borderColor: corDestaque,
                borderWidth: 1,
                borderRadius: 8
            }]
        },

        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    callbacks: {
                        label: function (context) {

                            const quantidade = context.parsed.x;

                            const porcentagem = totalVotos > 0
                                ? (quantidade / totalVotos) * 100
                                : 0;

                            return `${quantidade} votos (${porcentagem.toFixed(1)}%)`;
                        }
                    }
                }
            },

            scales: {
                x: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        color: "#000000"
                    },
                    grid: {
                        color: "#444444"
                    }
                },

                y: {
                    ticks: {
                        color: "#000000",
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: "#444444"
                    }
                }
            }
        }

    });

    const total = document.createElement("p");
    total.classList.add("total-votos");
    total.textContent = `Total de votos: ${totalVotos}`;

    graficoResultados.appendChild(total);
}


// =====================================
// MENSAGEM DE ERRO
// =====================================

function mostrarErro(mensagem) {

    conteudoEnquete.innerHTML = "";

    const texto = document.createElement("p");
    texto.textContent = mensagem;

    conteudoEnquete.appendChild(texto);

}

// =====================================
// NOTAS MUSICAIS
// =====================================

function tocarSom() {

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audio = new AudioContext();

    const oscilador = audio.createOscillator();
    const volume = audio.createGain();

    oscilador.type = "sine";
    oscilador.frequency.value = 659.25;

    volume.gain.setValueAtTime(0.2, audio.currentTime);
    volume.gain.exponentialRampToValueAtTime(
        0.001,
        audio.currentTime + 0.35
    );

    oscilador.connect(volume);
    volume.connect(audio.destination);

    oscilador.start();
    oscilador.stop(audio.currentTime + 0.35);

    oscilador.onended = function () {
        audio.close();
    };
}

function criarNotaMusical() {

    const imagensNotas = [
        "imgs/notaMusical.png",
        "imgs/notaMusicalunica.png",
        "imgs/notaMusicaldupla.png"
    ];

    const nota = document.createElement("img");

    const indiceAleatorio = Math.floor(Math.random() * imagensNotas.length);

    nota.src = imagensNotas[indiceAleatorio];
    nota.alt = "";
    nota.classList.add("nota-flutuante");

    nota.style.left = `${Math.random() * 80 + 10}%`;
    nota.style.top = `${Math.random() * 60 + 20}%`;

    efeitosNotas.appendChild(nota);

    setTimeout(function () {
        nota.remove();
    }, 1500);
}


// =====================================
// CLIQUE NO DISCO
// =====================================

discoBotao.addEventListener("click", function () {
    tocarSom();
    criarNotaMusical();
});


// =====================================
// REGISTRAR VOTO
// =====================================

formVoto.addEventListener("submit", async function (evento) {

    evento.preventDefault();

    const alternativaSelecionada = formVoto.querySelector(
        'input[name="alternativa"]:checked'
    );

    if (!alternativaSelecionada) {
        alert("Escolha uma alternativa antes de votar!");
        return;
    }

    try {

        const resposta = await fetch("api/votar.php", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                enquete_id: idEnquete,
                alternativa_id: alternativaSelecionada.value
            })

        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem);
        }

        alert(resultado.mensagem);

        await carregarEnquete();

    } 
    
    catch (erro) {

        alert(erro.message);

    }
});


// =====================================
// EXCLUIR ENQUETE
// =====================================

botaoExcluir.addEventListener("click", async function () {

    const confirmar = confirm(
        "Tem certeza de que deseja excluir esta enquete? Essa ação não poderá ser desfeita."
    );

    if (!confirmar) {
        return;
    }

    botaoExcluir.disabled = true;

    try {

        const resposta = await fetch("api/excluir-enquete.php", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: idEnquete
            })

        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem);
        }

        alert(resultado.mensagem);

        window.location.href = "enquetes.html";

    }
    catch (erro) {

        alert(erro.message);
        botaoExcluir.disabled = false;

    }

});


// =====================================
// INICIALIZAÇÃO
// =====================================

carregarEnquete();