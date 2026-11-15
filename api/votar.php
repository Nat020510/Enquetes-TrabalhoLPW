
<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/conexao.php";


if (!isset($_SESSION["usuario_id"])) {
    http_response_code(401);

    echo json_encode([
        "mensagem" => "Você precisa entrar na sua conta para votar."
    ]);

    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "mensagem" => "Método não permitido."
    ]);

    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

$idEnquete = filter_var(
    $dados["enquete_id"] ?? null,
    FILTER_VALIDATE_INT
);

$idAlternativa = filter_var(
    $dados["alternativa_id"] ?? null,
    FILTER_VALIDATE_INT
);

$idUsuario = $_SESSION["usuario_id"];

if (!$idEnquete || !$idAlternativa) {
    http_response_code(400);

    echo json_encode([
        "mensagem" => "Dados de votação inválidos."
    ]);

    exit;
}

$sql = "INSERT INTO votos (enquete_id, alternativa_id, usuario_id)
        SELECT ?, a.id, ?
        FROM alternativas a
        WHERE a.id = ?
        AND a.enquete_id = ?";

$comando = $conexao->prepare($sql);

$comando->bind_param(
    "iiii",
    $idEnquete,
    $idUsuario,
    $idAlternativa,
    $idEnquete
);

if ($comando->execute()) {

    if ($comando->affected_rows === 1) {

        echo json_encode([
            "sucesso" => true,
            "mensagem" => "Voto registrado com sucesso!"
        ]);
    } 
    
    else {

        http_response_code(400);

        echo json_encode([
            "mensagem" => "Alternativa inválida para esta enquete."
        ]);
    }
} 

else {

    if ($comando->errno === 1062) {

        http_response_code(409);

        echo json_encode([
            "mensagem" => "Você já votou nesta enquete."
        ]);

    } else {

        http_response_code(500);

        echo json_encode([
            "mensagem" => "Não foi possível registrar seu voto."
        ]);

    }

}

$comando->close();
$conexao->close();

?>
