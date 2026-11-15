const CONFIGURACAO_VOCIFY = {
  nomeAplicacao: "Vocify",
  versaoPagina: "1.0.0",
  chaveArmazenamento: "vocify_faq_dados_v1",
  limiteHistorico: 50,
  tempoAnimacaoMs: 250,
  tempoDebouceBuscaMs: 120,
  larguraMobileMax: 768,
  larguraTabletMax: 1024,
  seletores: {
    botoesFiltro: ".pill",
    cardsPasso: ".card-passo",
    perguntasFaq: ".faq-pergunta",
    itensFaq: ".faq-item",
    respostasFaq: ".faq-resposta",
    campoBusca: "#campo-busca",
    listaFaq: ".lista-faq",
    topoFaq: ".faq-topo",
    filtrosTutorial: ".filtros-tutorial",
    logoLink: ".logo-link",
    botoesHero: ".hero-botoes a"
  },
  classes: {
    ativa: "ativa",
    aberto: "aberto",
    sinal: ".sinal",
    oculto: "u-hidden"
  },
  atributos: {
    filtro: "data-filtro",
    grupo: "data-grupo",
    indiceFaq: "data-faq-id"
  },
  textos: {
    sinalAberto: "-",
    sinalFechado: "+",
    filtroPadrao: "todos",
    placeholderBusca: "Pesquisar alguma dúvida...",
    mensagemNenhumResultado: "Nenhuma dúvida encontrada com esse termo. Tenta pesquisar outra palavra.",
    botaoLimparBusca: "Limpar pesquisa",
    botaoAbrirTodas: "Abrir todas",
    botaoFecharTodas: "Fechar todas",
    textoUtilidade: "Essa resposta ajudou?",
    textoSim: "Sim",
    textoNao: "Não",
    textoAgradecimento: "Valeu pelo feedback!"
  },
  atalhos: {
    focarBusca: "/",
    limparBusca: "Escape"
  }
};

const DICIONARIO_SINONIMOS = {
  internet: ["wifi", "wi-fi", "rede", "conexao", "online", "dados", "4g", "5g"],
  celular: ["telefone", "smartphone", "mobile", "android", "iphone", "aparelho", "tela"],
  computador: ["pc", "notebook", "laptop", "desktop", "maquina", "navegador"],
  conta: ["cadastro", "perfil", "usuario", "registrar", "inscricao", "login", "entrar"],
  senha: ["chave", "acesso", "codigo", "seguranca", "credencial"],
  email: ["e-mail", "correio", "endereco", "contato"],
  enquete: ["votacao", "pesquisa", "pergunta", "topico", "opcoes", "alternativas"],
  foto: ["imagem", "figura", "capa", "ilustracao", "arquivo"],
  votar: ["escolher", "clicar", "marcar", "selecionar", "opinar", "participar"],
  sair: ["voltar", "inicio", "home", "fechar", "logo", "pagina inicial"],
  comida: ["lanche", "comer", "fome", "pizza", "hamburguer", "almoco"],
  olhos: ["fechados", "cego", "enxergar", "ver", "visao"],
  botao: ["botoes", "clique", "clicar", "tocar", "toque", "mouse", "dedo"]
};

const METADADOS_PASSOS = [
  {
    id: "passo-1",
    numero: 1,
    grupo: "conta",
    titulo: "Crie sua conta",
    camposNecessarios: ["nome de usuário", "e-mail", "senha"],
    paginaDestino: "cadastro.html",
    obrigatorio: true
  },
  {
    id: "passo-2",
    numero: 2,
    grupo: "conta",
    titulo: "Entre no site",
    camposNecessarios: ["e-mail", "senha"],
    paginaDestino: "login.html",
    obrigatorio: true
  },
  {
    id: "passo-3",
    numero: 3,
    grupo: "enquete",
    titulo: "Coloque o tópico e a descrição",
    camposNecessarios: ["tópico", "descrição"],
    paginaDestino: "criar-enquete.html",
    obrigatorio: true
  },
  {
    id: "passo-4",
    numero: 4,
    grupo: "enquete",
    titulo: "Adicione foto e as opções de voto",
    camposNecessarios: ["opção 1", "opção 2"],
    paginaDestino: "criar-enquete.html",
    obrigatorio: false
  }
];

const METADADOS_FAQ = [
  {
    id: "faq-0",
    tema: "navegacao",
    nivelObviedade: "alto",
    palavrasChave: ["sair", "logo", "voltar", "inicio"]
  },
  {
    id: "faq-1",
    tema: "conexao",
    nivelObviedade: "maximo",
    palavrasChave: ["internet", "online", "conectar", "paginas"]
  },
  {
    id: "faq-2",
    tema: "aparelho",
    nivelObviedade: "maximo",
    palavrasChave: ["desligar", "celular", "pc", "navegador"]
  },
  {
    id: "faq-3",
    tema: "interacao",
    nivelObviedade: "alto",
    palavrasChave: ["clicar", "botoes", "mouse", "tocar"]
  },
  {
    id: "faq-4",
    tema: "humor",
    nivelObviedade: "medio",
    palavrasChave: ["votar", "olhos", "fechados", "errada"]
  },
  {
    id: "faq-5",
    tema: "humor",
    nivelObviedade: "alto",
    palavrasChave: ["comida", "lanche", "enquete", "galera"]
  },
  {
    id: "faq-6",
    tema: "matematica",
    nivelObviedade: "maximo",
    palavrasChave: ["opcoes", "duas", "escolhas", "primeira", "segunda"]
  }
];

const estadoAplicacao = {
  filtroAtual: "todos",
  termoBuscaAtual: "",
  itensAbertos: [],
  votosUtilidade: {},
  historicoAcoes: [],
  dispositivoAtual: "desktop",
  totalPassosVisiveis: 4,
  totalPerguntasVisiveis: 7,
  iniciadoEm: new Date().toISOString()
};

function normalizarTexto(textoOriginal) {
  if (!textoOriginal) {
    return "";
  }

  let texto = String(textoOriginal).toLowerCase().trim();

  texto = texto.replace(/á/g, "a");
  texto = texto.replace(/à/g, "a");
  texto = texto.replace(/â/g, "a");
  texto = texto.replace(/ã/g, "a");
  texto = texto.replace(/ä/g, "a");
  texto = texto.replace(/é/g, "e");
  texto = texto.replace(/è/g, "e");
  texto = texto.replace(/ê/g, "e");
  texto = texto.replace(/ë/g, "e");
  texto = texto.replace(/í/g, "i");
  texto = texto.replace(/ì/g, "i");
  texto = texto.replace(/î/g, "i");
  texto = texto.replace(/ï/g, "i");
  texto = texto.replace(/ó/g, "o");
  texto = texto.replace(/ò/g, "o");
  texto = texto.replace(/ô/g, "o");
  texto = texto.replace(/õ/g, "o");
  texto = texto.replace(/ö/g, "o");
  texto = texto.replace(/ú/g, "u");
  texto = texto.replace(/ù/g, "u");
  texto = texto.replace(/û/g, "u");
  texto = texto.replace(/ü/g, "u");
  texto = texto.replace(/ç/g, "c");
  texto = texto.replace(/ñ/g, "n");

  return texto;
}

function expandirTermosComSinonimos(termoNormalizado) {
  const listaTermos = [];

  if (termoNormalizado.length > 0) {
    listaTermos.push(termoNormalizado);
  }

  const chaves = Object.keys(DICIONARIO_SINONIMOS);

  for (let i = 0; i < chaves.length; i++) {
    const palavraPrincipal = chaves[i];
    const sinonimos = DICIONARIO_SINONIMOS[palavraPrincipal];

    if (palavraPrincipal.includes(termoNormalizado) || termoNormalizado.includes(palavraPrincipal)) {
      if (!listaTermos.includes(palavraPrincipal)) {
        listaTermos.push(palavraPrincipal);
      }
      for (let j = 0; j < sinonimos.length; j++) {
        if (!listaTermos.includes(sinonimos[j])) {
          listaTermos.push(sinonimos[j]);
        }
      }
    }

    for (let k = 0; k < sinonimos.length; k++) {
      const sinonimoAtual = sinonimos[k];
      if (sinonimoAtual.includes(termoNormalizado) || termoNormalizado.includes(sinonimoAtual)) {
        if (!listaTermos.includes(palavraPrincipal)) {
          listaTermos.push(palavraPrincipal);
        }
        for (let m = 0; m < sinonimos.length; m++) {
          if (!listaTermos.includes(sinonimos[m])) {
            listaTermos.push(sinonimos[m]);
          }
        }
      }
    }
  }

  return listaTermos;
}

