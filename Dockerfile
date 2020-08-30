FROM node:carbon

ADD dist /home/node/app/dist
ADD package.json /home/node/app/package.json

ENV MONGODB_URI mongodb://db:27017
ENV JWT_SECRET victoria123secret

RUN chown -R node:node /home/node/app 

USER node
WORKDIR /home/node/app
RUN npm install --save

EXPOSE 3000

CMD npm run serve