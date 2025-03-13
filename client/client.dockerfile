# Use node image as base
FROM node:12-alpine

# Create an application directory
RUN mkdir -p /client

# Set /front-end as the working directory
WORKDIR /client

# Copy the local front-end package.json files into the current directory of our docker image (/front-end)
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the front-end files into the working directory
COPY front-end/ .

# Expose the port 3000, the port that we are using for the front end
EXPOSE 3000

#
ENV PORT=$PORT

# Set the PROXY_API environement variable
#ENV PROXY_API=$PROXY_API

# Start App
CMD ["npm", "run","build"]
