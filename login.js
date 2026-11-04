
const formLogin = document.getElementById("formLogin");


formLogin.addEventListener("submit", function(event) {

    
    event.preventDefault();

   
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Verifica se os campos foram preenchidos
    if (email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

   
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    
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