
<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/conexao.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["mensagem" => "Método não permitido."]);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

$nome = trim($dados["nome"] ?? "");
$email = trim($dados["email"] ?? "");
$senha = $dados["senha"] ?? "";

if ($nome === "" || $email === "" || $senha === "") {
    http_response_code(400);
    echo json_encode(["mensagem" => "Preencha todos os campos."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["mensagem" => "E-mail inválido."]);
    exit;
}

if (strlen($senha) < 8) {
    http_response_code(400);
    echo json_encode(["mensagem" => "A senha deve ter pelo menos 8 caracteres."]);
    exit;
}

$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (nome, email, senha_hash)
        VALUES (?, ?, ?)";

$comando = $conexao->prepare($sql);

$comando->bind_param("sss", $nome, $email, $senhaHash);

if ($comando->execute()) {
    http_response_code(201);
    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Cadastro realizado com sucesso!"
    ]);
} else {
    if ($comando->errno === 1062) {
        http_response_code(409);
        echo json_encode([
            "mensagem" => "Este e-mail já está cadastrado."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "mensagem" => "Não foi possível realizar o cadastro."
        ]);
    }
}

$comando->close();
$conexao->close();

?>
