const botoesFiltro = document.querySelectorAll(".pill");
const cardsPasso = document.querySelectorAll(".card-passo");

botoesFiltro.forEach(function (botao) {
  botao.addEventListener("click", function () {
    botoesFiltro.forEach(function (b) {
