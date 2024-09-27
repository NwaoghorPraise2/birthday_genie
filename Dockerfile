FROM node:20-alpine AS base

RUN npm i -g pnpm
RUN npm i -g npm-check-updates

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3002

CMD ["pnpm", "start"]