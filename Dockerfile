FROM node:18-alpine

WORKDIR /app

# 1. Copiar arquivos de dependências (Raiz e Server)
COPY package*.json ./
COPY server/package*.json ./server/

# 2. Instalar dependências
RUN npm install
RUN cd server && npm install

# 3. Copiar todo o código fonte
COPY . .

# 4. Gerar o Client do Prisma (Backend)
RUN cd server && npx prisma generate

# 5. Construir o Frontend (Gera a pasta /dist)
RUN npm run build

# 6. Expor a porta da API
EXPOSE 3001

# 7. Iniciar o servidor (que serve a API e o Frontend)
CMD ["npm", "start", "--prefix", "server"]
