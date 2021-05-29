var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var urlCodeSet = require('./urlCodeSet.js');
var validUrl = require('valid-url');
var reqProm = require('request-promise');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'priya',
  password : 'priyab260',
  database : 'URL_CONTAINER'
});
connection.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));
app.locals.pretty = true;

app.set('view engine', 'jade');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index.jade');
});


app.post('/make/shorter', (req, res) => {
  var longURL = req.body.url;   
  var shortURL = '';            
  var numRows = 0;              
  var baseNum = 1000;           

  var sqlSearch = 'SELECT * FROM url_data WHERE longURL = "' + longURL + '"';
  var sqlInsert = 'INSERT INTO url_data (longURL, shortURL) VALUES(?, ?)';
  var sqlCount = 'SELECT * FROM url_data';

  connection.query(sqlCount, (err, url_data, fields) => {
    if(err) {
      console.log(err);
    }

    numRows = url_data.length;
  });

  reqProm('http://' + longURL)
      .then(function (htmlString) {
        connection.query(sqlSearch, (err, url_data, fields) => {
          if(err) {
            console.log(err);
          }

          if(url_data[0]) {
            
            shortURL = 'http://localhost:4000/' + url_data[0].shortURL;
          }
          else {
            
            shortURL = urlCodeSet.encode(baseNum + numRows);

            connection.query(sqlInsert, [longURL, shortURL], (err, result, fields) => {
           
              if(err) {
                console.log(err);
              }
            });

            shortURL = 'http://localhost:4000/' + shortURL;
          }
          res.send({'shortURL': shortURL});
        });
      })
      .catch(function (err) {
        
        shortURL = 'URL_FAILURE!'     
        res.send({'shortURL': shortURL});
      });
});

app.get('/:id', (req, res) => {
  var shortURL = req.params.id; 
  var longURL = '';             
  var sqlSearch = 'SELECT * FROM url_data WHERE shortURL = "' + shortURL + '"';

  connection.query(sqlSearch, (err, url_data, fields) => {
    if(err) {
      console.log(err);
    }

    if(url_data[0]) {
      longURL = url_data[0].longURL;
      res.redirect('http://' + longURL);
    }
    else {
      console.log('data does not exists!');
      res.redirect('http://localhost:4000/');
    }
  });
});

app.listen(4000, () => {
    console.log('listening on 4000 port!');
});