function salvarEstadoNoNavegador() {
  try {
    const pacoteDados = {
      filtroAtual: estadoAplicacao.filtroAtual,
      itensAbertos: estadoAplicacao.itensAbertos,
      votosUtilidade: estadoAplicacao.votosUtilidade,
      ultimaAtualizacao: new Date().toISOString()
    };
    const textoJson = JSON.stringify(pacoteDados);
    window.localStorage.setItem(CONFIGURACAO_VOCIFY.chaveArmazenamento, textoJson);
  } catch (erro) {
    registrarAcaoUsuario("erro_armazenamento", "Falha ao salvar no localStorage");
  }
}

function carregarEstadoDoNavegador() {
  try {
    const textoSalvo = window.localStorage.getItem(CONFIGURACAO_VOCIFY.chaveArmazenamento);
    if (!textoSalvo) {
      return;
    }

    const dadosConvertidos = JSON.parse(textoSalvo);

    if (dadosConvertidos && typeof dadosConvertidos === "object") {
      if (typeof dadosConvertidos.filtroAtual === "string") {
        estadoAplicacao.filtroAtual = dadosConvertidos.filtroAtual;
      }
      if (Array.isArray(dadosConvertidos.itensAbertos)) {
        estadoAplicacao.itensAbertos = dadosConvertidos.itensAbertos;
      }
      if (dadosConvertidos.votosUtilidade && typeof dadosConvertidos.votosUtilidade === "object") {
        estadoAplicacao.votosUtilidade = dadosConvertidos.votosUtilidade;
      }
    }
  } catch (erro) {
    estadoAplicacao.filtroAtual = CONFIGURACAO_VOCIFY.textos.filtroPadrao;
    estadoAplicacao.itensAbertos = [];
    estadoAplicacao.votosUtilidade = {};
  }
}

function registrarAcaoUsuario(tipoAcao, descricaoAcao) {
  const registro = {
    tipo: tipoAcao,
    descricao: descricaoAcao,
    horario: new Date().toLocaleTimeString("pt-BR")
  };

  estadoAplicacao.historicoAcoes.push(registro);

  if (estadoAplicacao.historicoAcoes.length > CONFIGURACAO_VOCIFY.limiteHistorico) {
    estadoAplicacao.historicoAcoes.shift();
  }
}

function detectarDispositivoAtual() {
  const larguraTela = window.innerWidth;

  if (larguraTela <= CONFIGURACAO_VOCIFY.larguraMobileMax) {
    estadoAplicacao.dispositivoAtual = "mobile";
  } else if (larguraTela <= CONFIGURACAO_VOCIFY.larguraTabletMax) {
    estadoAplicacao.dispositivoAtual = "tablet";
  } else {
    estadoAplicacao.dispositivoAtual = "desktop";
  }

  document.body.setAttribute("data-dispositivo", estadoAplicacao.dispositivoAtual);
}

function criarIndicadorStatusTutorial() {
  const barraFiltros = document.querySelector(CONFIGURACAO_VOCIFY.seletores.filtrosTutorial);
  if (!barraFiltros) {
    return;
  }

  let indicador = document.getElementById("indicador-passos");
  if (!indicador) {
    indicador = document.createElement("span");
    indicador.id = "indicador-passos";
    indicador.style.color = "#a1a1aa";
    indicador.style.fontSize = "13px";
    indicador.style.alignSelf = "center";
    indicador.style.marginLeft = "auto";
    barraFiltros.appendChild(indicador);
  }

  atualizarTextoIndicadorTutorial();
}

function atualizarTextoIndicadorTutorial() {
  const indicador = document.getElementById("indicador-passos");
  if (!indicador) {
    return;
  }

  const total = METADADOS_PASSOS.length;
  const visiveis = estadoAplicacao.totalPassosVisiveis;

  if (visiveis === 1) {
    indicador.textContent = "Mostrando 1 de " + total + " passos";
  } else {
    indicador.textContent = "Mostrando " + visiveis + " de " + total + " passos";
  }
}

function aplicarFiltroTutorial(filtroEscolhido) {
  const botoesFiltro = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.botoesFiltro);
  const cardsPasso = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.cardsPasso);

  estadoAplicacao.filtroAtual = filtroEscolhido;

  for (let i = 0; i < botoesFiltro.length; i++) {
    const botaoAtual = botoesFiltro[i];
    const valorBotao = botaoAtual.getAttribute(CONFIGURACAO_VOCIFY.atributos.filtro);

    if (valorBotao === filtroEscolhido) {
      botaoAtual.classList.add(CONFIGURACAO_VOCIFY.classes.ativa);
      botaoAtual.setAttribute("aria-pressed", "true");
    } else {
      botaoAtual.classList.remove(CONFIGURACAO_VOCIFY.classes.ativa);
      botaoAtual.setAttribute("aria-pressed", "false");
    }
  }

  let contadorVisiveis = 0;

  for (let j = 0; j < cardsPasso.length; j++) {
    const cardAtual = cardsPasso[j];
    const grupoCard = cardAtual.getAttribute(CONFIGURACAO_VOCIFY.atributos.grupo);

    if (filtroEscolhido === "todos" || filtroEscolhido === grupoCard) {
      cardAtual.style.display = "block";
      cardAtual.style.opacity = "1";
      contadorVisiveis = contadorVisiveis + 1;
    } else {
      cardAtual.style.display = "none";
      cardAtual.style.opacity = "0";
    }
  }

  estadoAplicacao.totalPassosVisiveis = contadorVisiveis;
  atualizarTextoIndicadorTutorial();
  salvarEstadoNoNavegador();
  registrarAcaoUsuario("filtro_tutorial", "Filtro alterado para: " + filtroEscolhido);
}

function atualizarListaItensAbertos() {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);
  const novosAbertos = [];

  for (let i = 0; i < itensFaq.length; i++) {
    const item = itensFaq[i];
    const idItem = item.getAttribute(CONFIGURACAO_VOCIFY.atributos.indiceFaq);

    if (item.classList.contains(CONFIGURACAO_VOCIFY.classes.aberto) && idItem) {
      novosAbertos.push(idItem);
    }
  }

  estadoAplicacao.itensAbertos = novosAbertos;
  salvarEstadoNoNavegador();
}

function definirEstadoItemFaq(itemFaq, deveAbrir) {
  if (!itemFaq) {
    return;
  }

  const botaoPergunta = itemFaq.querySelector(CONFIGURACAO_VOCIFY.seletores.perguntasFaq);
  const elementoSinal = itemFaq.querySelector(CONFIGURACAO_VOCIFY.classes.sinal);

  if (deveAbrir) {
    itemFaq.classList.add(CONFIGURACAO_VOCIFY.classes.aberto);
    if (botaoPergunta) {
      botaoPergunta.setAttribute("aria-expanded", "true");
    }
    if (elementoSinal) {
      elementoSinal.textContent = CONFIGURACAO_VOCIFY.textos.sinalAberto;
    }
  } else {
    itemFaq.classList.remove(CONFIGURACAO_VOCIFY.classes.aberto);
    if (botaoPergunta) {
      botaoPergunta.setAttribute("aria-expanded", "false");
    }
    if (elementoSinal) {
      elementoSinal.textContent = CONFIGURACAO_VOCIFY.textos.sinalFechado;
    }
  }
}

