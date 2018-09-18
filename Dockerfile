FROM node:8.9.3

RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install

EXPOSE 4200
CMD [ "npm", "start"]
