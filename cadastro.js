
const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch("api/cadastrar.php", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome: nome,
                email: email,
                senha: senha
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            alert(resultado.mensagem);
            return;
        }

        alert(resultado.mensagem);
        formCadastro.reset();

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar ao servidor.");
    }
});
