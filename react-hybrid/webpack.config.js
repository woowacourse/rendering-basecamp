const client = require('./webpack.client.config');
const server = require('./webpack.server.config');

module.exports = (env, argv) => [...client(env, argv), server(env, argv)];
