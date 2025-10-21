## 👨‍💻 Autor

<div align="center">
  <img src="https://avatars.githubusercontent.com/ninomiquelino" width="100" height="100" style="border-radius: 50%">
  <br>
  <strong>Onivaldo Miquelino</strong>
  <br>
  <a href="https://github.com/ninomiquelino">@ninomiquelino</a>
</div>

---

# 🧭 Analisador de Força de Senha em Tempo Real

![Made with PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=white)
![Frontend JavaScript](https://img.shields.io/badge/Frontend-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwindcss&logoColor=white)
![License MIT](https://img.shields.io/badge/License-MIT-green)
![Status Stable](https://img.shields.io/badge/Status-Stable-success)
![Version 1.0.0](https://img.shields.io/badge/Version-1.0.0-blue)
![GitHub stars](https://img.shields.io/github/stars/NinoMiquelino/password-strength-checker?style=social)
![GitHub forks](https://img.shields.io/github/forks/NinoMiquelino/password-strength-checker?style=social)
![GitHub issues](https://img.shields.io/github/issues/NinoMiquelino/password-strength-checker)


​💻 Visão Geral do Projeto
​Este projeto consiste em um Analisador de Força de Senha em Tempo Real, desenvolvido para validar a complexidade e a segurança de credenciais. Ele implementa uma arquitetura de segurança em duas camadas:
​Análise de Complexidade (Frontend): Fornece feedback visual e instantâneo, guiando o usuário a criar senhas fortes.
​Auditoria de Credenciais (Backend): Verifica se a senha (ou um hash seguro dela) está presente em bancos de dados de senhas vazadas publicamente, garantindo que a credencial não tenha sido previamente comprometida.
​O objetivo é promover as melhores práticas de segurança e prevenir o uso de senhas fracas ou expostas.

---

## ⚙️ Funcionalidades
​- ✅ Avaliação de Complexidade em Tempo Real: A força da senha é atualizada instantaneamente a cada caractere digitado, baseada em critérios como comprimento, variedade de caracteres (minúsculas, maiúsculas, números e especiais).

​- 🔍 Auditoria de Senha Comprometida (Backend): Implementação segura de verificação contra listas públicas de senhas vazadas (por exemplo, usando o princípio k-Anonymity de serviços como o Have I Been Pwned).

​- 💡 Feedback Visual Intuitivo: Utiliza uma barra de progresso com gradientes de cores (Vermelho/Fraco a Verde/Forte) e alertas claros de exposição.

​- 🌐 Código Modular: A lógica de validação front-end e a chamada ao serviço de auditoria backend são isoladas para facilitar a manutenção e a integração.

---

## 🧩 Estrutura do Projeto
```
password-strength-checker/
📁 docs/
│   ├── index.html
│   └── check_password.php
│   └── assets/
│       ├── css/style.css
│       └── js/script.js
├── README.md
├── .gitignore
└── LICENSE
```
---

## 🚀 Visualizar na prática

### 🔸 Frontend (JavaScript)
👉 [**Acesse o site online**](https://ninomiquelino.github.io/password-strength-checker/)  
Digite a senha e veja o resultado instantaneamente na interface.

---

## 🧠 Tecnologias utilizadas
- 💻 HTML5 / CSS3
- 🎨 Tailwind CSS
- ⚡ JavaScript (ES6+)
- 🐘 PHP 8.3+

---

## 📦 Como usar
1. Clone este repositório:
   ```bash
   git clone https://github.com/ninomiquelino/password-strength-checker.git

---   

## 🧾 Licença
Distribuído sob a licença **MIT**.  
Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🤝 Contribuições
Contribuições são sempre bem-vindas!  
Sinta-se à vontade para abrir uma [*issue*](https://github.com/NinoMiquelino/password-strength-checker/issues) com sugestões ou enviar um [*pull request*](https://github.com/NinoMiquelino/password-strength-checker/pulls) com melhorias.

---

## 💬 Contato
📧 [Entre em contato pelo LinkedIn](https://www.linkedin.com/in/onivaldomiquelino/)  
💻 Desenvolvido por **Onivaldo Miquelino**

---

### 🏷️ Explicando os badges:
| Badge | Significado |
|--------|--------------|
| 🟣 **Made with PHP** | Indica a principal linguagem usada no backend |
| 🟡 **Frontend JavaScript** | Mostra a stack usada na interface |
| 🟦 **TailwindCSS** | Framework CSS usado para estilização moderna e responsiva |
| 🟢 **License MIT** | Mostra a licença do repositório |
| 💙 **Version 1.0.0** | Versão estável do projeto |
| ✅ **Status Stable** | Mostra que o projeto está funcionando corretamente |

---
