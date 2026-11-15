
const campoPesquisa = document.getElementById("campoPesquisa");
const filtroCategoria = document.getElementById("filtroCategoria");

const cards = document.querySelectorAll(".card-pesquisa");
const mensagemVazia = document.getElementById("mensagemVazia");


// CRIAR CATEGORIAS SEM REPETIÇÃO

const categorias = new Set();

cards.forEach(function(card) {

    const categoria = card.querySelector(".categoria").dataset.categoria;

    categorias.add(categoria);

});

categorias.forEach(function(categoria) {

    const opcao = document.createElement("option");

    opcao.value = categoria;
    opcao.textContent = categoria;

    filtroCategoria.appendChild(opcao);

});


// EVENTOS DOS FILTROS

filtroCategoria.addEventListener("change", filtrarPesquisas);

campoPesquisa.addEventListener("input", filtrarPesquisas);


// FUNÇÃO DE FILTRAGEM

function filtrarPesquisas() {

    const texto = campoPesquisa.value.toLowerCase().trim();

    const categoriaSelecionada = filtroCategoria.value;

    let quantidadeVisivel = 0;

    cards.forEach(function(card) {

        const titulo = card.querySelector("h2").textContent.toLowerCase();

        const descricao = card.querySelector("p").textContent.toLowerCase();

        const categoria = card.querySelector(".categoria").dataset.categoria;

        const correspondeTexto =
            titulo.includes(texto) || descricao.includes(texto);

        const correspondeCategoria =
            categoriaSelecionada === "" ||
            categoria === categoriaSelecionada;

        const correspondePesquisa =
            correspondeTexto && correspondeCategoria;

        if (correspondePesquisa) {

            card.style.display = "flex";
            quantidadeVisivel++;

        } else {

            card.style.display = "none";

        }

    });


    // MOSTRAR OU ESCONDER MENSAGEM

    mensagemVazia.hidden = quantidadeVisivel > 0;

}
