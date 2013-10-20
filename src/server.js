var express = require('express');

express()
  .use(express.directory('src/static'))
  .use(express.static('src/static'))
  .listen(process.env.PORT || 5000);
