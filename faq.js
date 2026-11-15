const botoesFiltro = document.querySelectorAll(".pill");
const cardsPasso = document.querySelectorAll(".card-passo");

botoesFiltro.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesFiltro.forEach(function (b) {
      b.classList.remove("ativa");
    });
      botao.classList.add("ativa");
    
    const filtro = botao.getAttribute("data-filtro");

    cardsPasso.forEach(function (card) {
