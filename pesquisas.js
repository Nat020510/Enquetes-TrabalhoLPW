
const campoPesquisa = document.getElementById("campoPesquisa");

const listaPesquisas = document.getElementById("listaPesquisas");


const filtroCategoria = document.getElementById("filtroCategoria");


const cards = document.querySelectorAll(".card-pesquisa");


campoPesquisa.addEventListener("input", function() {

   
    const texto = campoPesquisa.value.toLowerCase();

    
    const cards = document.querySelectorAll(".card-pesquisa");



    
    cards.forEach(function(card) {

       
        const titulo = card.querySelector("h2").textContent.toLowerCase();

       
        if (titulo.includes(texto)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});



cards.forEach(function(card) {

   
    const categoria = card.querySelector(".categoria").dataset.categoria;

    
    const opcao = document.createElement("option");

    opcao.value = categoria;
    opcao.textContent = categoria;

    
    filtroCategoria.appendChild(opcao);

});