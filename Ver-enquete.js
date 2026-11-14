
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

    const totalVotos = Number(enquete.total_votos);

    enquete.opcoes.forEach(function (opcao) {

        const quantidadeVotos = Number(opcao.votos);

        const porcentagem = totalVotos > 0
            ? (quantidadeVotos / totalVotos) * 100
            : 0;

        const linha = document.createElement("div");
        linha.classList.add("resultado-opcao");

        const texto = document.createElement("p");
        texto.classList.add("texto-resultado");

        texto.textContent =
            `${opcao.texto} — ${porcentagem.toFixed(1)}% (${quantidadeVotos} votos)`;

        const barra = document.createElement("div");
        barra.classList.add("barra-resultado");

        const preenchimento = document.createElement("div");
        preenchimento.classList.add("preenchimento-resultado");

        preenchimento.style.width = `${porcentagem}%`;
        preenchimento.style.backgroundColor = "var(--cor-destaque)";

        barra.appendChild(preenchimento);

        linha.appendChild(texto);
        linha.appendChild(barra);

        graficoResultados.appendChild(linha);

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
// INICIALIZAÇÃO
// =====================================

carregarEnquete();