const serve = require('webpack-serve');
const openBrowser = require('./open_browser.js');

serve({ clipboard : false, host:"localhost", port: 8000 }).then((server) => {
  server.on('listening', () => {
    openBrowser(`http://${server.options.host}:${server.options.port}`);
  });
});