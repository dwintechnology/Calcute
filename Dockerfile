FROM node:10-alpine

ADD ./ /usr/src/app
WORKDIR /usr/src/app
RUN yarn install
RUN yarn build

ENTRYPOINT ["yarn"]
CMD ["start"]
