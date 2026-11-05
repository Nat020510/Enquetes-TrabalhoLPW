(function (document, Vocify) {
  "use strict";

  const { Categorias, Enquetes, UI } = Vocify;

  /* Quantas enquetes aparecem em "Enquetes em destaque" */
  const LIMITE_DESTAQUES = 6;


  /* ========================================================================
     1. REFERÊNCIAS E ESTADO
     ======================================================================== */
  const listaCategorias = document.getElementById("lista-categorias");
  const listaDestaques = document.getElementById("lista-destaques");

  let categoriaSelecionada = "todas";


  /* ========================================================================
     2. HERO: barras do cartão de resultado crescem ao carregar a página
     ======================================================================== */
  function animarBarras() {
    const barras = document.querySelectorAll(".barra__preenchimento");

    
    requestAnimationFrame(() => {
      barras.forEach((barra) => {
        barra.style.width = `${barra.dataset.largura}%`;
      });
    });
  }
