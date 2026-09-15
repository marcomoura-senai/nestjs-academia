FROM node:26-slim AS build


WORKDIR /app

COPY . . 

RUN npm install

RUN npm run build


FROM node:26-slim AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

RUN npm ci --omit=dev

CMD ["node", "dist/main.js"]

