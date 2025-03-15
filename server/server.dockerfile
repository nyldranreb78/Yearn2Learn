# Use node image as base
FROM node:12-alpine

# Create an application directory
RUN mkdir -p /server

# Set /back-end as the working directory
WORKDIR /server

#Create a docker volume so that changes made to the db persists througout all users
VOLUME /server

# Copy the local back-end package.json files into the current directory of our docker image (/back-end)
#COPY server/package*.json ./



# Install node dependencies
RUN npm ci

# Copy the rest of the back-end files into the working directory
#COPY server/ .

# Copy everything in the /server directory
COPY . .

# Expose the port
EXPOSE $PORT

#Set environment variable
ENV DATABASE_URI = $DATABASE_URI

# Start the backend
CMD ["npm", "run","dev"]