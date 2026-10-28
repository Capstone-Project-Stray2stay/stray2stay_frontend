# ---- build stage ----
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# Vite auto-loads .env from this directory at build time and bakes
# VITE_* values into the JS bundle — make sure .env has the values you
# want live before building this image (it's not a secret; it ends up
# readable in the shipped bundle either way).
RUN bun run build

# ---- runtime stage ----
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]