FROM node:20.13-alpine AS base

RUN apk update && apk upgrade --no-cache

ARG SERVICE_NAME

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm install \
  # skip funding messages
  --fund false \
  # skip pre/post scripts
  --ignore-scripts \
  # skip vulnerability check
  --no-audit \
  # skip update information
  --no-update-notifier \
  # rebuild bcrypt
  && npm rebuild bcrypt



FROM base AS build

RUN npm run build -- ${SERVICE_NAME}



FROM base AS dev

ENV NODE_ENV development



#
# 🚀 Production Server
#
FROM build as prod

WORKDIR /usr/src/app

RUN npm cache clean --force

# Set to production environment
ENV NODE_ENV production

# Copy only the necessary files
COPY --chown=node:node --from=build /usr/src/app/dist/${SERVICE_NAME} dist
COPY --chown=node:node --from=build /usr/src/app/node_modules node_modules

# Set Docker as non-root user
USER node

# Run
CMD [ "node", "./dist/apps/${SERVICE_NAME}/main.js" ]