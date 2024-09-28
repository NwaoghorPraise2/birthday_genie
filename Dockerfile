# Base stage
FROM node:20-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm npm-check-updates

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml for dependencies
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies in a separate folder for production builds
RUN pnpm install --frozen-lockfile --store .pnpm-store

# Copy Prisma schema and generate
COPY ./prisma/schema.prisma ./prisma/
RUN pnpx prisma generate

# Copy the rest of the app
COPY . .

# Expose the port for the application
EXPOSE 3002

# Default command to run the application in development mode
CMD ["pnpm", "start"]
