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

 /* ========================================================================
     5. AUTENTICAÇÃO / SESSÃO
     ======================================================================== */
  const Autenticacao = {
  
    sessaoAtual() {
      return Armazenamento.ler(CHAVES.sessao, null);
    },

    
    iniciarSessao(usuario) {
      Armazenamento.gravar(CHAVES.sessao, { id: usuario.id, nome: usuario.nome });
      document.dispatchEvent(new CustomEvent("vocify:sessao"));
    },

    sair() {
      Armazenamento.remover(CHAVES.sessao);
      document.dispatchEvent(new CustomEvent("vocify:sessao"));
      UI.toast("Você saiu da sua conta.");
    },

    /* >>> PONTO DE INTEGRAÇÃO <<<
       Quem fizer o login/cadastro deve SUBSTITUIR esta função para abrir
       o modal/tela de login. Ex.: Vocify.Autenticacao.abrirLogin = () => {...} */
    abrirLogin() {
      UI.toast("O login será liberado em breve.");
    },
  };

 /* ========================================================================
     6. UI
     ======================================================================== */
  const UI = {
    criar(tag, opcoes = {}, filhos = []) {
      const elemento = document.createElement(tag);
      if (opcoes.classe) elemento.className = opcoes.classe;
      if (opcoes.texto !== undefined) elemento.textContent = opcoes.texto;
      if (opcoes.atributos) {
        Object.entries(opcoes.atributos).forEach(([nome, valor]) => {
          elemento.setAttribute(nome, valor);
        });
      }
      filhos.forEach((filho) => elemento.append(filho));
      return elemento;
    },

     /* ---------- Layout compartilhado (cabeçalho, rodapé, modal Sobre) ---------- */
    renderizarLayout() {
      const paginaAtual = document.body.dataset.pagina;
      const cabecalho = document.getElementById("cabecalho-site");
      const rodape = document.getElementById("rodape-site");

      if (cabecalho) {
        cabecalho.className = "cabecalho";
        cabecalho.innerHTML = this.modeloCabecalho(paginaAtual);
      }

      if (rodape) {
        rodape.className = "rodape";
        rodape.innerHTML = `
          <div class="container rodape__interno">
            <p>&copy; ${new Date().getFullYear()} Vocify. Projeto acadêmico de Web.</p>
            <button class="rodape__link" type="button" data-acao="abrir-sobre">Sobre o projeto</button>
          </div>`;
      }

      document.body.append(this.criarModalSobre());
      this.atualizarConta();
    },

    modeloCabecalho(paginaAtual) {
      const links = MENU.map((item) => {
        const atual = item.id === paginaAtual ? ' aria-current="page"' : "";
        return `<li><a class="menu__link" href="${item.href}"${atual}>${item.rotulo}</a></li>`;
      }).join("");

      return `
        <div class="container cabecalho__interno">
          <a class="marca" href="index.html" aria-label="Vocify - página inicial">
            <img class="marca__icone" src="assets/img/favicon.png" alt="" width="44" height="44">
            <span class="marca__nome">Vocify</span>
          </a>

          <nav class="menu" id="menu-principal" aria-label="Principal">
            <ul class="menu__lista">
              ${links}
              <li><button class="menu__link" type="button" data-acao="abrir-sobre">Sobre</button></li>
            </ul>
          </nav>

          <div class="cabecalho__conta">
            <span class="conta__nome" id="conta-nome" hidden></span>
            <button class="btn btn--primario" type="button" id="conta-botao" data-acao="entrar">Entrar</button>
          </div>

          <button class="cabecalho__menu-btn" type="button" aria-expanded="false"
                  aria-controls="menu-principal" aria-label="Abrir menu">
            <span></span><span></span><span></span>
          </button>
        </div>`;
    },

    /* Mostra "Entrar" ou "nome + Sair" conforme a sessão */
    atualizarConta() {
      const nome = document.getElementById("conta-nome");
      const botao = document.getElementById("conta-botao");
      if (!nome || !botao) return;

      const sessao = Autenticacao.sessaoAtual();
      nome.hidden = !sessao;
      nome.textContent = sessao ? sessao.nome : "";
      botao.textContent = sessao ? "Sair" : "Entrar";
      botao.dataset.acao = sessao ? "sair" : "entrar";
    },

    /* ---------- Modal "Sobre" (obrigatório no enunciado) ---------- */
    criarModalSobre() {
      const listaAutores = UI.criar("ul", { classe: "autores" });
      AUTORES.forEach((autor) => {
        listaAutores.append(
          UI.criar("li", { classe: "autores__item" }, [
            UI.criar("span", { texto: autor.nome }),
            UI.criar("span", { classe: "autores__funcao", texto: autor.funcao }),
          ])
        );
      });

      const modal = UI.criar("dialog", {
        classe: "modal",
        atributos: { id: "modal-sobre", "aria-labelledby": "modal-sobre-titulo" },
      });

      modal.innerHTML = `
        <div class="modal__cabecalho">
          <h2 class="modal__titulo" id="modal-sobre-titulo">Sobre o Vocify</h2>
          <button class="modal__fechar" type="button" data-acao="fechar-modal" aria-label="Fechar">&times;</button>
        </div>
        <div class="modal__corpo">
          <p>O Vocify é uma plataforma de enquetes: crie perguntas, organize por categorias
             coloridas e acompanhe os resultados em gráficos.</p>
          <p>Trabalho Prático 2 da disciplina de Web, desenvolvido por:</p>
        </div>`;
      modal.querySelector(".modal__corpo").append(listaAutores);
      return modal;
    },

    abrirModal(id) {
      const modal = document.getElementById(id);
      if (modal && !modal.open) modal.showModal();
    },

    fecharModal(id) {
      const modal = document.getElementById(id);
      if (modal && modal.open) modal.close();
    },

    /* ---------- Toast (aviso rápido) ---------- */
    toast(mensagem) {
      let toast = document.getElementById("toast");
      if (!toast) {
        toast = UI.criar("div", {
          classe: "toast",
          atributos: { id: "toast", role: "status", "aria-live": "polite" },
        });
        document.body.append(toast);
      }

      toast.textContent = mensagem;
      toast.classList.add("toast--visivel");
      clearTimeout(UI.temporizadorToast);
      UI.temporizadorToast = setTimeout(() => toast.classList.remove("toast--visivel"), 3000);
    },

    /* ---------- Eventos globais (delegação) ---------- */
    registrarEventos() {
      document.addEventListener("click", (evento) => {
        const alvo = evento.target;

        if (alvo instanceof HTMLDialogElement) {
          alvo.close();
          return;
        }

        const botao = alvo.closest("[data-acao]");

        /* Menu hambúrguer */
        const menuBtn = alvo.closest(".cabecalho__menu-btn");
        if (menuBtn) {
          const aberto = menuBtn.getAttribute("aria-expanded") === "true";
          menuBtn.setAttribute("aria-expanded", String(!aberto));
          document.getElementById("menu-principal").classList.toggle("menu--aberto", !aberto);
          return;
        }

        if (!botao) return;

        switch (botao.dataset.acao) {
          case "abrir-sobre":
            UI.abrirModal("modal-sobre");
            break;
          case "fechar-modal":
            botao.closest("dialog").close();
            break;
          case "entrar":
            Autenticacao.abrirLogin();
            break;
          case "sair":
            Autenticacao.sair();
            break;
        }
      });

      /* ========================================================================
     7. INICIALIZAÇÃO
     ======================================================================== */
  function iniciar() {
    Categorias.listar();
    Enquetes.carregarDemo(); /* REMOVER quando a criação de enquetes existir */
    UI.renderizarLayout();
    UI.registrarEventos();
  }

  /* Expõe a API para os scripts de cada página */
  window.Vocify = { Armazenamento, Categorias, Enquetes, Autenticacao, UI, CHAVES };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})(window, document);

      document.addEventListener("vocify:sessao", () => UI.atualizarConta());
    },
  };
