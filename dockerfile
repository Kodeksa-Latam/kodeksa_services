# Etapa 1: Build
FROM node:22-alpine AS builder
# Instala pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia dependencias y pnpm config
COPY pnpm-lock.yaml ./
COPY package.json ./

# Instala dependencias solo necesarias para construir
RUN pnpm install --frozen-lockfile

# Copia todo el proyecto y construye
COPY . .
RUN pnpm build

# Etapa 2: Producción
FROM node:22-alpine


RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copia archivos necesarios desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main"]
