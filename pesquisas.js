
const campoPesquisa = document.getElementById("campoPesquisa");

const listaPesquisas = document.getElementById("listaPesquisas");


const filtroCategoria = document.getElementById("filtroCategoria");


const cards = document.querySelectorAll(".card-pesquisa");





cards.forEach(function(card) {

   
    const categoria = card.querySelector(".categoria").dataset.categoria;

    
    const opcao = document.createElement("option");

    opcao.value = categoria;
    opcao.textContent = categoria;

    
    filtroCategoria.appendChild(opcao);

});




filtroCategoria.addEventListener("change", filtrarPesquisas);


campoPesquisa.addEventListener("input", filtrarPesquisas);


function filtrarPesquisas() {

    const texto = campoPesquisa.value.toLowerCase();
    const categoriaSelecionada = filtroCategoria.value;

    cards.forEach(function(card) {

        const titulo = card.querySelector("h2").textContent.toLowerCase();

        const categoria = card.querySelector(".categoria").dataset.categoria;

        const correspondeTitulo = titulo.includes(texto);

        const correspondeCategoria =
            categoriaSelecionada === "" ||
            categoria === categoriaSelecionada;

        if (correspondeTitulo && correspondeCategoria) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });


    // Verifica se existe algum card visível
const algumVisivel = Array.from(cards).some(function(card) {
    return card.style.display !== "none";
});

// Mostra ou esconde a mensagem
const mensagemVazia = document.getElementById("mensagemVazia");

mensagemVazia.hidden = algumVisivel;
}