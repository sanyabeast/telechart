const serve = require('webpack-serve');
const openBrowser = require('./open_browser.js');

serve({ clipboard : false, host:"172.25.10.108", port: 8000 }).then((server) => {
  server.on('listening', () => {
    openBrowser(`http://${server.options.host}:${server.options.port}`);
  });
});