# Get NPM packages
FROM node:14-alpine as dependencies
RUN apk add --no-cache g++ make libc6-compat python3 py3-pip
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn build
RUN npm prune --production

EXPOSE 3000

CMD ["yarn", "start"]