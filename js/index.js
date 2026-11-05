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

  
  /* ========================================================================
     4. ENQUETES EM DESTAQUE
     ======================================================================== */
  function criarCardEnquete(enquete) {
    const categoria = Categorias.obter(enquete.categoriaId);
    const total = Enquetes.totalVotos(enquete);

    const etiqueta = UI.criar("span", {
      classe: "etiqueta",
      texto: categoria ? categoria.nome : "Sem categoria",
    });

    const votos = UI.criar("span", {
      texto: `${total.toLocaleString("pt-BR")} ${total === 1 ? "voto" : "votos"}`,
    });
    
    const seta = UI.criar("span", { classe: "enquete-card__ir", texto: "Votar" });

    const card = UI.criar(
      "a",
      {
        classe: "card card--interativo enquete-card",
       
        atributos: { href: `enquete.html?id=${encodeURIComponent(enquete.id)}` },
      },
      [
        etiqueta,
        UI.criar("h3", { classe: "enquete-card__titulo", texto: enquete.titulo }),
        UI.criar("div", { classe: "enquete-card__rodape" }, [votos, seta]),
      ]
    );

    if (categoria) card.style.setProperty("--cor-cat", categoria.cor);
    return card;
  }

  function renderizarDestaques() {
    const destaques = Enquetes.listar()
      .filter((enquete) => categoriaSelecionada === "todas" || enquete.categoriaId === categoriaSelecionada)
      .sort((a, b) => Enquetes.totalVotos(b) - Enquetes.totalVotos(a))
      .slice(0, LIMITE_DESTAQUES);

    if (destaques.length === 0) {
      
      const vazio = UI.criar("div", { classe: "estado-vazio" }, [
        UI.criar("p", { texto: "Nenhuma enquete nesta categoria ainda." }),
        UI.criar("a", { classe: "link-ver-todas", texto: "Criar a primeira enquete", atributos: { href: "criar-enquete.html" } }),
      ]);
      listaDestaques.replaceChildren(vazio);
      return;
    }

    listaDestaques.replaceChildren(...destaques.map(criarCardEnquete));
  }

