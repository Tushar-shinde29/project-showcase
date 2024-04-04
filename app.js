var express = require('express');
var cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const router = require('./router');

var app = express();
app.use(cookieParser());

// For parsing application/json
app.use(express.json());

// // For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json());

app.use('/', router);

app.listen(8080);