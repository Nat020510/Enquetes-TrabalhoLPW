(function (window, document) {
  "use strict";

  /* ========================================================================
     1. CONFIGURAÇÕES
     ======================================================================== */
 const CHAVES = {
    usuarios: "usuarios", 
    sessao: "vocify:sessao",
    enquetes: "vocify:enquetes",
    categorias: "vocify:categorias",
    demoCarregada: "vocify:demo-carregada",
  };

  const AUTORES = [
    { nome: "Rodrigo Cesar", funcao: "Página inicial e base do site" },
    { nome: "Natalia", funcao: "Criação de enquetes" },
    { nome: "yasmin", funcao: "Login e cadastro" },
    { nome: "Vinicius", funcao: "Resultados e gráficos" },
  ];

  const PAGINAS = {
    inicio: "index.html",
    login: "login.html",
    cadastro: "cadastro.html",
    criar: "criar-enquete.html",
    enquetes: "enquetes.html",
    sobre: "sobre.html",
  };


  const PASTA_IMG = "imgs/";

  const MENU = [
    { id: "inicio", rotulo: "Início", href: PAGINAS.inicio },
    { id: "enquetes", rotulo: "Enquetes", href: PAGINAS.enquetes },
    { id: "criar", rotulo: "Criar enquete", href: PAGINAS.criar },
  ];

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
      return (enquete.opcoes || []).reduce((soma, opcao) => soma + (Number(opcao.votos) || 0), 0);
    },

    /* DADOS DE DEMONSTRAÇÃO: servem só para visualizar o layout. */
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

    sessao: null,

    sessaoAtual() {
        return this.sessao;
    },

    async verificarSessao() {
        try {
            const resposta = await fetch("api/verificar-sessao.php");

            if (resposta.ok) {
                const resultado = await resposta.json();
                this.sessao = resultado.usuario;
            } else {
                this.sessao = null;
            }

            document.dispatchEvent(new CustomEvent("vocify:sessao"));

        } catch (erro) {
            console.error("Erro ao verificar sessão:", erro);
            this.sessao = null;
        }
    },

      async sair() {
          try {
              const resposta = await fetch("api/logout.php", {
                  method: "POST"
              });

              if (!resposta.ok) {
                  throw new Error("Não foi possível encerrar a sessão.");
              }

              this.sessao = null;
              document.dispatchEvent(new CustomEvent("vocify:sessao"));

              UI.toast("Você saiu da sua conta.");

              // Se estiver em uma página protegida, redireciona para o login
              if (document.body.dataset.pagina === "criar") {
                  window.location.href = PAGINAS.login;
              }

          } catch (erro) {
              console.error(erro);
              UI.toast("Não foi possível sair da conta.");
          }
      },


    abrirLogin() {
        window.location.href = PAGINAS.login;
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
            <div class="rodape__links">
              <a class="rodape__link" href="${PAGINAS.sobre}">Sobre o projeto</a>
              <button class="rodape__link rodape__easteregg" type="button" data-easteregg="dj" title="Tocar um som estilo DJ!">💿 Modo DJ</button>
            </div>
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
            <img class="marca__icone" src="${PASTA_IMG}Favicon.png" alt="Logo VOCIFY" width="44" height="44">
            <span class="marca__nome">Vocify</span>
          </a>

          <nav class="menu" id="menu-principal" aria-label="Principal">
            <ul class="menu__lista">
              ${links}
              <li><a class="menu__link${paginaAtual === 'sobre' ? ' aria-current="page"' : ''}" href="${PAGINAS.sobre}">Sobre</a></li>
            </ul>
          </nav>

          <div class="cabecalho__conta">
            <span class="conta__nome" id="conta-nome" hidden></span>
            <a class="btn btn--fantasma conta__cadastro" id="conta-cadastro" href="${PAGINAS.cadastro}">Cadastrar</a>
            <button class="btn btn--primario" type="button" id="conta-botao" data-acao="entrar">Entrar</button>
          </div>

          <button class="cabecalho__menu-btn" type="button" aria-expanded="false"
                  aria-controls="menu-principal" aria-label="Abrir menu">
            <span></span><span></span><span></span>
          </button>
        </div>`;
    },

  
    atualizarConta() {
      const nome = document.getElementById("conta-nome");
      const botao = document.getElementById("conta-botao");
      const cadastro = document.getElementById("conta-cadastro");
      if (!nome || !botao || !cadastro) return;

      const sessao = Autenticacao.sessaoAtual();
      cadastro.hidden = Boolean(sessao);
      nome.hidden = !sessao;
      nome.textContent = sessao ? sessao.nome : "";
      botao.textContent = sessao ? "Sair" : "Entrar";
      botao.dataset.acao = sessao ? "sair" : "entrar";
    },

    /* ---------- Modal "Sobre" ---------- */
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

    /* ---------- Toast ---------- */
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
            window.location.href = PAGINAS.sobre;
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

      document.addEventListener("vocify:sessao", () => UI.atualizarConta());
    },
  };

  /* ========================================================================
     8. EASTER EGG: MODO DJ VOCIFY (Web Audio API Synthesizer & Vinil Player)
     ======================================================================== */
  const EasterEgg = {
    ativo: false,
    audioCtx: null,
    tempoLoop: null,
    passo: 0,
    bpm: 118,

    obterContexto() {
      if (!this.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.audioCtx = new AudioCtx();
        }
      }
      if (this.audioCtx && this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }
      return this.audioCtx;
    },

    /* Scratch analógico realista gerado via Web Audio API */
    tocarScratch() {
      const ctx = this.obterContexto();
      if (!ctx) return;

      try {
        const agora = ctx.currentTime;
        const tamanho = Math.floor(ctx.sampleRate * 0.16);
        const buffer = ctx.createBuffer(1, tamanho, ctx.sampleRate);
        const dados = buffer.getChannelData(0);
        for (let i = 0; i < tamanho; i++) {
          dados[i] = (Math.random() * 2 - 1) * Math.exp(-i / (tamanho * 0.45));
        }

        const fonteRuido = ctx.createBufferSource();
        fonteRuido.buffer = buffer;

        const filtro = ctx.createBiquadFilter();
        filtro.type = "bandpass";
        filtro.frequency.setValueAtTime(1100, agora);
        filtro.frequency.exponentialRampToValueAtTime(3400, agora + 0.06);
        filtro.frequency.exponentialRampToValueAtTime(750, agora + 0.15);
        filtro.Q.setValueAtTime(4.5, agora);

        const ganho = ctx.createGain();
        ganho.gain.setValueAtTime(0.35, agora);
        ganho.gain.exponentialRampToValueAtTime(0.001, agora + 0.16);

        fonteRuido.connect(filtro);
        filtro.connect(ganho);
        ganho.connect(ctx.destination);
        fonteRuido.start(agora);

        /* Sweep tonal do atrito */
        const osc = ctx.createOscillator();
        const ganhoOsc = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(280, agora);
        osc.frequency.exponentialRampToValueAtTime(720, agora + 0.05);
        osc.frequency.exponentialRampToValueAtTime(160, agora + 0.15);

        ganhoOsc.gain.setValueAtTime(0.2, agora);
        ganhoOsc.gain.exponentialRampToValueAtTime(0.001, agora + 0.15);

        osc.connect(ganhoOsc);
        ganhoOsc.connect(ctx.destination);
        osc.start(agora);
        osc.stop(agora + 0.16);
      } catch (e) {
        console.warn("[Vocify] Áudio indisponível:", e);
      }
    },

    /* Sintetizador de batida funk e baixo retrô */
    tocarPasso(tempo) {
      const ctx = this.obterContexto();
      if (!ctx) return;

      const passoAtual = this.passo % 16;
      this.passo++;

      try {
        /* Bumbo (Kick) */
        if (passoAtual === 0 || passoAtual === 6 || passoAtual === 8 || passoAtual === 14) {
          const osc = ctx.createOscillator();
          const ganho = ctx.createGain();
          osc.frequency.setValueAtTime(140, tempo);
          osc.frequency.exponentialRampToValueAtTime(36, tempo + 0.12);
          ganho.gain.setValueAtTime(0.48, tempo);
          ganho.gain.exponentialRampToValueAtTime(0.001, tempo + 0.16);
          osc.connect(ganho);
          ganho.connect(ctx.destination);
          osc.start(tempo);
          osc.stop(tempo + 0.18);
        }

        /* Caixa (Snare) */
        if (passoAtual === 4 || passoAtual === 12) {
          const tamanho = Math.floor(ctx.sampleRate * 0.12);
          const buffer = ctx.createBuffer(1, tamanho, ctx.sampleRate);
          const dados = buffer.getChannelData(0);
          for (let i = 0; i < tamanho; i++) dados[i] = Math.random() * 2 - 1;
          const fonte = ctx.createBufferSource();
          fonte.buffer = buffer;
          const filtro = ctx.createBiquadFilter();
          filtro.type = "highpass";
          filtro.frequency.setValueAtTime(950, tempo);
          const ganho = ctx.createGain();
          ganho.gain.setValueAtTime(0.28, tempo);
          ganho.gain.exponentialRampToValueAtTime(0.01, tempo + 0.12);
          fonte.connect(filtro);
          filtro.connect(ganho);
          ganho.connect(ctx.destination);
          fonte.start(tempo);
        }

        /* Chimbal (Hi-Hat) */
        if (passoAtual % 2 === 1) {
          const tamanho = Math.floor(ctx.sampleRate * 0.04);
          const buffer = ctx.createBuffer(1, tamanho, ctx.sampleRate);
          const dados = buffer.getChannelData(0);
          for (let i = 0; i < tamanho; i++) dados[i] = Math.random() * 2 - 1;
          const fonte = ctx.createBufferSource();
          fonte.buffer = buffer;
          const filtro = ctx.createBiquadFilter();
          filtro.type = "highpass";
          filtro.frequency.setValueAtTime(6500, tempo);
          const ganho = ctx.createGain();
          ganho.gain.setValueAtTime(0.12, tempo);
          ganho.gain.exponentialRampToValueAtTime(0.001, tempo + 0.04);
          fonte.connect(filtro);
          filtro.connect(ganho);
          ganho.connect(ctx.destination);
          fonte.start(tempo);
        }

        /* Linha de baixo funk */
        const notas = [82.41, 82.41, 98.0, 98.0, 110.0, 110.0, 146.83, 123.47];
        if (passoAtual % 2 === 0) {
          const freq = notas[(passoAtual / 2) % notas.length];
          const osc = ctx.createOscillator();
          const filtro = ctx.createBiquadFilter();
          const ganho = ctx.createGain();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(freq, tempo);

          filtro.type = "lowpass";
          filtro.frequency.setValueAtTime(450, tempo);
          filtro.frequency.exponentialRampToValueAtTime(170, tempo + 0.15);

          ganho.gain.setValueAtTime(0.24, tempo);
          ganho.gain.exponentialRampToValueAtTime(0.001, tempo + 0.17);

          osc.connect(filtro);
          filtro.connect(ganho);
          ganho.connect(ctx.destination);
          osc.start(tempo);
          osc.stop(tempo + 0.18);
        }
      } catch (e) {
        // Ignora pequenos erros de contexto
      }
    },

    iniciarLoop() {
      if (this.tempoLoop) return;
      this.passo = 0;
      const intervaloMs = (60 / this.bpm / 4) * 1000;
      this.tempoLoop = setInterval(() => {
        const ctx = this.obterContexto();
        if (ctx) {
          this.tocarPasso(ctx.currentTime);
        }
      }, intervaloMs);
    },

    pararLoop() {
      if (this.tempoLoop) {
        clearInterval(this.tempoLoop);
        this.tempoLoop = null;
      }
    },

    lancarNotas() {
      const icones = [
        "imgs/notaMusical.png",
        "imgs/notaMusicaldupla.png",
        "imgs/notaMusicalunica.png"
      ];
      for (let i = 0; i < 9; i++) {
        setTimeout(() => {
          const nota = document.createElement("img");
          nota.src = icones[Math.floor(Math.random() * icones.length)];
          nota.className = "easteregg-nota-flutuante";
          nota.style.left = `${Math.random() * 85 + 5}vw`;
          nota.style.bottom = `${Math.random() * 20 + 10}vh`;
          nota.style.animationDuration = `${Math.random() * 2 + 2.5}s`;
          document.body.append(nota);
          setTimeout(() => nota.remove(), 4500);
        }, i * 220);
      }
    },

    ativar(origem = "geral") {
      this.obterContexto();
      this.tocarScratch();

      const disco = document.getElementById("disco-vinil");

      if (this.ativo) {
        this.desativar();
        return;
      }

      this.ativo = true;
      if (disco) disco.classList.add("disco-vinil--girando");

      setTimeout(() => {
        if (this.ativo) {
          this.iniciarLoop();
          this.lancarNotas();
        }
      }, 350);

      this.renderizarPlayer();
      UI.toast("🎧 Easter Egg Desbloqueado: Modo DJ Vocify Ativado!");
    },

    desativar() {
      this.tocarScratch();
      this.pararLoop();
      this.ativo = false;

      const disco = document.getElementById("disco-vinil");
      if (disco) disco.classList.remove("disco-vinil--girando");

      const player = document.getElementById("dj-player");
      if (player) player.remove();

      UI.toast("Modo DJ pausado.");
    },

    renderizarPlayer() {
      let player = document.getElementById("dj-player");
      if (player) return;

      player = document.createElement("div");
      player.id = "dj-player";
      player.className = "dj-player";
      player.innerHTML = `
        <div class="dj-player__capa">
          <img src="imgs/DiscoVinil.png" alt="Vinil" class="dj-player__disco ${this.ativo ? "dj-player__disco--girando" : ""}">
        </div>
        <div class="dj-player__info">
          <span class="dj-player__rotulo">Modo DJ Vocify</span>
          <span class="dj-player__faixa">Groove das Enquetes (118 BPM)</span>
        </div>
        <div class="dj-player__acoes">
          <button type="button" class="dj-player__btn" id="dj-btn-scratch" title="Fazer scratch manual">💿 Scratch</button>
          <button type="button" class="dj-player__btn dj-player__btn--destaque" id="dj-btn-toggle" title="Pausar / Retomar">⏸️</button>
          <button type="button" class="dj-player__btn dj-player__fechar" id="dj-btn-fechar" title="Fechar">✕</button>
        </div>
      `;

      document.body.append(player);

      document.getElementById("dj-btn-scratch")?.addEventListener("click", () => {
        this.tocarScratch();
        this.lancarNotas();
      });

      document.getElementById("dj-btn-toggle")?.addEventListener("click", () => {
        if (this.ativo) {
          this.pararLoop();
          this.ativo = false;
          const btn = document.getElementById("dj-btn-toggle");
          if (btn) btn.textContent = "▶️";
          const discoP = player.querySelector(".dj-player__disco");
          if (discoP) discoP.classList.remove("dj-player__disco--girando");
          const discoHero = document.getElementById("disco-vinil");
          if (discoHero) discoHero.classList.remove("disco-vinil--girando");
        } else {
          this.tocarScratch();
          this.iniciarLoop();
          this.ativo = true;
          const btn = document.getElementById("dj-btn-toggle");
          if (btn) btn.textContent = "⏸️";
          const discoP = player.querySelector(".dj-player__disco");
          if (discoP) discoP.classList.add("dj-player__disco--girando");
          const discoHero = document.getElementById("disco-vinil");
          if (discoHero) discoHero.classList.add("disco-vinil--girando");
          this.lancarNotas();
        }
      });

      document.getElementById("dj-btn-fechar")?.addEventListener("click", () => {
        this.desativar();
      });
    },

    registrarGatilhos() {
      document.addEventListener("click", (e) => {
        const btnEasterEgg = e.target.closest('[data-easteregg="dj"]') || e.target.closest("#disco-vinil");
        if (btnEasterEgg) {
          e.preventDefault();
          this.ativar("disco");
        }
      });

      let cliquesLogo = 0;
      let timerLogo = null;
      document.addEventListener("click", (e) => {
        const marca = e.target.closest(".marca");
        if (!marca) return;
        cliquesLogo++;
        clearTimeout(timerLogo);
        timerLogo = setTimeout(() => { cliquesLogo = 0; }, 800);
        if (cliquesLogo >= 3) {
          cliquesLogo = 0;
          this.ativar("logo");
        }
      });

      const konami = [
        "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
        "b", "a"
      ];
      let posicaoKonami = 0;
      window.addEventListener("keydown", (e) => {
        const tecla = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        if (tecla === konami[posicaoKonami].toLowerCase()) {
          posicaoKonami++;
          if (posicaoKonami === konami.length) {
            posicaoKonami = 0;
            this.ativar("konami");
          }
        } else {
          posicaoKonami = 0;
        }
      });
    }
  };


  /* ========================================================================
     7. INICIALIZAÇÃO
     ======================================================================== */
function iniciar() {
    Categorias.listar();
    UI.renderizarLayout();
    UI.registrarEventos();
    EasterEgg.registrarGatilhos();

    Autenticacao.verificarSessao();
}

  window.Vocify = { Armazenamento, Categorias, Enquetes, Autenticacao, UI, EasterEgg, CHAVES, PAGINAS };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})(window, document);

