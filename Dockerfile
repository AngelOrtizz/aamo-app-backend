FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY prisma/ ./prisma/
RUN npm ci

# Generar el cliente de Prisma
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:20-alpine

# Instalar herramientas necesarias
RUN apk add --no-cache dumb-init curl netcat-openbsd

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Copiar script de inicio
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

CMD ["./docker-entrypoint.sh"]