function alternarItemFaq(itemFaq) {
  if (!itemFaq) {
    return;
  }

  const jaEstaAberto = itemFaq.classList.contains(CONFIGURACAO_VOCIFY.classes.aberto);
  definirEstadoItemFaq(itemFaq, !jaEstaAberto);
  atualizarListaItensAbertos();

  const idItem = itemFaq.getAttribute(CONFIGURACAO_VOCIFY.atributos.indiceFaq) || "desconhecido";
  registrarAcaoUsuario("clique_faq", "Alternou item " + idItem);
}

function abrirTodasAsPerguntas() {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);

  for (let i = 0; i < itensFaq.length; i++) {
    const item = itensFaq[i];
    if (item.style.display !== "none") {
      definirEstadoItemFaq(item, true);
    }
  }

  atualizarListaItensAbertos();
  registrarAcaoUsuario("abrir_todas", "Todas as perguntas visíveis foram abertas");
}

function fecharTodasAsPerguntas() {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);

  for (let i = 0; i < itensFaq.length; i++) {
    definirEstadoItemFaq(itensFaq[i], false);
  }

  atualizarListaItensAbertos();
  registrarAcaoUsuario("fechar_todas", "Todas as perguntas foram fechadas");
}

function garantirCaixaMensagemVazia() {
  const listaFaq = document.querySelector(CONFIGURACAO_VOCIFY.seletores.listaFaq);
  if (!listaFaq) {
    return null;
  }

  let caixaVazia = document.getElementById("faq-sem-resultados");

  if (!caixaVazia) {
    caixaVazia = document.createElement("div");
    caixaVazia.id = "faq-sem-resultados";
    caixaVazia.style.display = "none";
    caixaVazia.style.backgroundColor = "#141417";
    caixaVazia.style.border = "1px solid #26262b";
    caixaVazia.style.borderRadius = "12px";
    caixaVazia.style.padding = "24px";
    caixaVazia.style.textAlign = "center";
    caixaVazia.style.color = "#a1a1aa";

    const paragrafo = document.createElement("p");
    paragrafo.textContent = CONFIGURACAO_VOCIFY.textos.mensagemNenhumResultado;
    paragrafo.style.marginBottom = "14px";

    const botaoLimpar = document.createElement("button");
    botaoLimpar.type = "button";
    botaoLimpar.textContent = CONFIGURACAO_VOCIFY.textos.botaoLimparBusca;
    botaoLimpar.className = "pill ativa";

    botaoLimpar.addEventListener("click", function () {
      const campoBusca = document.querySelector(CONFIGURACAO_VOCIFY.seletores.campoBusca);
      if (campoBusca) {
        campoBusca.value = "";
        filtrarPerguntasFaq("");
        campoBusca.focus();
      }
    });

    caixaVazia.appendChild(paragrafo);
    caixaVazia.appendChild(botaoLimpar);
    listaFaq.appendChild(caixaVazia);
  }

  return caixaVazia;
}

function filtrarPerguntasFaq(textoDigitadoBruto) {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);
  const termoNormalizado = normalizarTexto(textoDigitadoBruto);
  const termosExpandidos = expandirTermosComSinonimos(termoNormalizado);

  estadoAplicacao.termoBuscaAtual = termoNormalizado;

  let quantidadeVisivel = 0;

  for (let i = 0; i < itensFaq.length; i++) {
    const itemAtual = itensFaq[i];
    const textoItemNormalizado = normalizarTexto(itemAtual.textContent);
    const metadado = METADADOS_FAQ[i];
    let palavrasExtras = "";

    if (metadado && Array.isArray(metadado.palavrasChave)) {
      palavrasExtras = normalizarTexto(metadado.palavrasChave.join(" "));
    }

    const conteudoCompleto = textoItemNormalizado + " " + palavrasExtras;
    let corresponde = false;

    if (termoNormalizado === "") {
      corresponde = true;
    } else {
      for (let j = 0; j < termosExpandidos.length; j++) {
        if (conteudoCompleto.includes(termosExpandidos[j])) {
          corresponde = true;
          break;
        }
      }
    }

    if (corresponde) {
      itemAtual.style.display = "block";
      quantidadeVisivel = quantidadeVisivel + 1;
    } else {
      itemAtual.style.display = "none";
    }
  }

  estadoAplicacao.totalPerguntasVisiveis = quantidadeVisivel;

  const caixaVazia = garantirCaixaMensagemVazia();
  if (caixaVazia) {
    if (quantidadeVisivel === 0) {
      caixaVazia.style.display = "block";
    } else {
      caixaVazia.style.display = "none";
    }
  }

  atualizarContadorPerguntasVisiveis();
}

function atualizarContadorPerguntasVisiveis() {
  const contador = document.getElementById("contador-perguntas-faq");
  if (!contador) {
    return;
  }

  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);
  const total = itensFaq.length;
  const visiveis = estadoAplicacao.totalPerguntasVisiveis;

  contador.textContent = visiveis + " de " + total + " perguntas";
}

function criarControlesExtrasFaq() {
  const topoFaq = document.querySelector(CONFIGURACAO_VOCIFY.seletores.topoFaq);
  if (!topoFaq) {
    return;
  }

  if (document.getElementById("barra-controles-faq")) {
    return;
  }

  const barraControles = document.createElement("div");
  barraControles.id = "barra-controles-faq";
  barraControles.style.display = "flex";
  barraControles.style.alignItems = "center";
  barraControles.style.gap = "10px";
  barraControles.style.flexWrap = "wrap";
  barraControles.style.marginBottom = "18px";

  const contador = document.createElement("span");
  contador.id = "contador-perguntas-faq";
  contador.style.color = "#a1a1aa";
  contador.style.fontSize = "13px";
  contador.style.marginRight = "auto";

  const btnAbrirTodas = document.createElement("button");
  btnAbrirTodas.type = "button";
  btnAbrirTodas.textContent = CONFIGURACAO_VOCIFY.textos.botaoAbrirTodas;
  btnAbrirTodas.className = "pill";
  btnAbrirTodas.addEventListener("click", abrirTodasAsPerguntas);

  const btnFecharTodas = document.createElement("button");
  btnFecharTodas.type = "button";
  btnFecharTodas.textContent = CONFIGURACAO_VOCIFY.textos.botaoFecharTodas;
  btnFecharTodas.className = "pill";
  btnFecharTodas.addEventListener("click", fecharTodasAsPerguntas);

  barraControles.appendChild(contador);
  barraControles.appendChild(btnAbrirTodas);
  barraControles.appendChild(btnFecharTodas);

  topoFaq.insertAdjacentElement("afterend", barraControles);
  atualizarContadorPerguntasVisiveis();
}

function registrarVotoUtilidade(idFaq, tipoVoto, containerBotoes) {
  if (!estadoAplicacao.votosUtilidade[idFaq]) {
    estadoAplicacao.votosUtilidade[idFaq] = {
      sim: 0,
      nao: 0,
      votado: false
    };
  }

  const registro = estadoAplicacao.votosUtilidade[idFaq];

  if (registro.votado) {
    return;
  }

  if (tipoVoto === "sim") {
    registro.sim = registro.sim + 1;
  } else {
    registro.nao = registro.nao + 1;
  }

  registro.votado = true;
  salvarEstadoNoNavegador();
  registrarAcaoUsuario("voto_utilidade", "Votou " + tipoVoto + " no item " + idFaq);

  if (containerBotoes) {
    containerBotoes.innerHTML = "";
    const mensagem = document.createElement("span");
    mensagem.textContent = CONFIGURACAO_VOCIFY.textos.textoAgradecimento;
    mensagem.style.color = "#ff5b00";
    mensagem.style.fontSize = "13px";
    mensagem.style.fontWeight = "bold";
    containerBotoes.appendChild(mensagem);
  }
}

