
const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (nome === "" || email === "" || senha === "") {
        alert("Preencha todos os campos!");
        return;
    }

    
    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    
    const usuarioExiste = usuarios.some(function(usuario) {
        return usuario.email === email;
    });

    if (usuarioExiste) {
        alert("Este e-mail já está cadastrado!");
        return;
    }

 
    usuarios.push({
        nome: nome,
        email: email,
        senha: senha
    });

   
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso!");

    formCadastro.reset();
});