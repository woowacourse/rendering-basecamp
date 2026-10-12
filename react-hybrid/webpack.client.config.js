const assets = require('./webpack.assets.config');
const template = require('./webpack.template.config');

module.exports = (env, argv) => [assets(env, argv), template(env, argv)];
