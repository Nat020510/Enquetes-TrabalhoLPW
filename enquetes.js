
// =====================================
// CARREGAR ENQUETES
// =====================================

const listaEnquetes = document.getElementById("listaEnquetes");
const filtroCategoria = document.getElementById("filtroCategoria");
const mensagemVazia = document.getElementById("mensagemVazia");

let enquetes = JSON.parse(
    localStorage.getItem("vocify_enquetes")
) || [];


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

        return enquete.categoria.nome === categoriaEscolhida;
    });


    if (enquetesFiltradas.length === 0) {
        mensagemVazia.hidden = false;
        return;
    }

    mensagemVazia.hidden = true;


    enquetesFiltradas.forEach(function (enquete) {

        const cartao = document.createElement("article");
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

        categoria.textContent = enquete.categoria.nome;
        categoria.style.backgroundColor = enquete.categoria.cor;


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

    const categorias = [];

    enquetes.forEach(function (enquete) {

        const nome = enquete.categoria.nome;

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
// FILTRAR ENQUETES
// =====================================

filtroCategoria.addEventListener("change", function () {
    mostrarEnquetes();
});


// =====================================
// INICIALIZAÇÃO
// =====================================

carregarCategorias();
mostrarEnquetes();

