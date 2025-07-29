FROM node:20-alpine
WORKDIR /web

# Suppress Node deprecation noise
ENV NODE_OPTIONS=--no-deprecation
ENV DISABLE_ESLINT_PLUGIN=true

COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 3000
CMD ["npm", "start", "--silent"]