function criarBotoesAvaliacaoNasRespostas() {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);

  for (let i = 0; i < itensFaq.length; i++) {
    const item = itensFaq[i];
    const idFaq = "faq-" + i;
    item.setAttribute(CONFIGURACAO_VOCIFY.atributos.indiceFaq, idFaq);

    const resposta = item.querySelector(CONFIGURACAO_VOCIFY.seletores.respostasFaq);
    if (!resposta) {
      continue;
    }

    if (resposta.querySelector(".caixa-utilidade")) {
      continue;
    }

    const caixaUtilidade = document.createElement("div");
    caixaUtilidade.className = "caixa-utilidade";
    caixaUtilidade.style.marginTop = "14px";
    caixaUtilidade.style.paddingTop = "12px";
    caixaUtilidade.style.borderTop = "1px solid #26262b";
    caixaUtilidade.style.display = "flex";
    caixaUtilidade.style.alignItems = "center";
    caixaUtilidade.style.gap = "10px";
    caixaUtilidade.style.flexWrap = "wrap";

    const votoSalvo = estadoAplicacao.votosUtilidade[idFaq];

    if (votoSalvo && votoSalvo.votado) {
      const mensagemSalva = document.createElement("span");
      mensagemSalva.textContent = CONFIGURACAO_VOCIFY.textos.textoAgradecimento;
      mensagemSalva.style.color = "#ff5b00";
      mensagemSalva.style.fontSize = "13px";
      mensagemSalva.style.fontWeight = "bold";
      caixaUtilidade.appendChild(mensagemSalva);
    } else {
      const textoPergunta = document.createElement("span");
      textoPergunta.textContent = CONFIGURACAO_VOCIFY.textos.textoUtilidade;
      textoPergunta.style.fontSize = "13px";
      textoPergunta.style.color = "#71717a";

      const btnSim = document.createElement("button");
      btnSim.type = "button";
      btnSim.textContent = CONFIGURACAO_VOCIFY.textos.textoSim;
      btnSim.style.backgroundColor = "#18181c";
      btnSim.style.color = "#ffffff";
      btnSim.style.border = "1px solid #26262b";
      btnSim.style.borderRadius = "20px";
      btnSim.style.padding = "4px 14px";
      btnSim.style.fontSize = "12px";

      const btnNao = document.createElement("button");
      btnNao.type = "button";
      btnNao.textContent = CONFIGURACAO_VOCIFY.textos.textoNao;
      btnNao.style.backgroundColor = "#18181c";
      btnNao.style.color = "#ffffff";
      btnNao.style.border = "1px solid #26262b";
      btnNao.style.borderRadius = "20px";
      btnNao.style.padding = "4px 14px";
      btnNao.style.fontSize = "12px";

      btnSim.addEventListener("mouseenter", function () {
        btnSim.style.borderColor = "#ff5b00";
        btnSim.style.color = "#ff5b00";
      });

      btnSim.addEventListener("mouseleave", function () {
        btnSim.style.borderColor = "#26262b";
        btnSim.style.color = "#ffffff";
      });

      btnNao.addEventListener("mouseenter", function () {
        btnNao.style.borderColor = "#ff5b00";
        btnNao.style.color = "#ff5b00";
      });

      btnNao.addEventListener("mouseleave", function () {
        btnNao.style.borderColor = "#26262b";
        btnNao.style.color = "#ffffff";
      });

      btnSim.addEventListener("click", function () {
        registrarVotoUtilidade(idFaq, "sim", caixaUtilidade);
      });

      btnNao.addEventListener("click", function () {
        registrarVotoUtilidade(idFaq, "nao", caixaUtilidade);
      });

      caixaUtilidade.appendChild(textoPergunta);
      caixaUtilidade.appendChild(btnSim);
      caixaUtilidade.appendChild(btnNao);
    }

    resposta.appendChild(caixaUtilidade);
  }
}

function restaurarItensAbertosSalvos() {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);

  for (let i = 0; i < itensFaq.length; i++) {
    const item = itensFaq[i];
    const idItem = item.getAttribute(CONFIGURACAO_VOCIFY.atributos.indiceFaq);

    if (idItem && estadoAplicacao.itensAbertos.includes(idItem)) {
      definirEstadoItemFaq(item, true);
    } else {
      definirEstadoItemFaq(item, false);
    }
  }
}

function configurarAtalhosTeclado() {
  const campoBusca = document.querySelector(CONFIGURACAO_VOCIFY.seletores.campoBusca);

  document.addEventListener("keydown", function (evento) {
    const elementoFocado = document.activeElement;
    const estaDigitando =
      elementoFocado &&
      (elementoFocado.tagName === "INPUT" || elementoFocado.tagName === "TEXTAREA");

    if (evento.key === CONFIGURACAO_VOCIFY.atalhos.focarBusca && !estaDigitando) {
      if (campoBusca) {
        evento.preventDefault();
        campoBusca.focus();
        registrarAcaoUsuario("atalho_teclado", "Focou busca usando barra");
      }
    }

    if (evento.key === CONFIGURACAO_VOCIFY.atalhos.limparBusca) {
      if (campoBusca && document.activeElement === campoBusca) {
        campoBusca.value = "";
        filtrarPerguntasFaq("");
        campoBusca.blur();
        registrarAcaoUsuario("atalho_teclado", "Limpou busca usando Escape");
      }
    }
  });
}

function configurarNavegacaoSuaveHero() {
  const linksHero = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.botoesHero);

  for (let i = 0; i < linksHero.length; i++) {
    const link = linksHero[i];
    link.addEventListener("click", function (evento) {
      const destinoId = link.getAttribute("href");
      if (destinoId && destinoId.startsWith("#")) {
        const secaoDestino = document.querySelector(destinoId);
        if (secaoDestino) {
          evento.preventDefault();
          secaoDestino.scrollIntoView({ behavior: "smooth", block: "start" });
          registrarAcaoUsuario("navegacao_hero", "Rolou até " + destinoId);
        }
      }
    });
  }
}

function configurarEventosPrincipais() {
  const botoesFiltro = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.botoesFiltro);

  for (let i = 0; i < botoesFiltro.length; i++) {
    const botao = botoesFiltro[i];
    botao.addEventListener("click", function () {
      const filtroSelecionado = botao.getAttribute(CONFIGURACAO_VOCIFY.atributos.filtro);
      if (filtroSelecionado) {
        aplicarFiltroTutorial(filtroSelecionado);
      }
    });
  }

  const perguntas = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.perguntasFaq);

  for (let j = 0; j < perguntas.length; j++) {
    const pergunta = perguntas[j];
    pergunta.addEventListener("click", function () {
      const itemPai = pergunta.parentElement;
      alternarItemFaq(itemPai);
    });
  }

  const campoBusca = document.querySelector(CONFIGURACAO_VOCIFY.seletores.campoBusca);
  let temporizadorBusca = null;

  if (campoBusca) {
    campoBusca.addEventListener("input", function () {
      const valorAtual = campoBusca.value;

      if (temporizadorBusca) {
        clearTimeout(temporizadorBusca);
      }

      temporizadorBusca = setTimeout(function () {
        filtrarPerguntasFaq(valorAtual);
      }, CONFIGURACAO_VOCIFY.tempoDebouceBuscaMs);
    });
  }

  const logoLink = document.querySelector(CONFIGURACAO_VOCIFY.seletores.logoLink);
  if (logoLink) {
    logoLink.addEventListener("click", function () {
      registrarAcaoUsuario("saida_pagina", "Clicou na logo para voltar ao início");
    });
  }

  window.addEventListener("resize", function () {
    detectarDispositivoAtual();
  });
}

