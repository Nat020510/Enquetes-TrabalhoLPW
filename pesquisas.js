
const campoPesquisa = document.getElementById("campoPesquisa");

const listaPesquisas = document.getElementById("listaPesquisas");


campoPesquisa.addEventListener("input", function() {

   
    const texto = campoPesquisa.value.toLowerCase();

    
    const cards = document.querySelectorAll(".card-pesquisa");

    