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

    // Recupera os usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Procura um usuário com o e-mail e a senha informados
    const usuarioEncontrado = usuarios.find(function(usuario) {
        return usuario.email === email && usuario.senha === senha;
    });

    if (usuarioEncontrado) {
    alert("Login realizado com sucesso! Bem-vindo(a), " + usuarioEncontrado.nome + "!");

    window.location.href = "index.html";
} else {
    alert("E-mail ou senha incorretos!");
}
});