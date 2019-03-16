const serve = require('webpack-serve');
const openBrowser = require('./open_browser.js');

serve({ clipboard : false, host:"192.168.1.182", port: 8000 }).then((server) => {
  server.on('listening', () => {
    openBrowser(`http://${server.options.host}:${server.options.port}`);
  });
});