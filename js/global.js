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
