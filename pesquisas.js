
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
}