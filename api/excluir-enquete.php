<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/../config/conexao.php";

$idUsuario = $_SESSION["usuario_id"] ?? null;

if (!$idUsuario) {
    http_response_code(401);
    echo json_encode(["mensagem" => "Faça login para excluir uma enquete."]);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);
$id = filter_var($dados["id"] ?? null, FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    http_response_code(400);
    echo json_encode(["mensagem" => "ID de enquete inválido."]);
    exit;
}

try {
    $conexao->begin_transaction();

    $sql = "SELECT usuario_id FROM enquetes WHERE id = ? FOR UPDATE";
    $comando = $conexao->prepare($sql);
    $comando->bind_param("i", $id);
    $comando->execute();

    $resultado = $comando->get_result();
    $enquete = $resultado->fetch_assoc();

    $comando->close();

    if (!$enquete) {
        $conexao->rollback();
        http_response_code(404);
        echo json_encode(["mensagem" => "Enquete não encontrada."]);
        exit;
    }

    if ((int) $enquete["usuario_id"] !== (int) $idUsuario) {
        $conexao->rollback();
        http_response_code(403);
        echo json_encode(["mensagem" => "Você não tem permissão para excluir esta enquete."]);
        exit;
    }

    $sql = "DELETE FROM votos WHERE enquete_id = ?";
    $comando = $conexao->prepare($sql);
    $comando->bind_param("i", $id);
    $comando->execute();
    $comando->close();

    $sql = "DELETE FROM alternativas WHERE enquete_id = ?";
    $comando = $conexao->prepare($sql);
    $comando->bind_param("i", $id);
    $comando->execute();
    $comando->close();

    $sql = "DELETE FROM enquetes WHERE id = ?";
    $comando = $conexao->prepare($sql);
    $comando->bind_param("i", $id);
    $comando->execute();
    $comando->close();

    $conexao->commit();

    echo json_encode([
        "mensagem" => "Enquete excluída com sucesso!"
    ]);

} catch (Throwable $erro) {
    $conexao->rollback();

    http_response_code(500);

    echo json_encode([
        "mensagem" => "Não foi possível excluir a enquete."
    ]);
}

$conexao->close();

?>
