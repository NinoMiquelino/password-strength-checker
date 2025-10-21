<?php
// Configura o cabeçalho para retornar JSON
header('Content-Type: application/json');

// Captura e decodifica o payload JSON do frontend
$input = file_get_contents('php://input');
$data = json_decode($input, true);

$password = $data['password'] ?? null;
$confirmPassword = $data['confirmPassword'] ?? null;

// --- Funções de Validação e HIBP ---

/**
 * Verifica se a senha atende aos requisitos de força.
 */
function verificarForcaSenha($senha) {
    // Requisito: Não pode conter espaços
    if (strpos($senha, ' ') !== false) {
        return false;
    }
    
    $temMaiusculas = preg_match('/[A-Z]/', $senha);
    $temMinusculas = preg_match('/[a-z]/', $senha);
    $temNumeros = preg_match('/[0-9]/', $senha);
    // Escape de alguns caracteres na regex para segurança
    $temCaracteresEspeciais = preg_match('/[!@#$%^&*(),.?":{}|<>]/', $senha);
    $comprimentoValido = strlen($senha) >= 8 && strlen($senha) <= 20;

    return $temMaiusculas && $temMinusculas && $temNumeros && $temCaracteresEspeciais && $comprimentoValido;
}

/**
 * Consulta a API Have I Been Pwned (HIBP) para verificar se a senha foi comprometida.
 * Utiliza o protocolo K-Anonymity para segurança.
 * @param string $password A senha a ser verificada (em texto simples).
 * @return array Um array com 'compromised' (bool) e 'count' (int), e 'api_error' (bool) se houver falha.
 */
function isPasswordCompromised(string $password): array {
    // Adição de verificação crucial: A extensão cURL deve estar carregada
    if (!extension_loaded('curl')) {
        error_log("Erro Fatal: A extensão cURL não está carregada. A consulta HIBP falhou.");
        return [
            'compromised' => false, 
            'count' => 0, 
            'api_error' => true, 
            'error_message' => 'Extensão cURL não está carregada no PHP.'
        ];
    }

    // 1. Hash a senha usando SHA-1
    $hashedPassword = strtoupper(sha1($password));
    
    // 2. Divida o hash em prefixo (5 caracteres) e sufixo
    $prefix = substr($hashedPassword, 0, 5);
    $suffix = substr($hashedPassword, 5);

    // URL da API HIBP com o prefixo
    $url = "https://api.pwnedpasswords.com/range/$prefix";

    // 3. Solicitação à API usando cURL
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'PasswordCheckerApp/1.0'); 
    curl_setopt($ch, CURLOPT_TIMEOUT, 10); 
    $response = curl_exec($ch);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        // Se a chamada cURL falhar (ex: problema de rede, timeout)
        error_log("Erro ao acessar a API HIBP: " . $curlError);
        return [
            'compromised' => false, 
            'count' => 0, 
            'api_error' => true, 
            'error_message' => 'Falha na chamada cURL: ' . $curlError
        ];
    }

    // 4. Verifica se o sufixo está nos resultados
    $lines = explode("\n", $response);
    foreach ($lines as $line) {
        if (strpos($line, ':') === false) continue;
        
        list($foundSuffix, $count) = explode(':', trim($line));
        
        if ($suffix === $foundSuffix) {
            // Senha comprometida encontrada
            return ['compromised' => true, 'count' => (int)$count];
        }
    }

    // 5. Nenhuma correspondência encontrada
    return ['compromised' => false, 'count' => 0];
}

// --- Lógica Principal do Backend ---

$response = [
    'success' => false,
    'passedChecks' => false,
    'compromised' => false,
    'message' => 'Erro interno no servidor.',
];

// 1. Validação de presença
if (empty($password) || empty($confirmPassword)) {
    $response['message'] = "Os campos de senha e confirmação são obrigatórios.";
    echo json_encode($response);
    exit;
}

// 2. Validação de correspondência (Server-side)
if ($password !== $confirmPassword) {
    $response['message'] = "A senha e a confirmação não coincidem.";
    echo json_encode($response);
    exit;
}

// 3. Validação de Força (Server-side)
if (!verificarForcaSenha($password)) {
    $response['message'] = "A senha não atende aos requisitos (8-20 caracteres, maiúsculas, minúsculas, números e especiais, sem espaços).";
    echo json_encode($response);
    exit;
}

try {
    // 4. Consulta HIBP
    $hibpResult = isPasswordCompromised($password);
    
    // TRATAMENTO DA RESPOSTA CORRIGIDO
    if (isset($hibpResult['api_error']) && $hibpResult['api_error']) {
         $response['success'] = true;
         $response['message'] = "A verificação de força passou, mas houve um erro ao consultar o banco de dados de vazamentos: " . ($hibpResult['error_message'] ?? 'Verifique se o cURL está ativo.');
         $response['passedChecks'] = true;
         $response['compromised'] = false; // Não podemos confirmar
    }
    else if ($hibpResult['compromised']) {
        $response['success'] = true;
        $response['compromised'] = true;
        $response['passedChecks'] = true;
        $response['message'] = "Esta senha foi encontrada em vazamentos de dados ${hibpResult['count']} vezes. ESCOLHA OUTRA.";
    } else {
        // Passou em todas as verificações
        $response['success'] = true;
        $response['passedChecks'] = true;
        $response['message'] = "Sua senha é forte e não foi encontrada em vazamentos públicos conhecidos.";
    }

} catch (Exception $e) {
    // Erro inesperado na lógica
    error_log("Erro durante a verificação HIBP: " . $e->getMessage());
    $response['message'] = "Erro inesperado durante a verificação de segurança.";
}

echo json_encode($response);
?>