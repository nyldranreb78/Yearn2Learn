# Use node image as base
FROM node:22-alpine

# Create an application directory
RUN mkdir -p /client

# Set /front-end as the working directory
WORKDIR /client

## Copy the local front-end package.json files into the current directory of our docker image (/front-end)
#COPY client/package*.json ./
COPY . .
# Install dependencies
RUN npm i

# Copy the rest of the front-end files into the working directory
#COPY front-end/ .
#COPY . .

#arbitrary change

# Expose the port 3000, the port that we are using for the front end
EXPOSE 8080

#
ENV PORT=$PORT

# Set the PROXY_API environement variable
#ENV PROXY_API=$PROXY_API
ENV API_BASE_URL = $API_BASE_URL
# Start App
#CMD ["npm", "run","build"]
CMD ["npm", "run","serve"]
