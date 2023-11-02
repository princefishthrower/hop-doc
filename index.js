const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));

app.listen(3001, function () {
  console.log('Static server listening on 3001')
});