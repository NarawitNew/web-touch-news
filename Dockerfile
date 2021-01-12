FROM node:14.15.1-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8888
CMD [ "npm", "start" ]