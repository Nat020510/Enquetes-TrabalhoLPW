
<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/conexao.php";

$idUsuario = $_SESSION["usuario_id"] ?? null;


// =====================================
// RECEBER ID DA ENQUETE
// =====================================

$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    http_response_code(400);
    echo json_encode(["mensagem" => "ID de enquete inválido."]);
    exit;
}


// =====================================
// BUSCAR DADOS DA ENQUETE
// =====================================

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

if (!$enquete) {
    http_response_code(404);

    echo json_encode([
        "mensagem" => "Enquete não encontrada."
    ]);

    $conexao->close();
    exit;
}


// =====================================
// VERIFICAR SE O USUÁRIO É O AUTOR
// =====================================

$enquete["eh_autor"] = (
    $idUsuario !== null &&
    (int) $idUsuario === (int) $enquete["usuario_id"]
);


// =====================================
// VERIFICAR SE JÁ VOTOU
// =====================================

$enquete["ja_votou"] = false;

if ($idUsuario !== null) {

    $sqlVoto = "SELECT id
                FROM votos
                WHERE enquete_id = ?
                AND usuario_id = ?";

    $comando = $conexao->prepare($sqlVoto);

    $comando->bind_param("ii", $id, $idUsuario);
    $comando->execute();

    $resultadoVoto = $comando->get_result();

    $enquete["ja_votou"] = $resultadoVoto->num_rows > 0;

    $comando->close();

}


// =====================================
// BUSCAR ALTERNATIVAS E VOTOS
// =====================================

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
$totalVotos = 0;

while ($opcao = $resultadoAlternativas->fetch_assoc()) {

    $opcao["votos"] = (int) $opcao["votos"];

    $totalVotos += $opcao["votos"];

    $opcoes[] = $opcao;

}

$comando->close();


// =====================================
// FINALIZAR RESPOSTA
// =====================================

$enquete["opcoes"] = $opcoes;
$enquete["total_votos"] = $totalVotos;

echo json_encode($enquete, JSON_UNESCAPED_UNICODE);

$conexao->close();

?>