function inicializarFaqVocify() {
  detectarDispositivoAtual();
  carregarEstadoDoNavegador();
  criarIndicadorStatusTutorial();
  criarControlesExtrasFaq();
  criarBotoesAvaliacaoNasRespostas();
  restaurarItensAbertosSalvos();
  aplicarFiltroTutorial(estadoAplicacao.filtroAtual);
  configurarEventosPrincipais();
  configurarAtalhosTeclado();
  configurarNavegacaoSuaveHero();
  registrarAcaoUsuario("inicializacao", "Página FAQ carregada com sucesso");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarFaqVocify);
} else {
  inicializarFaqVocify();
}
const CONFIGURACAO_VOCIFY = {
  nomeAplicacao: "Vocify",
  versaoPagina: "1.0.0",
  chaveArmazenamento: "vocify_faq_dados_v1",
  limiteHistorico: 50,
  tempoAnimacaoMs: 250,
  tempoDebouceBuscaMs: 120,
  larguraMobileMax: 768,
  larguraTabletMax: 1024,
  seletores: {
    botoesFiltro: ".pill",
    cardsPasso: ".card-passo",
    perguntasFaq: ".faq-pergunta",
    itensFaq: ".faq-item",
    respostasFaq: ".faq-resposta",
    campoBusca: "#campo-busca",
    listaFaq: ".lista-faq",
    topoFaq: ".faq-topo",
    filtrosTutorial: ".filtros-tutorial",
    logoLink: ".logo-link",
    botoesHero: ".hero-botoes a"
  },
  classes: {
    ativa: "ativa",
    aberto: "aberto",
    sinal: ".sinal",
    oculto: "u-hidden"
  },
  atributos: {
    filtro: "data-filtro",
    grupo: "data-grupo",
    indiceFaq: "data-faq-id"
  },
  textos: {
    sinalAberto: "-",
    sinalFechado: "+",
    filtroPadrao: "todos",
    placeholderBusca: "Pesquisar alguma dúvida...",
    mensagemNenhumResultado: "Nenhuma dúvida encontrada com esse termo. Tenta pesquisar outra palavra.",
    botaoLimparBusca: "Limpar pesquisa",
    botaoAbrirTodas: "Abrir todas",
    botaoFecharTodas: "Fechar todas",
    textoUtilidade: "Essa resposta ajudou?",
    textoSim: "Sim",
    textoNao: "Não",
    textoAgradecimento: "Valeu pelo feedback!"
  },
  atalhos: {
    focarBusca: "/",
    limparBusca: "Escape"
  }
};

const DICIONARIO_SINONIMOS = {
  internet: ["wifi", "wi-fi", "rede", "conexao", "online", "dados", "4g", "5g"],
  celular: ["telefone", "smartphone", "mobile", "android", "iphone", "aparelho", "tela"],
  computador: ["pc", "notebook", "laptop", "desktop", "maquina", "navegador"],
  conta: ["cadastro", "perfil", "usuario", "registrar", "inscricao", "login", "entrar"],
  senha: ["chave", "acesso", "codigo", "seguranca", "credencial"],
  email: ["e-mail", "correio", "endereco", "contato"],
  enquete: ["votacao", "pesquisa", "pergunta", "topico", "opcoes", "alternativas"],
  foto: ["imagem", "figura", "capa", "ilustracao", "arquivo"],
  votar: ["escolher", "clicar", "marcar", "selecionar", "opinar", "participar"],
  sair: ["voltar", "inicio", "home", "fechar", "logo", "pagina inicial"],
  comida: ["lanche", "comer", "fome", "pizza", "hamburguer", "almoco"],
  olhos: ["fechados", "cego", "enxergar", "ver", "visao"],
  botao: ["botoes", "clique", "clicar", "tocar", "toque", "mouse", "dedo"]
};

const METADADOS_PASSOS = [
  {
    id: "passo-1",
    numero: 1,
    grupo: "conta",
    titulo: "Crie sua conta",
    camposNecessarios: ["nome de usuário", "e-mail", "senha"],
    paginaDestino: "cadastro.html",
    obrigatorio: true
  },
  {
    id: "passo-2",
    numero: 2,
    grupo: "conta",
    titulo: "Entre no site",
    camposNecessarios: ["e-mail", "senha"],
    paginaDestino: "login.html",
    obrigatorio: true
  },
  {
    id: "passo-3",
    numero: 3,
    grupo: "enquete",
    titulo: "Coloque o tópico e a descrição",
    camposNecessarios: ["tópico", "descrição"],
    paginaDestino: "criar-enquete.html",
    obrigatorio: true
  },
  {
    id: "passo-4",
    numero: 4,
    grupo: "enquete",
    titulo: "Adicione foto e as opções de voto",
    camposNecessarios: ["opção 1", "opção 2"],
    paginaDestino: "criar-enquete.html",
    obrigatorio: false
  }
];

const METADADOS_FAQ = [
  {
    id: "faq-0",
    tema: "navegacao",
    nivelObviedade: "alto",
    palavrasChave: ["sair", "logo", "voltar", "inicio"]
  },
  {
    id: "faq-1",
    tema: "conexao",
    nivelObviedade: "maximo",
    palavrasChave: ["internet", "online", "conectar", "paginas"]
  },
  {
    id: "faq-2",
    tema: "aparelho",
    nivelObviedade: "maximo",
    palavrasChave: ["desligar", "celular", "pc", "navegador"]
  },
  {
    id: "faq-3",
    tema: "interacao",
    nivelObviedade: "alto",
    palavrasChave: ["clicar", "botoes", "mouse", "tocar"]
  },
  {
    id: "faq-4",
    tema: "humor",
    nivelObviedade: "medio",
    palavrasChave: ["votar", "olhos", "fechados", "errada"]
  },
  {
    id: "faq-5",
    tema: "humor",
    nivelObviedade: "alto",
    palavrasChave: ["comida", "lanche", "enquete", "galera"]
  },
  {
    id: "faq-6",
    tema: "matematica",
    nivelObviedade: "maximo",
    palavrasChave: ["opcoes", "duas", "escolhas", "primeira", "segunda"]
  }
];

const estadoAplicacao = {
  filtroAtual: "todos",
  termoBuscaAtual: "",
  itensAbertos: [],
  votosUtilidade: {},
  historicoAcoes: [],
  dispositivoAtual: "desktop",
  totalPassosVisiveis: 4,
  totalPerguntasVisiveis: 7,
  iniciadoEm: new Date().toISOString()
};

function normalizarTexto(textoOriginal) {
  if (!textoOriginal) {
    return "";
  }

  let texto = String(textoOriginal).toLowerCase().trim();

  texto = texto.replace(/á/g, "a");
  texto = texto.replace(/à/g, "a");
  texto = texto.replace(/â/g, "a");
  texto = texto.replace(/ã/g, "a");
  texto = texto.replace(/ä/g, "a");
  texto = texto.replace(/é/g, "e");
  texto = texto.replace(/è/g, "e");
  texto = texto.replace(/ê/g, "e");
  texto = texto.replace(/ë/g, "e");
  texto = texto.replace(/í/g, "i");
  texto = texto.replace(/ì/g, "i");
  texto = texto.replace(/î/g, "i");
  texto = texto.replace(/ï/g, "i");
  texto = texto.replace(/ó/g, "o");
  texto = texto.replace(/ò/g, "o");
  texto = texto.replace(/ô/g, "o");
  texto = texto.replace(/õ/g, "o");
  texto = texto.replace(/ö/g, "o");
  texto = texto.replace(/ú/g, "u");
  texto = texto.replace(/ù/g, "u");
  texto = texto.replace(/û/g, "u");
  texto = texto.replace(/ü/g, "u");
  texto = texto.replace(/ç/g, "c");
  texto = texto.replace(/ñ/g, "n");

  return texto;
}

function expandirTermosComSinonimos(termoNormalizado) {
  const listaTermos = [];

  if (termoNormalizado.length > 0) {
    listaTermos.push(termoNormalizado);
  }

  const chaves = Object.keys(DICIONARIO_SINONIMOS);

  for (let i = 0; i < chaves.length; i++) {
    const palavraPrincipal = chaves[i];
    const sinonimos = DICIONARIO_SINONIMOS[palavraPrincipal];

    if (palavraPrincipal.includes(termoNormalizado) || termoNormalizado.includes(palavraPrincipal)) {
      if (!listaTermos.includes(palavraPrincipal)) {
        listaTermos.push(palavraPrincipal);
      }
      for (let j = 0; j < sinonimos.length; j++) {
        if (!listaTermos.includes(sinonimos[j])) {
          listaTermos.push(sinonimos[j]);
        }
      }
    }

    for (let k = 0; k < sinonimos.length; k++) {
      const sinonimoAtual = sinonimos[k];
      if (sinonimoAtual.includes(termoNormalizado) || termoNormalizado.includes(sinonimoAtual)) {
        if (!listaTermos.includes(palavraPrincipal)) {
          listaTermos.push(palavraPrincipal);
        }
        for (let m = 0; m < sinonimos.length; m++) {
          if (!listaTermos.includes(sinonimos[m])) {
            listaTermos.push(sinonimos[m]);
          }
        }
      }
    }
  }

  return listaTermos;
}

