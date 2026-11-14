<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/conexao.php";

$sql = "SELECT
            e.id,
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
        ORDER BY e.criada_em DESC";

$resultado = $conexao->query($sql);

if (!$resultado) {
    http_response_code(500);
    echo json_encode([
        "mensagem" => "Não foi possível listar as enquetes."
    ]);
    exit;
}

$enquetes = [];

while ($enquete = $resultado->fetch_assoc()) {

    $id = $enquete["id"];

    $sqlAlternativas = "SELECT id, texto, ordem
                        FROM alternativas
                        WHERE enquete_id = ?
                        ORDER BY ordem";

    $comando = $conexao->prepare($sqlAlternativas);
    $comando->bind_param("i", $id);
    $comando->execute();

    $resultadoAlternativas = $comando->get_result();

    $alternativas = [];

    while ($alternativa = $resultadoAlternativas->fetch_assoc()) {
        $alternativas[] = $alternativa;
    }

    $comando->close();

    $enquete["opcoes"] = $alternativas;
    $enquetes[] = $enquete;
}

echo json_encode($enquetes, JSON_UNESCAPED_UNICODE);

$conexao->close();

?>