
// =====================================
// ADICIONAR ALTERNATIVAS
// =====================================

const listaOpcoes = document.getElementById("listaOpcoes");
const botaoAdicionar = document.getElementById("adicionarOpcao");

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
});


// =====================================
// ALTERAR COR DO PAINEL
// =====================================

const botoesCores = document.querySelectorAll(".paleta-cores button");
const painel = document.querySelector(".conteudo-enquete");
let corSelecionada = "#ff6a13";

botoesCores.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const corEscolhida = botao.dataset.cor;
        corSelecionada = corEscolhida;

        painel.style.backgroundColor = corEscolhida;

        document.documentElement.style.setProperty("--cor-enquete", corEscolhida);

        botoesCores.forEach(function (outroBotao) {
            outroBotao.style.outline = "none";
        });

        botao.style.outline = "3px solid white";
        botao.style.outlineOffset = "3px";

    });

});


// =====================================
// SELECIONAR, EXIBIR E REMOVER IMAGEM
// =====================================

const campoImagem = document.getElementById("imagem");
const previaImagem = document.getElementById("previaImagem");
const textoImagem = document.getElementById("textoImagem");
const removerImagem = document.getElementById("removerImagem");

let imagemAnterior = null;

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

const discoBotao = document.getElementById("discoBotao");
const efeitosNotas = document.getElementById("efeitosNotas");

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


/* =====================================
   SALVAR ENQUETE NO BANCO DE DADOS
   ===================================== */

const formulario = document.getElementById("formEnquete");

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

            window.location.href = "enquetes.html";

        } catch (erro) {
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

    } else {

        salvarDados(null);

    }

});
