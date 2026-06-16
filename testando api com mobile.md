# Testando API com Mobile

Este documento descreve, passo a passo, como validar a integração entre o **backend Django (SIGE)** e o **app mobile Expo**.

---

## 📋 Pré‑requisitos

1. **Python 3.11+** com o *virtual‑env* ativado.
2. **Node.js 18+** e **npm** instalados.
3. **Expo CLI** (`npm i -g expo-cli`).
4. Dispositivo móvel (Android ou iOS) com o app **Expo Go** instalado.
5. Acesso à mesma rede local (Wi‑Fi) para ambos – backend estará em `http://192.168.18.90:8000`.

---

## 🚀 Passos de configuração

### 1️⃣ Iniciar o backend Django
```cmd
cd C:\Users\gu268\Projetos\Django-projetos\SIGE
venv\Scripts\activate
python fix_db.py          # (opcional – remove colunas antigas, já está ok)
python seed_db.py          # garante usuário de teste
python manage.py runserver 0.0.0.0:8000
```
- O servidor deve exibir:
```
Starting ASGI/Daphne version … at http://0.0.0.0:8000/
Quit the server with CTRL‑BREAK.
```
- **Teste rápido com cURL** (confirma que o login funciona):
```cmd
curl -X POST http://192.168.18.90:8000/api/v1/auth/login/ ^
     -H "Content-Type: application/json" ^
     -d "{\"username\":\"202677588\",\"password\":\"SenhaSIGE2026\"}"
```
Deve‑retornar `access` e `refresh` tokens.

### 2️⃣ Preparar o app mobile
```cmd
cd C:\Users\gu268\Projetos\Django-projetos\SIGE_APP\SIGE_Mobile
npm install                # instala dependências
expo start --clear         # inicia o bundler (elige "LAN")
```
- O terminal mostrará um QR Code.
- Caso a porta 8081 já esteja ocupada, o Expo perguntará por 8082 – aceite.

### 3️⃣ Conectar o dispositivo
1. Abra **Expo Go** no celular.
2. Escaneie o QR Code apresentado pelo terminal.
3. Aguarde o bundle ser carregado.

### 4️⃣ Testar o login no app
| Campo      | Valor               |
|------------|---------------------|
| Matrícula  | `202677588`         |
| Senha      | `SenhaSIGE2026`     |

- Toque **CONECTAR**.
- Se tudo estiver correto, o app receberá um objeto JSON similar a:
```json
{
  "access": "<jwt>",
  "refresh": "<jwt>",
  "user": {"id": 194, "username": "202677588", "email": "junior.teste@sige.local", "perfil": "aluno", "nome": "Junior Teste"}
}
```
- O app navegará para a tela principal.

### 5️⃣ Debug (opcional)
- No celular, dê **Shake** → **Debug Remote JS**.
- Verifique o console do navegador para mensagens como `Login success` ou erros de rede.
- Se houver erro `401 Unauthorized`, confirme que o usuário existe (`python seed_db.py`) e que `API_BASE_URL` em `src/services/api.js` aponta para `http://192.168.18.90:8000`.

---

## 🧹 Limpeza
- Pare o servidor Django com `CTRL‑BREAK`.
- Encerre o bundler Expo (`q` no terminal ou feche a janela).
- Opcional: liberar portas ocupadas:
```cmd
netstat -ano | findstr :8000
taskkill /PID <PID> /F
netstat -ano | findstr :8082
taskkill /PID <PID> /F
```

---

## 📦 Observações
- O backend usa **django‑axes**; a coluna `session_hash` já foi removida, mas o script `fix_db.py` pode ser rodado novamente sem efeitos colaterais.
- As vulnerabilidades listadas por `npm audit` não impactam o fluxo de login; podem ser corrigidas posteriormente com `npm audit fix`.
- Caso queira testar a versão **web** do app, execute `npm run web -- --port 8081` (ou 8082) e acesse `http://<IP‑da‑máquina>:8082` no navegador.

---

**Pronto!** Você agora tem um guia completo para validar a API do SIGE a partir do app mobile.
