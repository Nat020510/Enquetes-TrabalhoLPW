
<?php

$host = "sql307.infinityfree.com";
$banco = "if0_43456996_vocify";
$usuario = "if0_43456996";
$senha = "iPQN9i7RU26OOG";

try {
    $conexao = new PDO(
        "mysql:host=$host;dbname=$banco;charset=utf8mb4",
        $usuario,
        $senha
    );

    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $erro) {
    http_response_code(500);
    die("Erro ao conectar ao banco de dados.");
}
?>
