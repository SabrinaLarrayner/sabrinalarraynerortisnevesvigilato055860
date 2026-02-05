FROM node:22-alpine as guardiao-pet-build-stage

WORKDIR /app

COPY . /app/

RUN npm install --legacy-peer-deps
RUN npm run build --production

FROM nginx:1.21.3-alpine as runtime

COPY --from=guardiao-pet-build-stage /app/nginx.conf  /etc/nginx/nginx.conf
COPY --from=guardiao-pet-build-stage /app/dist/desafio-seplag-frontend/browser /usr/share/nginx/html

EXPOSE 7000

CMD ["nginx", "-g", "daemon off;"]