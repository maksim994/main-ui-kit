# --- Сборка (Node) ---
FROM node:20-bookworm-slim AS build
WORKDIR /app

ENV NODE_ENV=development \
    PHANTOMJS_SKIP_DOWNLOAD=true \
    npm_config_fund=false \
    npm_config_audit=false

# Системные зависимости для cwebp-bin
RUN apt-get update && apt-get install -y --no-install-recommends \
      libgl1 libxi6 libxrender1 ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# deps
COPY package*.json ./
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund; \
    else \
      npm i --no-audit --no-fund; \
    fi

# копируем и собираем (ваш билд идёт в /app/app)
COPY . .
RUN npm run build

# --- Релиз (Nginx) ---
FROM nginx:alpine
COPY --from=build /app/app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
