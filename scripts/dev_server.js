const serve = require('webpack-serve');
const openBrowser = require('./open_browser.js');

serve({ clipboard : false, port: 8008 }).then((server) => {
  server.on('listening', () => {
    openBrowser(`http://${server.options.host}:${server.options.port}`);
  });
});