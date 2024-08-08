FROM cypress/included:latest

WORKDIR /tests

COPY ./package.json .
COPY ./cypress.config.ts .
COPY ./cypress ./cypress
COPY ./checkStatus.js .
COPY ./tsconfig.json .

RUN npm install
RUN node -v && npm -v

ENTRYPOINT ["npx","cypress","run"]
