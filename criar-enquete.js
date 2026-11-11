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

        // Destaca a cor selecionada
        botoesCores.forEach(function (outroBotao) {
            outroBotao.style.outline = "none";
        });

        botao.style.outline = "3px solid white";
        botao.style.outlineOffset = "3px";
    });

});