function salvarEstadoNoNavegador() {
  try {
    const pacoteDados = {
      filtroAtual: estadoAplicacao.filtroAtual,
      itensAbertos: estadoAplicacao.itensAbertos,
      votosUtilidade: estadoAplicacao.votosUtilidade,
      ultimaAtualizacao: new Date().toISOString()
    };
    const textoJson = JSON.stringify(pacoteDados);
    window.localStorage.setItem(CONFIGURACAO_VOCIFY.chaveArmazenamento, textoJson);
  } catch (erro) {
    registrarAcaoUsuario("erro_armazenamento", "Falha ao salvar no localStorage");
  }
}

function carregarEstadoDoNavegador() {
  try {
    const textoSalvo = window.localStorage.getItem(CONFIGURACAO_VOCIFY.chaveArmazenamento);
    if (!textoSalvo) {
      return;
    }

    const dadosConvertidos = JSON.parse(textoSalvo);

    if (dadosConvertidos && typeof dadosConvertidos === "object") {
      if (typeof dadosConvertidos.filtroAtual === "string") {
        estadoAplicacao.filtroAtual = dadosConvertidos.filtroAtual;
      }
      if (Array.isArray(dadosConvertidos.itensAbertos)) {
        estadoAplicacao.itensAbertos = dadosConvertidos.itensAbertos;
      }
      if (dadosConvertidos.votosUtilidade && typeof dadosConvertidos.votosUtilidade === "object") {
        estadoAplicacao.votosUtilidade = dadosConvertidos.votosUtilidade;
      }
    }
  } catch (erro) {
    estadoAplicacao.filtroAtual = CONFIGURACAO_VOCIFY.textos.filtroPadrao;
    estadoAplicacao.itensAbertos = [];
    estadoAplicacao.votosUtilidade = {};
  }
}

function registrarAcaoUsuario(tipoAcao, descricaoAcao) {
  const registro = {
    tipo: tipoAcao,
    descricao: descricaoAcao,
    horario: new Date().toLocaleTimeString("pt-BR")
  };

  estadoAplicacao.historicoAcoes.push(registro);

  if (estadoAplicacao.historicoAcoes.length > CONFIGURACAO_VOCIFY.limiteHistorico) {
    estadoAplicacao.historicoAcoes.shift();
  }
}

function detectarDispositivoAtual() {
  const larguraTela = window.innerWidth;

  if (larguraTela <= CONFIGURACAO_VOCIFY.larguraMobileMax) {
    estadoAplicacao.dispositivoAtual = "mobile";
  } else if (larguraTela <= CONFIGURACAO_VOCIFY.larguraTabletMax) {
    estadoAplicacao.dispositivoAtual = "tablet";
  } else {
    estadoAplicacao.dispositivoAtual = "desktop";
  }

  document.body.setAttribute("data-dispositivo", estadoAplicacao.dispositivoAtual);
}

function criarIndicadorStatusTutorial() {
  const barraFiltros = document.querySelector(CONFIGURACAO_VOCIFY.seletores.filtrosTutorial);
  if (!barraFiltros) {
    return;
  }

  let indicador = document.getElementById("indicador-passos");
  if (!indicador) {
    indicador = document.createElement("span");
    indicador.id = "indicador-passos";
    indicador.style.color = "#a1a1aa";
    indicador.style.fontSize = "13px";
    indicador.style.alignSelf = "center";
    indicador.style.marginLeft = "auto";
    barraFiltros.appendChild(indicador);
  }

  atualizarTextoIndicadorTutorial();
}

function atualizarTextoIndicadorTutorial() {
  const indicador = document.getElementById("indicador-passos");
  if (!indicador) {
    return;
  }

  const total = METADADOS_PASSOS.length;
  const visiveis = estadoAplicacao.totalPassosVisiveis;

  if (visiveis === 1) {
    indicador.textContent = "Mostrando 1 de " + total + " passos";
  } else {
    indicador.textContent = "Mostrando " + visiveis + " de " + total + " passos";
  }
}

function aplicarFiltroTutorial(filtroEscolhido) {
  const botoesFiltro = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.botoesFiltro);
  const cardsPasso = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.cardsPasso);

  estadoAplicacao.filtroAtual = filtroEscolhido;

  for (let i = 0; i < botoesFiltro.length; i++) {
    const botaoAtual = botoesFiltro[i];
    const valorBotao = botaoAtual.getAttribute(CONFIGURACAO_VOCIFY.atributos.filtro);

    if (valorBotao === filtroEscolhido) {
      botaoAtual.classList.add(CONFIGURACAO_VOCIFY.classes.ativa);
      botaoAtual.setAttribute("aria-pressed", "true");
    } else {
      botaoAtual.classList.remove(CONFIGURACAO_VOCIFY.classes.ativa);
      botaoAtual.setAttribute("aria-pressed", "false");
    }
  }

  let contadorVisiveis = 0;

  for (let j = 0; j < cardsPasso.length; j++) {
    const cardAtual = cardsPasso[j];
    const grupoCard = cardAtual.getAttribute(CONFIGURACAO_VOCIFY.atributos.grupo);

    if (filtroEscolhido === "todos" || filtroEscolhido === grupoCard) {
      cardAtual.style.display = "block";
      cardAtual.style.opacity = "1";
      contadorVisiveis = contadorVisiveis + 1;
    } else {
      cardAtual.style.display = "none";
      cardAtual.style.opacity = "0";
    }
  }

  estadoAplicacao.totalPassosVisiveis = contadorVisiveis;
  atualizarTextoIndicadorTutorial();
  salvarEstadoNoNavegador();
  registrarAcaoUsuario("filtro_tutorial", "Filtro alterado para: " + filtroEscolhido);
}

function atualizarListaItensAbertos() {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);
  const novosAbertos = [];

  for (let i = 0; i < itensFaq.length; i++) {
    const item = itensFaq[i];
    const idItem = item.getAttribute(CONFIGURACAO_VOCIFY.atributos.indiceFaq);

    if (item.classList.contains(CONFIGURACAO_VOCIFY.classes.aberto) && idItem) {
      novosAbertos.push(idItem);
    }
  }

  estadoAplicacao.itensAbertos = novosAbertos;
  salvarEstadoNoNavegador();
}

function definirEstadoItemFaq(itemFaq, deveAbrir) {
  if (!itemFaq) {
    return;
  }

  const botaoPergunta = itemFaq.querySelector(CONFIGURACAO_VOCIFY.seletores.perguntasFaq);
  const elementoSinal = itemFaq.querySelector(CONFIGURACAO_VOCIFY.classes.sinal);

  if (deveAbrir) {
    itemFaq.classList.add(CONFIGURACAO_VOCIFY.classes.aberto);
    if (botaoPergunta) {
      botaoPergunta.setAttribute("aria-expanded", "true");
    }
    if (elementoSinal) {
      elementoSinal.textContent = CONFIGURACAO_VOCIFY.textos.sinalAberto;
    }
  } else {
    itemFaq.classList.remove(CONFIGURACAO_VOCIFY.classes.aberto);
    if (botaoPergunta) {
      botaoPergunta.setAttribute("aria-expanded", "false");
    }
    if (elementoSinal) {
      elementoSinal.textContent = CONFIGURACAO_VOCIFY.textos.sinalFechado;
    }
  }
}

