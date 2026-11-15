
<?php

header("Content-Type: application/json; charset=utf-8");

session_set_cookie_params([
    "httponly" => true,
    "samesite" => "Lax",
    "secure" => false
]);

session_start();

require_once __DIR__ . "/../config/conexao.php";

if (!isset($_SESSION["usuario_id"])) {
    http_response_code(401);
    echo json_encode(["mensagem" => "Faça login para publicar uma enquete."]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["mensagem" => "Método não permitido."]);
    exit;
}

$dados = json_decode(file_get_contents("php://input"), true);

$titulo = trim($dados["titulo"] ?? "");
$descricao = trim($dados["descricao"] ?? "");
$categoria = trim($dados["categoria"] ?? "");
$cor = $dados["cor"] ?? "#ff6a13";
$opcoes = $dados["opcoes"] ?? [];
$imagem = $dados["imagem"] ?? null;

if ($titulo === "" || $categoria === "" || !is_array($opcoes)) {
    http_response_code(400);
    echo json_encode(["mensagem" => "Preencha os campos obrigatórios."]);
    exit;
}

if (count($opcoes) < 2 || count($opcoes) > 10) {
    http_response_code(400);
    echo json_encode(["mensagem" => "A enquete deve ter de 2 a 10 alternativas."]);
    exit;
}

foreach ($opcoes as $opcao) {
    if (!is_string($opcao) || trim($opcao) === "") {
        http_response_code(400);
        echo json_encode(["mensagem" => "Preencha todas as alternativas."]);
        exit;
    }
}

if (!preg_match('/^#[0-9a-fA-F]{6}$/', $cor)) {
    http_response_code(400);
    echo json_encode(["mensagem" => "Cor inválida."]);
    exit;
}

if ($imagem !== null) {
    if (!is_string($imagem) ||
        !preg_match('/^data:image\/(jpeg|png|gif|webp);base64,/', $imagem)) {
        http_response_code(400);
        echo json_encode(["mensagem" => "Formato de imagem inválido."]);
        exit;
    }

    $conteudoImagem = substr($imagem, strpos($imagem, ",") + 1);
    $imagemDecodificada = base64_decode($conteudoImagem, true);

    if ($imagemDecodificada === false ||
        strlen($imagemDecodificada) > 3 * 1024 * 1024 ||
        getimagesizefromstring($imagemDecodificada) === false) {
        http_response_code(400);
        echo json_encode(["mensagem" => "Imagem inválida ou maior que 3 MB."]);
        exit;
    }
}

try {
    $usuarioId = $_SESSION["usuario_id"];

    // Busca a categoria no banco
    $sqlCategoria = "SELECT id FROM categorias WHERE nome = ?";
    $comandoCategoria = $conexao->prepare($sqlCategoria);
    $comandoCategoria->bind_param("s", $categoria);
    $comandoCategoria->execute();

    $resultadoCategoria = $comandoCategoria->get_result();
    $categoriaEncontrada = $resultadoCategoria->fetch_assoc();
    $comandoCategoria->close();

    if (!$categoriaEncontrada) {
        http_response_code(400);
        echo json_encode(["mensagem" => "Categoria não encontrada."]);
        exit;
    }

    $categoriaId = $categoriaEncontrada["id"];

    $conexao->begin_transaction();

    $sqlEnquete = "INSERT INTO enquetes
        (usuario_id, categoria_id, titulo, descricao, imagem, cor)
        VALUES (?, ?, ?, ?, ?, ?)";

    $comandoEnquete = $conexao->prepare($sqlEnquete);
    $comandoEnquete->bind_param(
        "iissss",
        $usuarioId,
        $categoriaId,
        $titulo,
        $descricao,
        $imagem,
        $cor
    );

    $comandoEnquete->execute();

    $enqueteId = $conexao->insert_id;
    $comandoEnquete->close();

    $sqlOpcao = "INSERT INTO alternativas (enquete_id, texto, ordem)
                 VALUES (?, ?, ?)";

    $comandoOpcao = $conexao->prepare($sqlOpcao);

    foreach ($opcoes as $indice => $textoOpcao) {
        $textoOpcao = trim($textoOpcao);
        $ordem = $indice + 1;

        $comandoOpcao->bind_param("isi", $enqueteId, $textoOpcao, $ordem);
        $comandoOpcao->execute();
    }

    $comandoOpcao->close();

    $conexao->commit();

    http_response_code(201);
    echo json_encode([
        "sucesso" => true,
        "mensagem" => "Enquete publicada com sucesso!",
        "id" => $enqueteId
    ]);

} catch (Throwable $erro) {
    $conexao->rollback();

    error_log($erro->getMessage());

    http_response_code(500);
    echo json_encode([
        "mensagem" => "Não foi possível publicar a enquete."
    ]);
}

$conexao->close();

?>
