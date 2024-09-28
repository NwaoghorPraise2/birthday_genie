FROM node:20-alpine AS base

# Install pnpm and npm-check-updates globally
RUN npm i -g pnpm
RUN npm i -g npm-check-updates

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY ./prisma/schema.prisma ./prisma/
RUN pnpx prisma generate


# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3002

# Set the default command to run the application
CMD ["pnpm", "start"]
