
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

botoesCores.forEach(function (botao) {

    botao.addEventListener("click", function () {

        const corEscolhida = botao.dataset.cor;

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
