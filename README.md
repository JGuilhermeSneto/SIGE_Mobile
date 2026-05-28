# SIGE Mobile - Sistema Integrado de Gestão Escolar

O SIGE Mobile é a extensão portátil do ecossistema SIGE, projetado para oferecer aos alunos uma experiência "Premium" e fluida, espelhando a identidade visual e as animações avançadas da plataforma Desktop (Django).

## 🚀 Tecnologias e Bibliotecas Principais

Para alcançar o nível de fidelidade visual e performance exigido, utilizamos:

- **Expo SDK 54**: Framework base para desenvolvimento robusto e multiplataforma.
- **React Native SVG**: Essencial para as animações de anel neon, preenchimento de bordas e progresso circular.
- **React Navigation**: Gerenciamento de rotas e transições de tela.
- **React Native Animated API**: Controle fino de partículas, pulsos e efeitos de fade.
- **Vector Icons (MaterialCommunityIcons)**: Iconografia moderna integrada.
- **Safe Area Context**: Garantia de layout perfeito em dispositivos com notch (iPhone/Android).

## 🛠️ Requisitos para Instalação

Antes de começar, certifique-se de ter instalado:
1. **Node.js** (LTS recomendado)
2. **NPM** ou **Yarn**
3. **Expo Go** (instalado no seu smartphone) ou um emulador configurado.

## 📥 Passo a Passo de Instalação

Siga os comandos abaixo no seu terminal:

1. **Clonar o Repositório**:
   ```bash
   git clone <url-do-repositorio>
   cd SIGE_APP/SIGE_Mobile
   ```

2. **Instalar Dependências**:
   ```bash
   npm install
   ```
   > **Nota**: O comando `npm install` é o equivalente ao `pip install -r requirements.txt`. Ele lerá o arquivo `package.json` do projeto e instalará todas as bibliotecas necessárias automaticamente.

   *Ou, caso precise instalar as bibliotecas específicas manualmente:*
   ```bash
   npx expo install react-native-safe-area-context react-native-svg react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/stack
   ```

3. **Iniciar o Projeto**:
   ```bash
   npx expo start --clear
   ```

## 📱 Como Testar

- **Android/iOS**: Escaneie o QR Code gerado no terminal usando o aplicativo **Expo Go**.
- **Web**: Pressione `w` no terminal para abrir a versão de visualização no navegador.

## ✨ Recursos Implementados

- [x] **Splash Screen Premium**: Carregamento com anel neon e checklist de inicialização.
- [x] **Login de Alta Fidelidade**: Fundo de partículas, anel rotativo na logo oficial e borda de card que reage à digitação.
- [x] **Transições Dinâmicas**: Overlays de feedback para login bem-sucedido e logout seguro.
- [x] **Navegação Acadêmica**: Acesso direto às notas reais (Boletim), frequências diárias e materiais gerados pelo backend.
- [x] **Meu Perfil Premium (v3.1)**: Tela de Perfil do aluno de alta fidelidade portada a partir do layout Web, contendo gradientes SVG vetoriais nativos, avatar com cálculo dinâmico de iniciais, estatísticas de desempenho e um painel modal de edição de informações em tempo real com feedback toast.
- [x] **Integração de Segurança SOC & WAF**: Compatibilidade com a camada de defesa ativa e controle de blacklist em tempo real do ecossistema SIGE.
- [x] **Integração API com Redes Locais (v3.2)**: Validação e documentação de conectividade com a API de desenvolvimento via IP local (`192.168.18.90:8000`), evitando erros comuns de CORS/DisallowedHost no Expo Go.
- [x] **Preparação para Push Notifications (FCM/APNs)**: Configuração base conectada à nova infraestrutura de registro de Tokens na API Django do backend, pronta para disparos via Celery.
- [x] **Integração Exclusiva Swagger**: O app está sendo desenvolvido sob o novo contrato da API (documentado em `/api/docs/mobile/`), contando com rotas específicas para otimização de banda.

---
Desenvolvido com foco em UX/UI de alto nível para o ecossistema SIGE.
