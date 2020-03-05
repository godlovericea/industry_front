const express = require('express')
const app = express()
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : '120.55.161.93',
    user     : 'admin',
    password : 'Admin123456.',
    database : 'wxqiandao'
  });
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))