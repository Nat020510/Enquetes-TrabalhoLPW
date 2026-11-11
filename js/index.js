
(function (document, Vocify) {
  "use strict";

  const { Categorias, Enquetes, Autenticacao, UI, PAGINAS } = Vocify;

  const LIMITE_DESTAQUES = 6;   
  const OPCOES_NO_HERO = 3;    


  /* ========================================================================
     1. REFERÊNCIAS E ESTADO
     ======================================================================== */
  const listaCategorias = document.getElementById("lista-categorias");
  const listaDestaques = document.getElementById("lista-destaques");


  let categoriaSelecionada = "todas";

  function ordenarPorVotos(lista) {
    return lista.slice().sort((a, b) => Enquetes.totalVotos(b) - Enquetes.totalVotos(a));
  }


  /* ========================================================================
     2. HERO
     ======================================================================== */
  function animarBarras() {
    const barras = document.querySelectorAll(".barra__preenchimento");


    requestAnimationFrame(() => {
      barras.forEach((barra) => {
        barra.style.width = `${barra.dataset.largura}%`;
      });
    });
  }

  function criarBarra(opcao, totalVotos) {
    const porcentagem = Math.round(((Number(opcao.votos) || 0) / totalVotos) * 100);
    const preenchimento = UI.criar("span", { classe: "barra__preenchimento" });
    preenchimento.dataset.largura = porcentagem;

    return UI.criar("div", { classe: "barra" }, [
      UI.criar("span", { classe: "barra__rotulo", texto: opcao.texto }),
      UI.criar("span", { classe: "barra__trilho" }, [preenchimento]),
      UI.criar("span", { classe: "barra__pct", texto: `${porcentagem}%` }),
    ]);
  }

  function renderizarHero() {
    const cartao = document.getElementById("hero-resultado");
    const maisVotada = ordenarPorVotos(Enquetes.listar())[0];


    if (!maisVotada || !maisVotada.opcoes) return;

    const totalVotos = Enquetes.totalVotos(maisVotada) || 1;
    document.getElementById("hero-pergunta").textContent = maisVotada.titulo;
    document.getElementById("hero-barras").replaceChildren(
      ...maisVotada.opcoes.slice(0, OPCOES_NO_HERO).map((opcao) => criarBarra(opcao, totalVotos))
    );

    cartao.hidden = false;
    animarBarras();
  }


  /* ========================================================================
     3. ESTATÍSTICAS
     ======================================================================== */
  function renderizarEstatisticas() {
    const enquetes = Enquetes.listar();
    const valores = {
      enquetes: enquetes.length,
      votos: enquetes.reduce((soma, enquete) => soma + Enquetes.totalVotos(enquete), 0),
      categorias: Categorias.listar().length,
    };

    document.querySelectorAll("[data-estatistica]").forEach((elemento) => {
      elemento.textContent = valores[elemento.dataset.estatistica].toLocaleString("pt-BR");
    });
  }


  /* ========================================================================
     4. CATEGORIAS
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
      ...Categorias.listar().map((categoria) => criarChip(categoria.nome, categoria.id, categoria.cor))
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
     5. ENQUETES EM DESTAQUE
     ======================================================================== */
  function criarCardEnquete(enquete) {
    const categoria = Categorias.obter(enquete.categoriaId);
    const total = Enquetes.totalVotos(enquete);

    const card = UI.criar(
      "a",
      {
        classe: "card card--interativo enquete-card",
        atributos: { href: `${PAGINAS.enquetes}?id=${encodeURIComponent(enquete.id)}` },
      },
      [
        UI.criar("span", { classe: "etiqueta", texto: categoria ? categoria.nome : "Sem categoria" }),
        UI.criar("h3", { classe: "enquete-card__titulo", texto: enquete.titulo }),
        UI.criar("div", { classe: "enquete-card__rodape" }, [
          UI.criar("span", { texto: `${total.toLocaleString("pt-BR")} ${total === 1 ? "voto" : "votos"}` }),
          UI.criar("span", { classe: "enquete-card__ir", texto: "Votar" }),
        ]),
      ]
    );

    if (categoria) card.style.setProperty("--cor-cat", categoria.cor);
    return card;
  }

  function renderizarDestaques() {
    const destaques = ordenarPorVotos(
      Enquetes.listar().filter(
        (enquete) => categoriaSelecionada === "todas" || enquete.categoriaId === categoriaSelecionada
      )
    ).slice(0, LIMITE_DESTAQUES);

    if (destaques.length === 0) {
      listaDestaques.replaceChildren(
        UI.criar("div", { classe: "estado-vazio" }, [
          UI.criar("p", { texto: "Nenhuma enquete nesta categoria ainda." }),
          UI.criar("a", { classe: "link-ver-todas", texto: "Criar a primeira enquete", atributos: { href: PAGINAS.criar } }),
        ])
      );
      return;
    }

    listaDestaques.replaceChildren(...destaques.map(criarCardEnquete));
  }


  /* ========================================================================
     6. CHAMADA FINAL
     ======================================================================== */
  function ajustarChamadaFinal() {
    const sessao = Autenticacao.sessaoAtual();
    const titulo = document.getElementById("cta-titulo");
    const botaoCadastro = document.getElementById("cta-cadastro");

    titulo.textContent = sessao
      ? `Bora, ${sessao.nome.split(" ")[0]}? Sua enquete está esperando.`
      : "Sua opinião merece um palco.";
    botaoCadastro.hidden = Boolean(sessao);
  }


  /* ========================================================================
     7. [RESERVADO] RESULTADOS / GRÁFICOS
     Escreva aqui gráficos exibidos na index (ex.: Google Charts em #area-resultados).
     ======================================================================== */


  /* ========================================================================
     8. INICIALIZAÇÃO
     ======================================================================== */
  function iniciar() {
    renderizarHero();
    renderizarEstatisticas();
    renderizarCategorias();
    renderizarDestaques();
    ajustarChamadaFinal();

    listaCategorias.addEventListener("click", aoClicarCategoria);
    document.addEventListener("vocify:sessao", ajustarChamadaFinal);
  }

  iniciar();
})(document, window.Vocify);
