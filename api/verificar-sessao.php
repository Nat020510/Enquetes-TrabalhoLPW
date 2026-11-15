<?php

header("Content-Type: application/json; charset=utf-8");

session_set_cookie_params([
    "httponly" => true,
    "samesite" => "Lax",
    "secure" => false
]);

session_start();

if (isset($_SESSION["usuario_id"])) {
    echo json_encode([
        "logado" => true,
        "usuario" => [
            "id" => $_SESSION["usuario_id"],
            "nome" => $_SESSION["usuario_nome"],
            "email" => $_SESSION["usuario_email"]
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        "logado" => false,
        "mensagem" => "Usuário não está logado."
    ]);
}

?>