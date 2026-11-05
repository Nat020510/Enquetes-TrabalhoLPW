
const campoPesquisa = document.getElementById("campoPesquisa");

const listaPesquisas = document.getElementById("listaPesquisas");


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