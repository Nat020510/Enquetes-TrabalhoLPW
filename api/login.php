<?php

header("Content-Type: application/json; charset=utf-8");

session_set_cookie_params([
    "httponly" => true,
    "samesite" => "Lax",
    "secure" => false
]);

session_start();

require_once __DIR__ . "/../config/conexao.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["mensagem" => "Método não permitido."]);
    exit;
}

// Recebe os dados enviados pelo JavaScript
$dados = json_decode(file_get_contents("php://input"), true);

$email = trim($dados["email"] ?? "");
$senha = $dados["senha"] ?? "";

if ($email === "" || $senha === "") {
    http_response_code(400);
    echo json_encode(["mensagem" => "Preencha todos os campos."]);
    exit;
}

$sql = "SELECT id, nome, email, senha_hash
        FROM usuarios
        WHERE email = ?";

$comando = $conexao->prepare($sql);
$comando->bind_param("s", $email);
$comando->execute();

$resultado = $comando->get_result();
$usuario = $resultado->fetch_assoc();

if (!$usuario || !password_verify($senha, $usuario["senha_hash"])) {
    http_response_code(401);
    echo json_encode(["mensagem" => "E-mail ou senha incorretos."]);
    exit;
}

// Cria uma nova identificação para a sessão
session_regenerate_id(true);

$_SESSION["usuario_id"] = $usuario["id"];
$_SESSION["usuario_nome"] = $usuario["nome"];
$_SESSION["usuario_email"] = $usuario["email"];

echo json_encode([
    "sucesso" => true,
    "mensagem" => "Login realizado com sucesso!",
    "usuario" => [
        "nome" => $usuario["nome"],
        "email" => $usuario["email"]
    ]
]);

$comando->close();
$conexao->close();

?>