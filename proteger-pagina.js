async function verificarLogin() {
    try {
        const resposta = await fetch("api/verificar-sessao.php");

        if (!resposta.ok) {
            window.location.href = "login.html";
            return;
        }

        const resultado = await resposta.json();

        if (!resultado.logado) {
            window.location.href = "login.html";
        }

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível verificar sua sessão.");
    }
}

verificarLogin();