
        // Variáveis de elementos
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        const matchError = document.getElementById('matchError');
        const checkButton = document.getElementById('checkButton');
        const statusMessage = document.getElementById('statusMessage');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const buttonText = document.getElementById('buttonText');

        // Estado da validação de correspondência (true = senhas são iguais)
        let passwordsMatch = false;

        /**
         * 1. Lógica de Validação Estrita (Critérios OBRIGATÓRIOS)
         * Retorna um objeto booleano para cada requisito.
         */
        function checkStrictRequirements(senha) {
            const hasSpace = /\s/.test(senha);
            return {
                isLengthValid: senha.length >= 8 && senha.length <= 20,
                hasLowercase: /[a-z]/.test(senha),
                hasUppercase: /[A-Z]/.test(senha),
                hasNumber: /[0-9]/.test(senha),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
                noSpaces: !hasSpace,
                // Apenas se todos forem true
                allMet: !hasSpace && senha.length >= 8 && senha.length <= 20 &&
                        /[a-z]/.test(senha) && /[A-Z]/.test(senha) &&
                        /[0-9]/.test(senha) && /[!@#$%^&*(),.?":{}|<>]/.test(senha)
            };
        }

        /**
         * 2. Lógica de Força Visual (Pontuação)
         * Verifica a senha em tempo real e retorna uma pontuação de 0 a 4.
         */
        function getPasswordStrengthScore(senha) {
            let score = 0;
            if (senha.length >= 8) score++;
            if (/[A-Z]/.test(senha)) score++;
            if (/[a-z]/.test(senha)) score++;
            if (/[0-9]/.test(senha)) score++;
            if (/[!@#$%^&*(),.?":{}|<>]/.test(senha)) score++;
            return Math.min(score, 4); 
        }

        /**
         * Mapeia o score para texto e cor da barra.
         */
        function updateStrengthIndicator(score, senha) {
            let text = '';
            let color = 'bg-gray-400';
            let width = (score / 4) * 100;
            
            if (senha.length === 0) {
                text = '';
                width = 0;
            } else if (score === 0 || score === 1) {
                text = 'Fraca';
                color = 'bg-red-500';
            } else if (score === 2) {
                text = 'Média';
                color = 'bg-yellow-500';
            } else if (score === 3) {
                text = 'Boa';
                color = 'bg-blue-500';
            } else if (score === 4) {
                text = 'Ótima';
                color = 'bg-green-500';
            }

            strengthBar.style.width = `${width}%`;
            strengthBar.className = `password-strength-bar ${color}`;
            strengthText.textContent = text;
            strengthText.style.color = color;
        }

        /**
         * Atualiza a lista de requisitos visuais (pontos/checkmarks)
         */
        function updateCriteriaList(requirements) {
            document.getElementById('req-length').className = requirements.isLengthValid ? 'req-valid mr-2' : 'req-invalid mr-2';
            document.getElementById('req-length').textContent = requirements.isLengthValid ? '✓' : '●';
            
            document.getElementById('req-lowercase').className = requirements.hasLowercase ? 'req-valid mr-2' : 'req-invalid mr-2';
            document.getElementById('req-lowercase').textContent = requirements.hasLowercase ? '✓' : '●';

            document.getElementById('req-uppercase').className = requirements.hasUppercase ? 'req-valid mr-2' : 'req-invalid mr-2';
            document.getElementById('req-uppercase').textContent = requirements.hasUppercase ? '✓' : '●';

            document.getElementById('req-number').className = requirements.hasNumber ? 'req-valid mr-2' : 'req-invalid mr-2';
            document.getElementById('req-number').textContent = requirements.hasNumber ? '✓' : '●';

            document.getElementById('req-special').className = requirements.hasSpecialChar ? 'req-valid mr-2' : 'req-invalid mr-2';
            document.getElementById('req-special').textContent = requirements.hasSpecialChar ? '✓' : '●';
            
            document.getElementById('req-space').className = requirements.noSpaces ? 'req-valid mr-2' : 'req-invalid mr-2';
            document.getElementById('req-space').textContent = requirements.noSpaces ? '✓' : '●';
        }

        /**
         * 3. Função de Validação Principal (chamada a cada input)
         */
        function validatePassword() {
            const senha = passwordInput.value;
            const confirmacao = confirmPasswordInput.value;
            
            // 1. Requisitos Estritos
            const requirements = checkStrictRequirements(senha);
            updateCriteriaList(requirements);

            // 2. Indicador de Força Visual
            const score = getPasswordStrengthScore(senha);
            updateStrengthIndicator(score, senha);

            // 3. Verifica a correspondência de senhas
            if (confirmacao.length > 0 && senha !== confirmacao) {
                matchError.textContent = 'As senhas não coincidem!';
                passwordsMatch = false;
            } else {
                matchError.textContent = '';
                passwordsMatch = true;
            }

            // 4. Habilita/Desabilita o botão
            // O botão SÓ é habilitado se:
            // a) Todos os requisitos estritos forem atendidos (requirements.allMet)
            // b) As senhas coincidirem (passwordsMatch)
            // c) Os campos não estiverem vazios
            const isFilled = senha.length > 0 && confirmacao.length > 0;
            
            checkButton.disabled = !(requirements.allMet && isFilled && passwordsMatch);

            // CORREÇÃO: Removido o comando que escondia a mensagem de status aqui
            // A mensagem de status só deve ser limpa no início da chamada da API.
        }
        
        /**
         * 4. Previne a digitação de espaços (Requisito de Segurança)
         */
        function preventSpaces(event) {
            if (event.code === 'Space') {
                event.preventDefault();
            }
        }

        /**
         * 5. Função para mostrar/ocultar senha
         */
        function togglePasswordVisibility(id) {
            const input = document.getElementById(id);
            const icon = document.getElementById(`eye-icon-${id}`);
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Troca o ícone
            const paths = icon.querySelectorAll('path');
            if (paths.length === 2) {
                // Se estiver mostrando (type === 'text'), o ícone deve ser o olho fechado/cortado (hiddenPath)
                if (type === 'text') {
                    paths[0].setAttribute('d', 'M13.875 18.825A10 10 0 0112 19c-4.477 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.01 0 1.996.16 2.937.45m-2.937 4.5a3 3 0 11-6 0 3 3 0 016 0z');
                } else {
                    paths[0].setAttribute('d', 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z');
                }
            } else {
                // Caso o SVG seja simplificado, alternamos o ícone completo
                icon.innerHTML = type === 'text' 
                    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10 10 0 0112 19c-4.477 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 1.01 0 1.996.16 2.937.45m-2.937 4.5a3 3 0 11-6 0 3 3 0 016 0z"/>'
                    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>';
            }
        }

        /**
         * 6. Manipulador de Submissão (Chama o Backend PHP)
         */
        async function handleCheckPassword(event) {
            event.preventDefault();
            
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Limpa mensagens de status anteriores
            statusMessage.classList.add('hidden');

            // Ativar loading state
            checkButton.disabled = true;
            loadingSpinner.classList.remove('hidden');
            buttonText.textContent = 'Verificando...';
            

            try {
                // Requisição POST para o script PHP
                const response = await fetch('check_password.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ password, confirmPassword })
                });

                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }

                const result = await response.json();
                
                // Exibir a mensagem de status
                statusMessage.classList.remove('hidden');
                
                if (result.success) {
                    let alertClass = 'bg-blue-100 border-blue-400 text-blue-700';
                    let message = `🎉 Senha Segura. ${result.message}`;

                    if (result.compromised) {
                        alertClass = 'bg-red-100 border-red-400 text-red-700';
                        message = `🚨 ATENÇÃO: Senha comprometida! ${result.message}`;
                    } 
                    
                    statusMessage.className = `mb-6 p-4 rounded-lg text-center border ${alertClass}`;
                    statusMessage.innerHTML = `<p class="font-bold">${message}</p>`;

                } else {
                    // Erro de validação ou erro do servidor
                    let alertClass = 'bg-yellow-100 border-yellow-400 text-yellow-700';
                    statusMessage.className = `mb-6 p-4 rounded-lg text-center border ${alertClass}`;
                    statusMessage.innerHTML = `<p class="font-bold">❌ Erro de Validação: ${result.message}</p>`;
                }

            } catch (error) {
                console.error('Erro na comunicação com o servidor:', error);
                statusMessage.classList.remove('hidden');
                statusMessage.className = 'mb-6 p-4 rounded-lg text-center border bg-red-100 border-red-400 text-red-700';
                statusMessage.innerHTML = `<p class="font-bold">❌ Erro: Falha ao conectar ao servidor. Verifique se o PHP está ativo e acessível.</p>`;
            } finally {
                // Desativar loading state e reabilitar botão
                loadingSpinner.classList.add('hidden');
                buttonText.textContent = 'Verificar Segurança da Senha';
                validatePassword(); // Revalida (agora sem esconder a mensagem!)
            }
        }

        // Inicializa a validação ao carregar
        document.addEventListener('DOMContentLoaded', () => {
            validatePassword();
            passwordInput.focus();
        });