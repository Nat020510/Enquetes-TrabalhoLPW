
(function (document, Vocify) {
    "use strict";

    const { Autenticacao, UI, PAGINAS } = Vocify;

    const LIMITE_DESTAQUES = 6;
    const OPCOES_NO_HERO = 3;

    const listaCategorias = document.getElementById("lista-categorias");
    const listaDestaques = document.getElementById("lista-destaques");

    let enquetes = [];
    let categoriaSelecionada = "todas";

    function totalVotos(enquete) {
        return (enquete.opcoes || []).reduce(function (soma, opcao) {
            return soma + Number(opcao.votos || 0);
        }, 0);
    }

    function ordenarPorVotos(lista) {
        return lista.slice().sort(function (a, b) {
            return totalVotos(b) - totalVotos(a);
        });
    }

    // HERO
    function animarBarras() {
        const barras = document.querySelectorAll(".barra__preenchimento");

        requestAnimationFrame(function () {
            barras.forEach(function (barra) {
                barra.style.width = `${barra.dataset.largura}%`;
            });
        });
    }

    function criarBarra(opcao, total) {
        const votos = Number(opcao.votos || 0);
        const porcentagem = total > 0
            ? Math.round((votos / total) * 100)
            : 0;

        const preenchimento = UI.criar("span", {
            classe: "barra__preenchimento"
        });

        preenchimento.dataset.largura = porcentagem;

        return UI.criar("div", { classe: "barra" }, [
            UI.criar("span", {
                classe: "barra__rotulo",
                texto: opcao.texto
            }),
            UI.criar("span", { classe: "barra__trilho" }, [
                preenchimento
            ]),
            UI.criar("span", {
                classe: "barra__pct",
                texto: `${porcentagem}%`
            })
        ]);
    }

    function renderizarHero() {
        const cartao = document.getElementById("hero-resultado");
        const maisVotada = ordenarPorVotos(enquetes)[0];

        if (!maisVotada || !maisVotada.opcoes?.length) {
            cartao.hidden = true;
            return;
        }

        const total = totalVotos(maisVotada);

        document.getElementById("hero-pergunta").textContent =
            maisVotada.titulo;

        document.getElementById("hero-barras").replaceChildren(
            ...maisVotada.opcoes
                .slice(0, OPCOES_NO_HERO)
                .map(function (opcao) {
                    return criarBarra(opcao, total);
                })
        );

        cartao.hidden = false;
        animarBarras();
    }

    // ESTATÍSTICAS
    function renderizarEstatisticas() {
        const categorias = [...new Set(
            enquetes.map(function (enquete) {
                return enquete.categoria;
            })
        )];

        const valores = {
            enquetes: enquetes.length,
            votos: enquetes.reduce(function (soma, enquete) {
                return soma + totalVotos(enquete);
            }, 0),
            categorias: categorias.length
        };

        document.querySelectorAll("[data-estatistica]").forEach(
            function (elemento) {
                elemento.textContent =
                    valores[elemento.dataset.estatistica].toLocaleString("pt-BR");
            }
        );
    }

    // CATEGORIAS
    function criarChip(rotulo, cor) {
        const chip = UI.criar("button", {
            classe: "chip",
            texto: rotulo,
            atributos: {
                type: "button",
                "aria-pressed": String(rotulo === categoriaSelecionada),
                "data-categoria": rotulo
            }
        });

        if (cor) {
            chip.style.setProperty("--cor-cat", cor);
        }

        return chip;
    }

    function renderizarCategorias() {
        const categorias = [];

        enquetes.forEach(function (enquete) {
            const nome = enquete.categoria;

            if (!categorias.some(function (categoria) {
                return categoria.nome === nome;
            })) {
                categorias.push({
                    nome: nome,
                    cor: enquete.cor_categoria
                });
            }
        });

        listaCategorias.replaceChildren(
            criarChip("Todas", null),
            ...categorias.map(function (categoria) {
                return criarChip(categoria.nome, categoria.cor);
            })
        );
    }

    function aoClicarCategoria(evento) {
        const chip = evento.target.closest(".chip");
        if (!chip) return;

        categoriaSelecionada = chip.dataset.categoria;

        listaCategorias.querySelectorAll(".chip").forEach(
            function (item) {
                item.setAttribute(
                    "aria-pressed",
                    String(item === chip)
                );
            }
        );

        renderizarDestaques();
    }

    // ENQUETES EM DESTAQUE
    function criarCardEnquete(enquete) {
        const card = UI.criar("a", {
            classe: "card card--interativo enquete-card",
            atributos: {
                href: `Ver-enquete.html?id=${encodeURIComponent(enquete.id)}`
            }
        });

        if (enquete.imagem) {
            const imagem = UI.criar("img", {
                atributos: {
                    src: enquete.imagem,
                    alt: "Imagem da enquete"
                }
            });

            card.append(imagem);
        }

        const categoria = UI.criar("span", {
            classe: "etiqueta",
            texto: enquete.categoria
        });

        if (enquete.cor_categoria) {
            categoria.style.setProperty(
                "--cor-cat",
                enquete.cor_categoria
            );
        }

        const titulo = UI.criar("h3", {
            classe: "enquete-card__titulo",
            texto: enquete.titulo
        });

        const descricao = UI.criar("p", {
            texto: enquete.descricao || "Sem descrição."
        });

        const autor = UI.criar("span", {
            texto: `Por ${enquete.autor}`
        });

        const total = totalVotos(enquete);

        const rodape = UI.criar("div", {
            classe: "enquete-card__rodape"
        }, [
            UI.criar("span", {
                texto: `${total.toLocaleString("pt-BR")} ${total === 1 ? "voto" : "votos"}`
            }),
            UI.criar("span", {
                classe: "enquete-card__ir",
                texto: "Participar"
            })
        ]);

        card.append(categoria, titulo, descricao, autor, rodape);

        if (enquete.cor) {
            card.style.setProperty("--cor-cat", enquete.cor);
        }

        return card;
    }

    function renderizarDestaques() {
        const destaques = ordenarPorVotos(
            enquetes.filter(function (enquete) {
                return categoriaSelecionada === "todas" ||
                    enquete.categoria === categoriaSelecionada;
            })
        ).slice(0, LIMITE_DESTAQUES);

        if (destaques.length === 0) {
            listaDestaques.replaceChildren(
                UI.criar("div", {
                    classe: "estado-vazio"
                }, [
                    UI.criar("p", {
                        texto: "Nenhuma enquete nesta categoria ainda."
                    }),
                    UI.criar("a", {
                        classe: "link-ver-todas",
                        texto: "Criar a primeira enquete",
                        atributos: {
                            href: PAGINAS.criar
                        }
                    })
                ])
            );

            return;
        }

        listaDestaques.replaceChildren(
            ...destaques.map(criarCardEnquete)
        );
    }

    // CHAMADA FINAL
    function ajustarChamadaFinal() {
        const sessao = Autenticacao.sessaoAtual();
        const titulo = document.getElementById("cta-titulo");
        const botaoCadastro = document.getElementById("cta-cadastro");

        titulo.textContent = sessao
            ? `Bora, ${sessao.nome.split(" ")[0]}? Sua enquete está esperando.`
            : "Sua opinião merece um palco.";

        botaoCadastro.hidden = Boolean(sessao);
    }

    // CARREGAMENTO DO BANCO DE DADOS
    async function carregarEnquetes() {
        try {
            const resposta = await fetch("api/listar-enquetes.php");

            if (!resposta.ok) {
                throw new Error("Não foi possível carregar as enquetes.");
            }

            enquetes = await resposta.json();

            renderizarHero();
            renderizarEstatisticas();
            renderizarCategorias();
            renderizarDestaques();

        } catch (erro) {
            console.error("Erro ao carregar enquetes:", erro);

            listaDestaques.replaceChildren(
                UI.criar("p", {
                    texto: "Não foi possível carregar as enquetes."
                })
            );
        }
    }

    // INICIALIZAÇÃO
    function iniciar() {
        listaCategorias.addEventListener("click", aoClicarCategoria);

        ajustarChamadaFinal();
        carregarEnquetes();

        document.addEventListener(
            "vocify:sessao",
            ajustarChamadaFinal
        );
    }

    iniciar();

})(document, window.Vocify);
