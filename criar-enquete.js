// =====================================
// ELEMENTOS DA PÁGINA
// =====================================

const listaOpcoes = document.getElementById("listaOpcoes");
const botaoAdicionar = document.getElementById("adicionarOpcao");

const botoesCores = document.querySelectorAll(".paleta-cores button");
const painel = document.querySelector(".conteudo-enquete");

const campoImagem = document.getElementById("imagem");
const previaImagem = document.getElementById("previaImagem");
const textoImagem = document.getElementById("textoImagem");
const removerImagem = document.getElementById("removerImagem");

const discoBotao = document.getElementById("discoBotao");
const efeitosNotas = document.getElementById("efeitosNotas");

const formulario = document.getElementById("formEnquete");

let corSelecionada = "#ff6a13";
let imagemAnterior = null;


// =====================================
// RASCUNHO AUTOMÁTICO
// =====================================

const CHAVE_RASCUNHO = "vocify:rascunho-enquete";

function salvarRascunho() {

    const rascunho = {
        titulo: document.getElementById("titulo").value,
        descricao: document.getElementById("descricao").value,
        categoria: document.getElementById("categoria").value,

        opcoes: Array.from(
            document.querySelectorAll(".opcoes")
        ).map(campo => campo.value),

        cor: corSelecionada
    };

    Vocify.Armazenamento.gravar(CHAVE_RASCUNHO, rascunho);
}

function restaurarRascunho() {

    const rascunho = Vocify.Armazenamento.ler(
        CHAVE_RASCUNHO,
        null
    );

    if (!rascunho) {
        return;
    }

    document.getElementById("titulo").value = rascunho.titulo || "";
    document.getElementById("descricao").value = rascunho.descricao || "";
    document.getElementById("categoria").value = rascunho.categoria || "";

    if (Array.isArray(rascunho.opcoes)) {

        const quantidadeAtual = document.querySelectorAll(".opcoes").length;

        for (
            let i = quantidadeAtual;
            i < rascunho.opcoes.length && i < 10;
            i++
        ) {

            const novaOpcao = document.createElement("input");

            novaOpcao.type = "text";
            novaOpcao.classList.add("opcoes");
            novaOpcao.placeholder = "Alternativa " + (i + 1);
            novaOpcao.required = true;

            listaOpcoes.appendChild(novaOpcao);
        }

        const campos = document.querySelectorAll(".opcoes");

        campos.forEach(function (campo, indice) {
            campo.value = rascunho.opcoes[indice] || "";
        });
    }

    if (rascunho.cor) {

        corSelecionada = rascunho.cor;

        painel.style.backgroundColor = corSelecionada;

        document.documentElement.style.setProperty(
            "--cor-enquete",
            corSelecionada
        );

        botoesCores.forEach(function (botao) {

            botao.style.outline =
                botao.dataset.cor === corSelecionada
                    ? "3px solid white"
                    : "none";

            botao.style.outlineOffset = "3px";
        });
    }
}

formulario.addEventListener("input", salvarRascunho);
formulario.addEventListener("change", salvarRascunho);


// =====================================
// ADICIONAR ALTERNATIVAS
// =====================================

botaoAdicionar.addEventListener("click", function () {

    const quantidade = listaOpcoes.querySelectorAll(".opcoes").length;

    if (quantidade >= 10) {
        alert("Você atingiu o limite de 10 alternativas!");
        return;
    }

    const novaOpcao = document.createElement("input");

    novaOpcao.type = "text";
    novaOpcao.classList.add("opcoes");
    novaOpcao.placeholder = "Alternativa " + (quantidade + 1);
    novaOpcao.required = true;

    listaOpcoes.appendChild(novaOpcao);

    salvarRascunho();
});


// =====================================
// ALTERAR COR DO PAINEL
// =====================================

