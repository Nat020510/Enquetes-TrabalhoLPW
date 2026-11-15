
const formVotacao = document.getElementById("formVotacao");

formVotacao.addEventListener("submit", function(event) {
    event.preventDefault();

    const opcaoSelecionada = document.querySelector(
        'input[name="opcao"]:checked'
    );

    if (!opcaoSelecionada) {
        alert("Selecione uma opção antes de votar!");
        return;
    }

    alert("Você selecionou: " + opcaoSelecionada.value);
});
