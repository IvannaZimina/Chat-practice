/*** Module dependencies.*/

const httpRunner = require('./http');
const wsRunner = require('./ws');

const run = () => {
  const httpServer = httpRunner();
  wsRunner(httpServer);

}

module.exports = run;