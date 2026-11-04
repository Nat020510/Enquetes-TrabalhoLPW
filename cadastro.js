// Seleciona o formulário
const formCadastro = document.getElementById("formCadastro");

// Detecta o envio do formulário
formCadastro.addEventListener("submit", function(event) {

    // Impede o recarregamento da página
    event.preventDefault();

    // Captura os dados digitados
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Verifica se os campos estão preenchidos
    if (nome === "" || email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    alert("Dados preenchidos com sucesso!");
});