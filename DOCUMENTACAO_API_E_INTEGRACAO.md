# 📖 Guia de Integração de API & Execução Local (Expo Go)

Este documento descreve detalhadamente a arquitetura de comunicação entre o **Back-end Django** e o **SIGE Mobile**, documentando os endpoints da API, os fluxos de dados de integração e o passo a passo para rodar a aplicação localmente e visualizá-la no seu smartphone usando o aplicativo **Expo Go**.

---

## 📡 1. Documentação dos Endpoints da API

Todas as chamadas à API usam autenticação baseada em token **JWT (JSON Web Token)**. O token deve ser enviado no cabeçalho HTTP de cada requisição protegida:

```http
Authorization: Bearer <seu_token_access>
```

### 🔐 Autenticação (Login)
* **Endpoint**: `/api/v1/auth/login/`
* **Método**: `POST`
* **Descrição**: Autentica o aluno ou responsável e retorna os tokens JWT e dados básicos do usuário.
* **Corpo da Requisição**:
  ```json
  {
    "username": "20260160184",
    "password": "sua_senha_secreta"
  }
  ```
* **Resposta de Sucesso (`200 OK`)**:
  ```json
  {
    "refresh": "ey...",
    "access": "ey...",
    "user": {
      "id": 1,
      "username": "20260160184",
      "email": "aluno@sige.com.br",
      "nome_completo": "Carlos Silva Rocha",
      "perfil": "aluno"
    }
  }
  ```

---

### 📊 Dashboard do Aluno
* **Endpoint**: `/api/v1/aluno/dashboard/`
* **Método**: `GET`
* **Descrição**: Fornece o resumo de dados para a tela principal (Home).
* **Resposta de Sucesso (`200 OK`)**:
  ```json
  {
    "aluno": {
      "id": 1,
      "nome_completo": "Carlos Silva Rocha",
      "turma": "1º Ano A - Manhã",
      "turno": "Manhã",
      "ano_letivo": 2026
    },
    "parental_control": {
      "ativo": true
    },
    "summary": {
      "disciplinas": 4,
      "media_geral": 8.7,
      "situacao": "Aprovado",
      "faltas_detalhe": "4/160",
      "faltas": 4,
      "frequencia_total": 97.5
    },
    "mural": [
      {
        "id": 1,
        "titulo": "Bem-vindo ao Novo SIGE",
        "conteudo": "Aproveite as novas funcionalidades de Controle Parental e Login via Matrícula.",
        "data_publicacao": "2026-05-20T12:00:00Z",
        "importancia": "ALTA"
      }
    ],
    "grade_semana": {
      "segunda": [
        { "id": 10, "horario": "07:30 - 08:20", "disciplina": "Português" },
        { "id": 11, "horario": "08:20 - 09:10", "disciplina": "Matemática" },
        { "id": 12, "horario": "09:10 - 10:00", "disciplina": "Intervalo" }
      ],
      "terca": [],
      "quarta": [],
      "quinta": [],
      "sexta": []
    },
    "livros_posse": [
      {
        "id": 5,
        "titulo": "Dom Casmurro",
        "autor": "Machado de Assis",
        "status": "EM_POSSE",
        "atrasado": false
      }
    ],
    "desempenho_grafico": [
      { "disciplina": "MAT", "media": 8.7 },
      { "disciplina": "POR", "media": 7.2 }
    ]
  }
  ```

---

### 📝 Boletim Escolar (Notas e Frequência)
* **Endpoint**: `/api/v1/aluno/boletim/`
* **Método**: `GET`
* **Descrição**: Retorna o boletim detalhado com as notas bimestrais e presenças.
* **Resposta de Sucesso (`200 OK`)**:
  ```json
  {
    "media_geral": 8.7,
    "frequencia_total": 97,
    "boletim": [
      {
        "id": 1,
        "nome": "MATEMÁTICA",
        "prof": "Fernando Costa",
        "media": "8.7",
        "status": "aprovado",
        "notas": {
          "b1": "8.5",
          "b2": "9.0",
          "b3": "--",
          "b4": "--"
        },
        "faltas": 4,
        "total": 40,
        "freq": 90,
        "materiais": ["Geometria Espacial.pdf", "Lista Exercícios.pdf"]
      }
    ]
  }
  ```

---

### 📖 Roteiro de Aulas (Trilha Educacional)
* **Endpoint**: `/api/v1/aluno/roteiro/`
* **Método**: `GET`
* **Descrição**: Obtém as disciplinas do aluno e a linha do tempo dos planejamentos de aula.
* **Resposta de Sucesso (`200 OK`)**:
  ```json
  {
    "materias": [
      { "id": 1, "nome": "Matemática", "professor": "Prof. Fernando Costa" }
    ],
    "aulas": {
      "1": [
        {
          "data": "Terça-Feira, 10 De Março De 2026",
          "situacao": "concluida",
          "assunto": "Equações do 2° grau",
          "topicos": "Discriminante — Fórmula de Bháskara"
        }
      ]
    }
  }
  ```

---

### 📂 Materiais Didáticos
* **Endpoint**: `/api/v1/aluno/materiais/`
* **Método**: `GET`
* **Descrição**: Retorna todos os materiais de aula organizados por disciplina.
* **Resposta de Sucesso (`200 OK`)**:
  ```json
  [
    {
      "id": 1,
      "nome": "Matemática",
      "professor": "Prof. Fernando Costa",
      "arquivos": [
        {
          "nome": "Apostila de Geometria Espacial",
          "meta": "Arquivo de Apoio · PDF",
          "quantidade": 1,
          "url": "http://192.168.18.90:8000/media/materiais_aula/geometria_espacial.pdf"
        }
      ]
    }
  ]
  ```

