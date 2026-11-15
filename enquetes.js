
// =====================================
// CARREGAR ENQUETES DO BANCO DE DADOS
// =====================================

const listaEnquetes = document.getElementById("listaEnquetes");
const filtroCategoria = document.getElementById("filtroCategoria");
const mensagemVazia = document.getElementById("mensagemVazia");

let enquetes = [];


// =====================================
// MOSTRAR ENQUETES
// =====================================

function mostrarEnquetes() {

    listaEnquetes.innerHTML = "";

    const categoriaEscolhida = filtroCategoria.value;

    const enquetesFiltradas = enquetes.filter(function (enquete) {

        if (categoriaEscolhida === "todas") {
            return true;
        }

        return enquete.categoria === categoriaEscolhida;
    });

    if (enquetesFiltradas.length === 0) {
        mensagemVazia.hidden = false;
        return;
    }

    mensagemVazia.hidden = true;

    enquetesFiltradas.forEach(function (enquete) {

        const cartao = document.createElement("article");
        cartao.style.cursor = "pointer";

        cartao.addEventListener("click", function () {
            window.location.href = `Ver-enquete.html?id=${enquete.id}`;
        });cartao.style.cursor = "pointer";

        cartao.addEventListener("click", function () {
            window.location.href = `Ver-enquete.html?id=${enquete.id}`;
        });
        
        cartao.classList.add("cartao-enquete");

        if (enquete.imagem) {

            const imagem = document.createElement("img");
            imagem.src = enquete.imagem;
            imagem.alt = "Imagem da enquete";

            cartao.appendChild(imagem);
        }

        const conteudo = document.createElement("div");
        conteudo.classList.add("conteudo-cartao");

        const categoria = document.createElement("span");
        categoria.classList.add("categoria-enquete");

        categoria.textContent = enquete.categoria;
        categoria.style.backgroundColor = enquete.cor_categoria;

        const titulo = document.createElement("h2");
        titulo.textContent = enquete.titulo;

        const descricao = document.createElement("p");
        descricao.textContent = enquete.descricao || "Sem descrição.";

        conteudo.appendChild(categoria);
        conteudo.appendChild(titulo);
        conteudo.appendChild(descricao);

        cartao.appendChild(conteudo);

        listaEnquetes.appendChild(cartao);

    });

}


// =====================================
// CARREGAR CATEGORIAS NO FILTRO
// =====================================

function carregarCategorias() {

    const textoTodas =
        filtroCategoria.querySelector('option[value="todas"]')?.textContent
        || "Todas as categorias";

    filtroCategoria.innerHTML = "";

    const opcaoTodas = document.createElement("option");
    opcaoTodas.value = "todas";
    opcaoTodas.textContent = textoTodas;

    filtroCategoria.appendChild(opcaoTodas);

    const categorias = [];

    enquetes.forEach(function (enquete) {

        const nome = enquete.categoria;

        if (!categorias.includes(nome)) {
            categorias.push(nome);
        }

    });

    categorias.forEach(function (nome) {

        const opcao = document.createElement("option");

        opcao.value = nome;
        opcao.textContent = nome;

        filtroCategoria.appendChild(opcao);

    });

}


// =====================================
// BUSCAR ENQUETES NA API
// =====================================

async function carregarEnquetes() {

    try {

        const resposta = await fetch("api/listar-enquetes.php");

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as enquetes.");
        }

        enquetes = await resposta.json();

        carregarCategorias();
        mostrarEnquetes();

    } catch (erro) {

        console.error("Erro ao carregar enquetes:", erro);

        mensagemVazia.hidden = false;
        mensagemVazia.textContent = "Não foi possível carregar as enquetes.";

    }

}


// =====================================
// FILTRAR ENQUETES
// =====================================

filtroCategoria.addEventListener("change", function () {
    mostrarEnquetes();
});


// =====================================
// INICIALIZAÇÃO
// =====================================

carregarEnquetes();
