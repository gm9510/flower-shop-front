FROM node:20-bullseye

# Install basic development tools
RUN apt update && apt install -y less git procps

# Ensure default node user has access to /usr/local/
RUN mkdir -p /usr/local/share/nvm && \
    chown -R node:node /usr/local/share/nvm && \
    mkdir -p /usr/local/lib/node_modules && \
    chown -R node:node /usr/local/lib/node_modules

# Install global packages
RUN npm install -g npm@latest

# Set the default user
USER node