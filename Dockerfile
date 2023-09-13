FROM node:18
COPY ./public /home/rose_express/public
COPY ./routes /home/rose_express/routes
COPY ./sslcert /home/rose_express/sslcert
COPY ./views /home/rose_express/views
COPY ./bin /home/rose_express/bin
COPY ./app.js /home/rose_express/app.js
COPY ./modules.js /home/rose_express/modules.js
COPY ./utils.js /home/rose_express/utils.js
COPY ./package.json /home/rose_express/package.json
COPY ./nodemon.json /home/rose_express/nodemon.json
WORKDIR /home/rose_express
RUN npm install
CMD [ "npm", "run", "start" ]
