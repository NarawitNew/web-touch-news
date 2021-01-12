FROM node:14.15.1-alpine
WORKDIR /app
COPY . .
RUN yarn install
EXPOSE 4000
CMD [ "npm", "start" ]