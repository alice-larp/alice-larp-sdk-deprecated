# Stage 0, based on Node.js, to build and compile Angular
FROM node:carbon as node

WORKDIR /app
COPY *.json ./
COPY yarn.lock .

COPY packages/alice-api-server/package.json ./packages/alice-api-server/
COPY packages/alice-api-server/yarn.lock ./packages/alice-api-server/

COPY packages/alice-integration-testing/package.json ./packages/alice-integration-testing/
COPY packages/alice-integration-testing/yarn.lock ./packages/alice-integration-testing/

COPY packages/alice-mobile/package.json ./packages/alice-mobile/

COPY packages/alice-model-engine-api/package.json ./packages/alice-model-engine-api/

COPY packages/alice-model-engine/package.json ./packages/alice-model-engine/
COPY packages/alice-model-engine/yarn.lock ./packages/alice-model-engine/

COPY packages/alice-qr-lib/package.json ./packages/alice-qr-lib/
COPY packages/alice-qr-lib/yarn.lock ./packages/alice-qr-lib/

COPY packages/alice-worker-manager/package.json ./packages/alice-worker-manager/
COPY packages/alice-worker-manager/yarn.lock ./packages/alice-worker-manager/

COPY packages/import-server/package.json ./packages/import-server/
COPY packages/import-server/yarn.lock ./packages/import-server/

COPY packages/magellan-models/package.json ./packages/magellan-models/
COPY packages/magellan-models/yarn.lock ./packages/magellan-models/

COPY packages/medicine-frontend/package.json ./packages/medicine-frontend/
COPY packages/medicine-frontend/yarn.lock ./packages/medicine-frontend/

RUN yarn
RUN yarn run deps

COPY . .

RUN yarn run test