---

### 👤 Perfil do Aluno
* **Endpoint**: `/api/v1/aluno/perfil/`
* **Método**: `GET`, `PUT`
* **Descrição**: Visualiza ou atualiza as informações do perfil do estudante.
* **Corpo do `PUT`** (Campos editáveis):
  ```json
  {
    "nome": "Carlos Silva Rocha de Souza",
    "cpf": "221.222.222-22",
    "data_nascimento": "15/04/2010",
    "naturalidade": "São Paulo - SP",
    "telefone": "(11) 98888-7777"
  }
  ```
* **Resposta de Sucesso (`200 OK` para `GET`)**:
  ```json
  {
    "nome": "Carlos Silva Rocha de Souza",
    "matricula": "20260160184",
    "cpf": "221.222.222-22",
    "data_nascimento": "15/04/2010",
    "naturalidade": "São Paulo - SP",
    "telefone": "(11) 98888-7777",
    "turma": "1º Ano A",
    "ano_letivo": "2026",
    "stats": {
      "media_geral": "8.7",
      "frequencia": "97.5%",
      "disciplinas": "4",
      "faltas": "4"
    },
    "responsaveis": [
      {
        "nome": "Marcos Rocha",
        "parentesco": "Pai",
        "telefone": "(11) 99999-8888"
      }
    ]
  }
  ```

---

## 🔗 2. Fluxo de Integração no Front-end Mobile

A integração de rede no React Native utiliza a Fetch API nativa. O fluxo de consumo se baseia em:

```
[Componente Screen] ──(Dispara Evento)──> [services/api.js] ──(Request JWT)──> [Django backend]
        ▲                                                                            │
        │                                                                            ▼
[Atualiza State] <───────(Retorna Promessa com JSON) <───────────────────────[Recebe Resposta]
```

O arquivo [api.js](file:///c:/Users/gu268/Projetos/Django-projetos/SIGE_APP/SIGE_Mobile/src/services/api.js) armazena em memória o `AUTH_TOKEN` de forma centralizada ao realizar o login, de modo que todas as requisições subsequentes anexam automaticamente o header `Authorization`.

---

## 💻 3. Como Executar Localmente e Acessar via QR Code do Expo

Para rodar o ecossistema localmente e visualizar no seu celular usando o **Expo Go**, o seu computador (servidor) e o seu celular (cliente) **devem estar conectados na mesma rede Wi-Fi**.

### Passo 1: Descobrir o IP Local da sua Máquina (Computador)
1. No seu computador Windows, abra o **PowerShell** ou **Prompt de Comando**.
2. Digite o comando:
   ```powershell
   ipconfig
   ```
3. Procure pelo adaptador de rede ativo (geralmente "Adaptador Rede Sem Fio Wi-Fi") e anote o endereço **IPv4** (Ex: `192.168.18.90`).

### Passo 2: Configurar o Backend Django
1. Abra as configurações do Django no arquivo `config/settings.py` e garanta que o seu IP está na lista de hosts permitidos (`ALLOWED_HOSTS`). *Nota: Geralmente está configurado como `['*']` em ambiente de desenvolvimento.*
2. Inicialize o servidor Django escutando em **todas as interfaces de rede** (`0.0.0.0`) na porta `8000`:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```
   > ⚠️ **Atenção**: Se você rodar apenas `python manage.py runserver` (sem o `0.0.0.0`), o Django escutará apenas requisições vindas do próprio computador (`localhost`) e o seu celular não conseguirá conectar.

### Passo 3: Configurar o Endereço no App Mobile
1. Abra o arquivo [api.js](file:///c:/Users/gu268/Projetos/Django-projetos/SIGE_APP/SIGE_Mobile/src/services/api.js).
2. Na linha 1, configure a constante `API_BASE_URL` com o IP local que você anotou:
   ```javascript
   const API_BASE_URL = 'http://192.168.18.90:8000'; // Substitua pelo seu IPv4 real
   ```

### Passo 4: Iniciar o Expo no App Mobile
1. Abra uma nova janela de terminal, navegue até a pasta do aplicativo mobile:
   ```bash
   cd SIGE_APP/SIGE_Mobile
   ```
2. Inicie o Expo forçando o modo de conexão LAN/Rede Local:
   ```bash
   npx expo start --lan
   ```
3. O Expo iniciará e exibirá um **QR Code** gigante no seu terminal.

### Passo 5: Escanear no Smartphone com Expo Go
1. Instale o aplicativo **Expo Go** na Google Play Store (Android) ou App Store (iOS).
2. **No Android**: Abra o aplicativo Expo Go e clique em **"Scan QR Code"**, então aponte para o QR Code no terminal do seu computador.
3. **No iOS**: Abra a câmera padrão do iPhone, aponte para o QR Code e clique no link de redirecionamento que abrirá o Expo Go automaticamente.
4. Aguarde o download do bundle Javascript (você verá o progresso em `%` no terminal e no celular). O aplicativo carregará instantaneamente na tela de Splash!

---
> 💡 **Dica de Solução de Problemas (Firewall)**: 
> Se o Expo Go der erro de conexão ("Metro bundler not found" ou "Network error"), o firewall do Windows pode estar bloqueando a porta `8000` (Django) ou `8081`/`19000` (Expo). 
> Temporariamente, você pode desativar o Firewall do Windows para a rede Privada ou criar uma regra de entrada liberando estas portas para testar.
