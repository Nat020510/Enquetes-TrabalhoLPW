
<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/conexao.php";

// Recebe o ID da enquete
$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    http_response_code(400);
    echo json_encode(["mensagem" => "ID de enquete inválido."]);
    exit;
}

// Busca os dados da enquete
$sql = "SELECT
            e.id,
            e.usuario_id,
            e.titulo,
            e.descricao,
            e.imagem,
            e.cor,
            e.criada_em,
            c.nome AS categoria,
            c.cor AS cor_categoria,
            u.nome AS autor
        FROM enquetes e
        INNER JOIN categorias c ON e.categoria_id = c.id
        INNER JOIN usuarios u ON e.usuario_id = u.id
        WHERE e.id = ?";

$comando = $conexao->prepare($sql);
$comando->bind_param("i", $id);
$comando->execute();

$resultado = $comando->get_result();
$enquete = $resultado->fetch_assoc();
$comando->close();

// Verifica se a enquete existe
if (!$enquete) {
    http_response_code(404);
    echo json_encode(["mensagem" => "Enquete não encontrada."]);
    $conexao->close();
    exit;
}

// Busca as alternativas e a quantidade de votos
$sqlAlternativas = "SELECT
                        a.id,
                        a.texto,
                        a.ordem,
                        COUNT(v.id) AS votos
                    FROM alternativas a
                    LEFT JOIN votos v
                        ON v.alternativa_id = a.id
                        AND v.enquete_id = a.enquete_id
                    WHERE a.enquete_id = ?
                    GROUP BY a.id, a.texto, a.ordem
                    ORDER BY a.ordem";

$comando = $conexao->prepare($sqlAlternativas);
$comando->bind_param("i", $id);
$comando->execute();

$resultadoAlternativas = $comando->get_result();

$opcoes = [];

while ($opcao = $resultadoAlternativas->fetch_assoc()) {
    $opcoes[] = $opcao;
}

$comando->close();

$enquete["opcoes"] = $opcoes;

echo json_encode($enquete, JSON_UNESCAPED_UNICODE);

$conexao->close();

?>