function alternarItemFaq(itemFaq) {
  if (!itemFaq) {
    return;
  }

  const jaEstaAberto = itemFaq.classList.contains(CONFIGURACAO_VOCIFY.classes.aberto);
  definirEstadoItemFaq(itemFaq, !jaEstaAberto);
  atualizarListaItensAbertos();

  const idItem = itemFaq.getAttribute(CONFIGURACAO_VOCIFY.atributos.indiceFaq) || "desconhecido";
  registrarAcaoUsuario("clique_faq", "Alternou item " + idItem);
}

function abrirTodasAsPerguntas() {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);

  for (let i = 0; i < itensFaq.length; i++) {
    const item = itensFaq[i];
    if (item.style.display !== "none") {
      definirEstadoItemFaq(item, true);
    }
  }

  atualizarListaItensAbertos();
  registrarAcaoUsuario("abrir_todas", "Todas as perguntas visíveis foram abertas");
}

function fecharTodasAsPerguntas() {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);

  for (let i = 0; i < itensFaq.length; i++) {
    definirEstadoItemFaq(itensFaq[i], false);
  }

  atualizarListaItensAbertos();
  registrarAcaoUsuario("fechar_todas", "Todas as perguntas foram fechadas");
}

function garantirCaixaMensagemVazia() {
  const listaFaq = document.querySelector(CONFIGURACAO_VOCIFY.seletores.listaFaq);
  if (!listaFaq) {
    return null;
  }

  let caixaVazia = document.getElementById("faq-sem-resultados");

  if (!caixaVazia) {
    caixaVazia = document.createElement("div");
    caixaVazia.id = "faq-sem-resultados";
    caixaVazia.style.display = "none";
    caixaVazia.style.backgroundColor = "#141417";
    caixaVazia.style.border = "1px solid #26262b";
    caixaVazia.style.borderRadius = "12px";
    caixaVazia.style.padding = "24px";
    caixaVazia.style.textAlign = "center";
    caixaVazia.style.color = "#a1a1aa";

    const paragrafo = document.createElement("p");
    paragrafo.textContent = CONFIGURACAO_VOCIFY.textos.mensagemNenhumResultado;
    paragrafo.style.marginBottom = "14px";

    const botaoLimpar = document.createElement("button");
    botaoLimpar.type = "button";
    botaoLimpar.textContent = CONFIGURACAO_VOCIFY.textos.botaoLimparBusca;
    botaoLimpar.className = "pill ativa";

    botaoLimpar.addEventListener("click", function () {
      const campoBusca = document.querySelector(CONFIGURACAO_VOCIFY.seletores.campoBusca);
      if (campoBusca) {
        campoBusca.value = "";
        filtrarPerguntasFaq("");
        campoBusca.focus();
      }
    });

    caixaVazia.appendChild(paragrafo);
    caixaVazia.appendChild(botaoLimpar);
    listaFaq.appendChild(caixaVazia);
  }

  return caixaVazia;
}

function filtrarPerguntasFaq(textoDigitadoBruto) {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);
  const termoNormalizado = normalizarTexto(textoDigitadoBruto);
  const termosExpandidos = expandirTermosComSinonimos(termoNormalizado);

  estadoAplicacao.termoBuscaAtual = termoNormalizado;

  let quantidadeVisivel = 0;

  for (let i = 0; i < itensFaq.length; i++) {
    const itemAtual = itensFaq[i];
    const textoItemNormalizado = normalizarTexto(itemAtual.textContent);
    const metadado = METADADOS_FAQ[i];
    let palavrasExtras = "";

    if (metadado && Array.isArray(metadado.palavrasChave)) {
      palavrasExtras = normalizarTexto(metadado.palavrasChave.join(" "));
    }

    const conteudoCompleto = textoItemNormalizado + " " + palavrasExtras;
    let corresponde = false;

    if (termoNormalizado === "") {
      corresponde = true;
    } else {
      for (let j = 0; j < termosExpandidos.length; j++) {
        if (conteudoCompleto.includes(termosExpandidos[j])) {
          corresponde = true;
          break;
        }
      }
    }

    if (corresponde) {
      itemAtual.style.display = "block";
      quantidadeVisivel = quantidadeVisivel + 1;
    } else {
      itemAtual.style.display = "none";
    }
  }

  estadoAplicacao.totalPerguntasVisiveis = quantidadeVisivel;

  const caixaVazia = garantirCaixaMensagemVazia();
  if (caixaVazia) {
    if (quantidadeVisivel === 0) {
      caixaVazia.style.display = "block";
    } else {
      caixaVazia.style.display = "none";
    }
  }

  atualizarContadorPerguntasVisiveis();
}

function atualizarContadorPerguntasVisiveis() {
  const contador = document.getElementById("contador-perguntas-faq");
  if (!contador) {
    return;
  }

  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);
  const total = itensFaq.length;
  const visiveis = estadoAplicacao.totalPerguntasVisiveis;

  contador.textContent = visiveis + " de " + total + " perguntas";
}

function criarControlesExtrasFaq() {
  const topoFaq = document.querySelector(CONFIGURACAO_VOCIFY.seletores.topoFaq);
  if (!topoFaq) {
    return;
  }

  if (document.getElementById("barra-controles-faq")) {
    return;
  }

  const barraControles = document.createElement("div");
  barraControles.id = "barra-controles-faq";
  barraControles.style.display = "flex";
  barraControles.style.alignItems = "center";
  barraControles.style.gap = "10px";
  barraControles.style.flexWrap = "wrap";
  barraControles.style.marginBottom = "18px";

  const contador = document.createElement("span");
  contador.id = "contador-perguntas-faq";
  contador.style.color = "#a1a1aa";
  contador.style.fontSize = "13px";
  contador.style.marginRight = "auto";

  const btnAbrirTodas = document.createElement("button");
  btnAbrirTodas.type = "button";
  btnAbrirTodas.textContent = CONFIGURACAO_VOCIFY.textos.botaoAbrirTodas;
  btnAbrirTodas.className = "pill";
  btnAbrirTodas.addEventListener("click", abrirTodasAsPerguntas);

  const btnFecharTodas = document.createElement("button");
  btnFecharTodas.type = "button";
  btnFecharTodas.textContent = CONFIGURACAO_VOCIFY.textos.botaoFecharTodas;
  btnFecharTodas.className = "pill";
  btnFecharTodas.addEventListener("click", fecharTodasAsPerguntas);

  barraControles.appendChild(contador);
  barraControles.appendChild(btnAbrirTodas);
  barraControles.appendChild(btnFecharTodas);

  topoFaq.insertAdjacentElement("afterend", barraControles);
  atualizarContadorPerguntasVisiveis();
}

function registrarVotoUtilidade(idFaq, tipoVoto, containerBotoes) {
  if (!estadoAplicacao.votosUtilidade[idFaq]) {
    estadoAplicacao.votosUtilidade[idFaq] = {
      sim: 0,
      nao: 0,
      votado: false
    };
  }

  const registro = estadoAplicacao.votosUtilidade[idFaq];

  if (registro.votado) {
    return;
  }

  if (tipoVoto === "sim") {
    registro.sim = registro.sim + 1;
  } else {
    registro.nao = registro.nao + 1;
  }

  registro.votado = true;
  salvarEstadoNoNavegador();
  registrarAcaoUsuario("voto_utilidade", "Votou " + tipoVoto + " no item " + idFaq);

  if (containerBotoes) {
    containerBotoes.innerHTML = "";
    const mensagem = document.createElement("span");
    mensagem.textContent = CONFIGURACAO_VOCIFY.textos.textoAgradecimento;
    mensagem.style.color = "#ff5b00";
    mensagem.style.fontSize = "13px";
    mensagem.style.fontWeight = "bold";
    containerBotoes.appendChild(mensagem);
  }
}

