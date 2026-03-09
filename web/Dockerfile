FROM mcr.microsoft.com/playwright:v1.41.0-jammy

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (ignoring scripts to avoid premature playwright installs)
RUN npm ci --ignore-scripts

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port Next.js will run on
EXPOSE 3000

# Start the application binding to 0.0.0.0
CMD ["npm", "run", "start"]
