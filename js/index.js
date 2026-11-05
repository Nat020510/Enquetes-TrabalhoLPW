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


 /* ========================================================================
     3. CATEGORIAS: chips com a cor de cada categoria + filtro
     ======================================================================== */
  function criarChip(rotulo, id, cor) {
    const chip = UI.criar("button", {
      classe: "chip",
      texto: rotulo,
      atributos: {
        type: "button",
        "aria-pressed": String(id === categoriaSelecionada),
        "data-categoria": id,
      },
    });

   
    if (cor) chip.style.setProperty("--cor-cat", cor);
    return chip;
  }

  function renderizarCategorias() {
    listaCategorias.replaceChildren(
      criarChip("Todas", "todas", null),
      ...Categorias.listar().map((categoria) =>
        criarChip(categoria.nome, categoria.id, categoria.cor)
      )
    );
  }


  function aoClicarCategoria(evento) {
    const chip = evento.target.closest(".chip");
    if (!chip) return;

    categoriaSelecionada = chip.dataset.categoria;

    listaCategorias.querySelectorAll(".chip").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === chip));
    });
    renderizarDestaques();
  }
