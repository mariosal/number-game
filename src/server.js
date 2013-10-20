var express = require('express');

express()
  .get('/', function(request, response) {
    response.sendfile('src/static/index.html');
  })
  .use(express.directory('src/static'))
  .use(express.static('src/static'))
  .listen(process.env.PORT || 5000);
