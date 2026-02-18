# Guia de Produção (Production Guide)

Este guia explica como rodar a aplicação **Breaker** em ambiente de produção, servindo tanto o Frontend (React) quanto o Backend (Node/Express) juntos.

## 1. Pré-requisitos

- Node.js instalado (v18+).
- Banco de dados PostgreSQL (ou SQLite para testes simples).
- Variáveis de ambiente configuradas no arquivo `server/.env`.

## 2. Estrutura

O projeto foi unificado para facilitar o deploy:

- **Frontend**: Compilado para a pasta `/dist`.
- **Backend**: Serve a API em `/api` e os arquivos estáticos de `/dist` nas outras rotas.

## 3. Passo a Passo para Deploy

### Passo 1: Construir o Frontend

Na raiz do projeto (`C:\Users\Paulo\Desktop\Breaker`):

```bash
npm install
npm run build
```

Isso criará a pasta `dist/` com o site otimizado.

### Passo 2: Configurar o Backend

Na pasta do servidor (`C:\Users\Paulo\Desktop\Breaker\server`):

```bash
cd server
npm install
```

Edite o arquivo `.env` com sua conexão de banco de dados e porta:

```env
DATABASE_URL="postgresql://user:pass@host:5432/mydb"
PORT=3001
```

### Passo 3: Rodar em Produção

Ainda na pasta `server`, execute:

```bash
npm start
```

Acesse: `http://localhost:3001` (ou a porta que você configurou).

- O Frontend abrirá automaticamente.
- A API estará disponível em `/api`.

## 4. Deploy no Easypanel (Recomendado)

A maneira mais simples é subir tudo junto (Frontend + Backend) em um único serviço.

1.  Crie um **App** no Easypanel.
2.  Adicione um **Service** do tipo `App` (Docker).
3.  Conecte ao seu repositório GitHub.
4.  Configure as **Environment Variables** no Easypanel:
    - `DATABASE_URL`: Sua conexão Postgres.
    - `PORT`: `3001`
5.  Em **Build**, certifique-se que o Dockerfile será usado (o Easypanel detecta automaticamente o arquivo `Dockerfile` na raiz).
6.  Em **Network** (Portas), configure a porta privada do container para `3001`.

Dessa forma, você economiza recursos (apenas 1 container) e evita problemas de CORS.

## 5. Docker Manual (Opcional)

Se preferir usar Docker localmente:

1.  Construir: `docker build -t breaker-app .`
2.  Rodar: `docker run -p 3001:3001 -e DATABASE_URL="x" breaker-app`

---

_Gerado pelo Agente Antigravity_
