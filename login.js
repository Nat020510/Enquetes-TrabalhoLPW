// Seleciona o formulário de login
const formLogin = document.getElementById("formLogin");

// Detecta quando o usuário clica em Entrar
formLogin.addEventListener("submit", function(event) {

    // Impede o recarregamento da página
    event.preventDefault();

    // Captura os valores digitados
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Verifica se os campos foram preenchidos
    if (email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    alert("Formulário preenchido com sucesso!");
});