(function (window, document) {
  "use strict";

  /* ========================================================================
     1. CONFIGURAÇÕES
     ======================================================================== */

  const CHAVES = {
    usuarios: "vocify:usuarios",
    sessao: "vocify:sessao",
    enquetes: "vocify:enquetes",
    categorias: "vocify:categorias",
    demoCarregada: "vocify:demo-carregada",
  };

  /* Autores exibidos no modal "Sobre". */
  const AUTORES = [
    { nome: "Autor 1", funcao: "Página inicial e base do site" },
    { nome: "Autor 2", funcao: "Criação de enquetes" },
    { nome: "Autor 3", funcao: "Login e cadastro" },
    { nome: "Autor 4", funcao: "Resultados e gráficos" },
  ];

  /* Itens do menu. */
  const MENU = [
    { id: "inicio", rotulo: "Início", href: "index.html" },
    { id: "enquetes", rotulo: "Enquetes", href: "enquetes.html" },
    { id: "criar", rotulo: "Criar enquete", href: "criar-enquete.html" },
    { id: "categorias", rotulo: "Categorias", href: "categorias.html" },
  ];

  /* Categorias criadas na primeira visita */
  const CATEGORIAS_PADRAO = [
    { id: "entretenimento", nome: "Entretenimento", cor: "#ff6a13" },
    { id: "musica", nome: "Música", cor: "#ffb400" },
    { id: "escola", nome: "Escola", cor: "#4da3ff" },
    { id: "esportes", nome: "Esportes", cor: "#2fbf71" },
    { id: "estilo-de-vida", nome: "Estilo de vida", cor: "#e5457d" },
    { id: "outros", nome: "Outros", cor: "#9a9a9a" },
  ];


 /* ========================================================================
    2. ARMAZENAMENTO
     ======================================================================== */
  const Armazenamento = {
    ler(chave, valorPadrao) {
      try {
        const bruto = window.localStorage.getItem(chave);
        return bruto === null ? valorPadrao : JSON.parse(bruto);
      } catch (erro) {
        console.error("[Vocify] Erro ao ler", chave, erro);
        return valorPadrao;
      }
    },

    gravar(chave, valor) {
      try {
        window.localStorage.setItem(chave, JSON.stringify(valor));
        return true;
      } catch (erro) {
        console.error("[Vocify] Erro ao gravar", chave, erro);
        return false;
      }
    },

    remover(chave) {
      try {
        window.localStorage.removeItem(chave);
      } catch (erro) {
        console.error("[Vocify] Erro ao remover", chave, erro);
      }
    },
  };

  /* Gera um id único simples  */
  function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  /* ========================================================================
     3. CATEGORIAS  ({ id, nome, cor })
     ======================================================================== */
  const Categorias = {
    listar() {
      const salvas = Armazenamento.ler(CHAVES.categorias, null);
      if (salvas) return salvas;

      /* Primeira visita: grava as categorias padrão */
      Armazenamento.gravar(CHAVES.categorias, CATEGORIAS_PADRAO);
      return CATEGORIAS_PADRAO.slice();
    },

    salvar(lista) {
      return Armazenamento.gravar(CHAVES.categorias, lista);
    },

    obter(id) {
      return this.listar().find((categoria) => categoria.id === id) || null;
    },
  };

 /* ========================================================================
     4. ENQUETES
     Modelo: { id, titulo, categoriaId, autor, criadaEm,
               
     ======================================================================== */
  const Enquetes = {
    listar() {
      return Armazenamento.ler(CHAVES.enquetes, []);
    },

    salvar(lista) {
      return Armazenamento.gravar(CHAVES.enquetes, lista);
    },

    obter(id) {
      return this.listar().find((enquete) => enquete.id === id) || null;
    },

    adicionar(dados) {
      const lista = this.listar();
      const nova = { id: gerarId(), criadaEm: Date.now(), ...dados };
      lista.push(nova);
      this.salvar(lista);
      return nova;
    },

    totalVotos(enquete) {
      return enquete.opcoes.reduce((soma, opcao) => soma + opcao.votos, 0);
    },

    /* DADOS DE DEMONSTRAÇÃO */
    carregarDemo() {
      if (Armazenamento.ler(CHAVES.demoCarregada, false)) return;
      if (this.listar().length > 0) return;

      const demo = [
        {
          titulo: "Qual seu gênero de filme favorito?",
          categoriaId: "entretenimento",
          opcoes: [
            { texto: "Ação", votos: 482 },
            { texto: "Comédia", votos: 391 },
            { texto: "Terror", votos: 375 },
          ],
        },
        {
          titulo: "Qual estilo de música você mais escuta?",
          categoriaId: "musica",
          opcoes: [
            { texto: "Rock", votos: 410 },
            { texto: "Sertanejo", votos: 302 },
            { texto: "Hip hop", votos: 270 },
          ],
        },
        {
          titulo: "Qual seu jogo favorito?",
          categoriaId: "entretenimento",
          opcoes: [
            { texto: "Minecraft", votos: 300 },
            { texto: "Zelda", votos: 233 },
            { texto: "FIFA", votos: 210 },
          ],
        },
      ];

      demo.forEach((enquete) => this.adicionar({ autor: "Vocify", ...enquete }));
      Armazenamento.gravar(CHAVES.demoCarregada, true);
    },
  };