function criarBotoesAvaliacaoNasRespostas() {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);

  for (let i = 0; i < itensFaq.length; i++) {
    const item = itensFaq[i];
    const idFaq = "faq-" + i;
    item.setAttribute(CONFIGURACAO_VOCIFY.atributos.indiceFaq, idFaq);

    const resposta = item.querySelector(CONFIGURACAO_VOCIFY.seletores.respostasFaq);
    if (!resposta) {
      continue;
    }

    if (resposta.querySelector(".caixa-utilidade")) {
      continue;
    }

    const caixaUtilidade = document.createElement("div");
    caixaUtilidade.className = "caixa-utilidade";
    caixaUtilidade.style.marginTop = "14px";
    caixaUtilidade.style.paddingTop = "12px";
    caixaUtilidade.style.borderTop = "1px solid #26262b";
    caixaUtilidade.style.display = "flex";
    caixaUtilidade.style.alignItems = "center";
    caixaUtilidade.style.gap = "10px";
    caixaUtilidade.style.flexWrap = "wrap";

    const votoSalvo = estadoAplicacao.votosUtilidade[idFaq];

    if (votoSalvo && votoSalvo.votado) {
      const mensagemSalva = document.createElement("span");
      mensagemSalva.textContent = CONFIGURACAO_VOCIFY.textos.textoAgradecimento;
      mensagemSalva.style.color = "#ff5b00";
      mensagemSalva.style.fontSize = "13px";
      mensagemSalva.style.fontWeight = "bold";
      caixaUtilidade.appendChild(mensagemSalva);
    } else {
      const textoPergunta = document.createElement("span");
      textoPergunta.textContent = CONFIGURACAO_VOCIFY.textos.textoUtilidade;
      textoPergunta.style.fontSize = "13px";
      textoPergunta.style.color = "#71717a";

      const btnSim = document.createElement("button");
      btnSim.type = "button";
      btnSim.textContent = CONFIGURACAO_VOCIFY.textos.textoSim;
      btnSim.style.backgroundColor = "#18181c";
      btnSim.style.color = "#ffffff";
      btnSim.style.border = "1px solid #26262b";
      btnSim.style.borderRadius = "20px";
      btnSim.style.padding = "4px 14px";
      btnSim.style.fontSize = "12px";

      const btnNao = document.createElement("button");
      btnNao.type = "button";
      btnNao.textContent = CONFIGURACAO_VOCIFY.textos.textoNao;
      btnNao.style.backgroundColor = "#18181c";
      btnNao.style.color = "#ffffff";
      btnNao.style.border = "1px solid #26262b";
      btnNao.style.borderRadius = "20px";
      btnNao.style.padding = "4px 14px";
      btnNao.style.fontSize = "12px";

      btnSim.addEventListener("mouseenter", function () {
        btnSim.style.borderColor = "#ff5b00";
        btnSim.style.color = "#ff5b00";
      });

      btnSim.addEventListener("mouseleave", function () {
        btnSim.style.borderColor = "#26262b";
        btnSim.style.color = "#ffffff";
      });

      btnNao.addEventListener("mouseenter", function () {
        btnNao.style.borderColor = "#ff5b00";
        btnNao.style.color = "#ff5b00";
      });

      btnNao.addEventListener("mouseleave", function () {
        btnNao.style.borderColor = "#26262b";
        btnNao.style.color = "#ffffff";
      });

      btnSim.addEventListener("click", function () {
        registrarVotoUtilidade(idFaq, "sim", caixaUtilidade);
      });

      btnNao.addEventListener("click", function () {
        registrarVotoUtilidade(idFaq, "nao", caixaUtilidade);
      });

      caixaUtilidade.appendChild(textoPergunta);
      caixaUtilidade.appendChild(btnSim);
      caixaUtilidade.appendChild(btnNao);
    }

    resposta.appendChild(caixaUtilidade);
  }
}

function restaurarItensAbertosSalvos() {
  const itensFaq = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.itensFaq);

  for (let i = 0; i < itensFaq.length; i++) {
    const item = itensFaq[i];
    const idItem = item.getAttribute(CONFIGURACAO_VOCIFY.atributos.indiceFaq);

    if (idItem && estadoAplicacao.itensAbertos.includes(idItem)) {
      definirEstadoItemFaq(item, true);
    } else {
      definirEstadoItemFaq(item, false);
    }
  }
}

function configurarAtalhosTeclado() {
  const campoBusca = document.querySelector(CONFIGURACAO_VOCIFY.seletores.campoBusca);

  document.addEventListener("keydown", function (evento) {
    const elementoFocado = document.activeElement;
    const estaDigitando =
      elementoFocado &&
      (elementoFocado.tagName === "INPUT" || elementoFocado.tagName === "TEXTAREA");

    if (evento.key === CONFIGURACAO_VOCIFY.atalhos.focarBusca && !estaDigitando) {
      if (campoBusca) {
        evento.preventDefault();
        campoBusca.focus();
        registrarAcaoUsuario("atalho_teclado", "Focou busca usando barra");
      }
    }

    if (evento.key === CONFIGURACAO_VOCIFY.atalhos.limparBusca) {
      if (campoBusca && document.activeElement === campoBusca) {
        campoBusca.value = "";
        filtrarPerguntasFaq("");
        campoBusca.blur();
        registrarAcaoUsuario("atalho_teclado", "Limpou busca usando Escape");
      }
    }
  });
}

function configurarNavegacaoSuaveHero() {
  const linksHero = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.botoesHero);

  for (let i = 0; i < linksHero.length; i++) {
    const link = linksHero[i];
    link.addEventListener("click", function (evento) {
      const destinoId = link.getAttribute("href");
      if (destinoId && destinoId.startsWith("#")) {
        const secaoDestino = document.querySelector(destinoId);
        if (secaoDestino) {
          evento.preventDefault();
          secaoDestino.scrollIntoView({ behavior: "smooth", block: "start" });
          registrarAcaoUsuario("navegacao_hero", "Rolou até " + destinoId);
        }
      }
    });
  }
}

function configurarEventosPrincipais() {
  const botoesFiltro = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.botoesFiltro);

  for (let i = 0; i < botoesFiltro.length; i++) {
    const botao = botoesFiltro[i];
    botao.addEventListener("click", function () {
      const filtroSelecionado = botao.getAttribute(CONFIGURACAO_VOCIFY.atributos.filtro);
      if (filtroSelecionado) {
        aplicarFiltroTutorial(filtroSelecionado);
      }
    });
  }

  const perguntas = document.querySelectorAll(CONFIGURACAO_VOCIFY.seletores.perguntasFaq);

  for (let j = 0; j < perguntas.length; j++) {
    const pergunta = perguntas[j];
    pergunta.addEventListener("click", function () {
      const itemPai = pergunta.parentElement;
      alternarItemFaq(itemPai);
    });
  }

  const campoBusca = document.querySelector(CONFIGURACAO_VOCIFY.seletores.campoBusca);
  let temporizadorBusca = null;

  if (campoBusca) {
    campoBusca.addEventListener("input", function () {
      const valorAtual = campoBusca.value;

      if (temporizadorBusca) {
        clearTimeout(temporizadorBusca);
      }

      temporizadorBusca = setTimeout(function () {
        filtrarPerguntasFaq(valorAtual);
      }, CONFIGURACAO_VOCIFY.tempoDebouceBuscaMs);
    });
  }

  const logoLink = document.querySelector(CONFIGURACAO_VOCIFY.seletores.logoLink);
  if (logoLink) {
    logoLink.addEventListener("click", function () {
      registrarAcaoUsuario("saida_pagina", "Clicou na logo para voltar ao início");
    });
  }

  window.addEventListener("resize", function () {
    detectarDispositivoAtual();
  });
}

function inicializarFaqVocify() {
  detectarDispositivoAtual();
  carregarEstadoDoNavegador();
  criarIndicadorStatusTutorial();
  criarControlesExtrasFaq();
  criarBotoesAvaliacaoNasRespostas();
  restaurarItensAbertosSalvos();
  aplicarFiltroTutorial(estadoAplicacao.filtroAtual);
  configurarEventosPrincipais();
  configurarAtalhosTeclado();
  configurarNavegacaoSuaveHero();
  registrarAcaoUsuario("inicializacao", "Página FAQ carregada com sucesso");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarFaqVocify);
} else {
  inicializarFaqVocify();
}