botoesCores.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const corEscolhida = botao.dataset.cor;

        corSelecionada = corEscolhida;

        painel.style.backgroundColor = corEscolhida;

        document.documentElement.style.setProperty(
            "--cor-enquete",
            corEscolhida
        );

        botoesCores.forEach(function (outroBotao) {
            outroBotao.style.outline = "none";
        });

        botao.style.outline = "3px solid white";
        botao.style.outlineOffset = "3px";

        salvarRascunho();
    });
});


// =====================================
// SELECIONAR, EXIBIR E REMOVER IMAGEM
// =====================================

campoImagem.addEventListener("change", function () {

    const arquivo = campoImagem.files[0];

    if (!arquivo) {
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        alert("Selecione um arquivo de imagem válido!");
        campoImagem.value = "";
        return;
    }

    if (imagemAnterior) {
        URL.revokeObjectURL(imagemAnterior);
    }

    imagemAnterior = URL.createObjectURL(arquivo);

    previaImagem.src = imagemAnterior;

    previaImagem.hidden = false;
    textoImagem.hidden = true;
    removerImagem.hidden = false;
});

removerImagem.addEventListener("click", function () {

    campoImagem.value = "";

    previaImagem.src = "";
    previaImagem.hidden = true;

    textoImagem.hidden = false;

    removerImagem.hidden = true;

    if (imagemAnterior) {
        URL.revokeObjectURL(imagemAnterior);
        imagemAnterior = null;
    }
});


// =====================================
// EASTER EGG DO DISCO
// =====================================

const imagensNotas = [
    "imgs/notaMusical.png",
    "imgs/notaMusicalunica.png",
    "imgs/notaMusicaldupla.png"
];

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

function criarNota() {

    const nota = document.createElement("img");

    const indice = Math.floor(Math.random() * imagensNotas.length);

    nota.src = imagensNotas[indice];
    nota.classList.add("nota-flutuante");

    nota.style.left = (40 + Math.random() * 40) + "%";
    nota.style.top = (15 + Math.random() * 50) + "%";

    efeitosNotas.appendChild(nota);

    nota.addEventListener("animationend", function () {
        nota.remove();
    });
}

discoBotao.addEventListener("click", function () {
    tocarSom();
    criarNota();
});


// =====================================
// PUBLICAR ENQUETE NO BANCO DE DADOS
// =====================================

formulario.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const categoria = document.getElementById("categoria").value.trim();

    const camposOpcoes = document.querySelectorAll(".opcoes");

    const opcoes = [];

    camposOpcoes.forEach(function (campo) {
        opcoes.push(campo.value.trim());
    });

    const arquivoImagem = campoImagem.files[0];

    async function salvarDados(imagem) {

        try {

            const resposta = await fetch("api/criar-enquete.php", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    titulo: titulo,
                    descricao: descricao,
                    categoria: categoria,
                    cor: corSelecionada,
                    opcoes: opcoes,
                    imagem: imagem
                })

            });

            const resultado = await resposta.json();

            if (resposta.status === 401) {
                alert("Sua sessão expirou. Faça login novamente.");
                window.location.href = "login.html";
                return;
            }

            if (!resposta.ok) {
                alert(resultado.mensagem);
                return;
            }

            alert(resultado.mensagem);

            // Apagar o rascunho após publicar com sucesso.
            Vocify.Armazenamento.remover(CHAVE_RASCUNHO);

            window.location.href = "enquetes.html";

        } 
        
        catch (erro) {

            console.error(erro);
            alert("Não foi possível conectar ao servidor.");
        }
    }

    if (arquivoImagem) {

        const leitor = new FileReader();

        leitor.onload = function () {
            salvarDados(leitor.result);
        };

        leitor.onerror = function () {
            alert("Não foi possível ler a imagem.");
        };

        leitor.readAsDataURL(arquivoImagem);
    } 
    
    else {
        salvarDados(null);
    }

});

// =====================================
// RESTAURAR RASCUNHO AO ABRIR A PÁGINA
// =====================================

restaurarRascunho();