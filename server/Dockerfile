# Use node image as base
FROM node:22-alpine

# Create an application directory
RUN mkdir -p /server

# Set /back-end as the working directory
WORKDIR /server

#Create a docker volume so that changes made to the db persists througout all users
VOLUME /server

# Copy the local back-end package.json files into the current directory of our docker image (/back-end)
#COPY server/package*.json ./

COPY . .

# Install node dependencies
RUN npm i

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