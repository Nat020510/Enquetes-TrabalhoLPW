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
      const grupo = card.getAttribute("data-grupo");
      if (filtro === "todos" || filtro === grupo) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

const perguntas = document.querySelectorAll(".faq-pergunta");

perguntas.forEach(function (pergunta) {
  pergunta.addEventListener("click", function () {
    const item = pergunta.parentElement;
    const sinal = pergunta.querySelector(".sinal");

    item.classList.toggle("aberto");

    if (item.classList.contains("aberto")) {
        sinal.textContent = "-";
    } else {      
      sinal.textContent = "+";
    }
  });
});

const campoBusca = document.getElementById("campo-busca");
const itensFaq = document.querySelectorAll(".faq-item");

campoBusca.addEventListener("input", function () {
  const textoDigitado = campoBusca.value.toLowerCase();

  itensFaq.forEach(function (item) {
