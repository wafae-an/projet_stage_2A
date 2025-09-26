FROM node:20-bullseye

WORKDIR /app

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLE=1

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
