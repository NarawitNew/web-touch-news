FROM node:14.15.1-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV PORT 8888
#RUN npm start
CMD [ "npm", "start" ]