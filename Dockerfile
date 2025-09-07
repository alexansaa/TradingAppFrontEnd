# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# If you have envs like REACT_APP_API_URL, they’re baked at build time
# RUN REACT_APP_API_URL=$REACT_APP_API_URL npm run build
RUN npm run build

# ---- runtime stage ----
FROM nginx:alpine
# Optional: basic healthcheck
HEALTHCHECK CMD wget --spider -q http://localhost/ || exit 1
# SPA routing: send unknown routes to index.html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
