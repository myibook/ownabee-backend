# Fetching the latest node image on apline linux
FROM node:23

# Declaring env
ENV NODE_ENV development

# Setting up the work directory
WORKDIR /backend

# Installing dependencies
COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile


# Copying all the files in our project
COPY . .
COPY .env .env

# Generate Prisma Client after schema is available in the image
RUN npx prisma generate

# Building our application
# RUN yarn build

# Expose the port on which the app will be running (3000 is the default that `serve` uses)
EXPOSE 80

# start app
CMD [ "yarn", "start" ]
