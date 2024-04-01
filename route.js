var mysql=require('mysql');
var url=require('url');
// const cors = require('cors');
var express=require('express');
var cookieParser=require('cookie-parser');
const bodyparser = require('body-parser');
const { error } = require('console');
// const path = require('path'); 
// var fs=require('fs');
const { json } = require('body-parser');
let {daynamictable, fetchapi}=require('./controller');
let {tictactoe}=require('./controller');
let {kukukube}=require('./controller');
let {ehya}=require('./controller');
let {awan}=require('./controller');
let {hirex}=require('./controller');
let {eventdemo}=require('./controller');
let {studentform}=require('./studentform/student');
let {writefile}=require('./studentform/student');
let {readfile}=require('./studentform/student');
let {showdata1}=require('./studentform/student');
let {pagination}=require('./pagination/server');
const { attendencegrid } = require('./attendencegrid/server');
const { result, individualresult } = require('./studentresult/server');
const { attendenceorderby } = require('./attendenceorederby/server');
const { search } = require('./search/server');
const { data, insert, updateemp, emp, jobform, citydata, showdata } = require('./jobform/server');
const { setpassword, verify, login, activatelink, active, createpassword, registration, login1, checkuser } = require('./login/server');
// const { jobform, submitform, view, show, update } = require('./Jobform/server');

var app=express();
try {
    app.use(cookieParser());
    
} catch (error) {
    console.log(error);
}

// For parsing application/json
app.use(express.json());
 
// // For parsing application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));
// app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json());

app.get('/home',verify,(req,res)=>{
    res.render('home');
});
app.get('/daynamictable',verify,daynamictable);

app.get('/tictactoe',verify,tictactoe);

app.get('/kukukube',verify,kukukube);

app.get('/ehya',verify,ehya);

app.get('/awan',verify,awan);

app.get('/hirex',verify,hirex);

app.get('/eventdemo',verify,eventdemo);

app.get('/studentform',verify,studentform);

app.post('/student.js',verify,writefile);

app.get('/md.ejs',verify,readfile);

app.get('/details',verify,showdata1);

app.get('/order',verify,pagination);

app.get('/attendencegrid',verify,attendencegrid);

app.get('/result',verify,result);

app.get('/individualresult',verify,individualresult);

app.get('/attendenceorderby',verify,attendenceorderby);

app.all('/search',verify,search);

app.get('/fetchapi',verify,fetchapi);

app.get('/data',verify,data);

app.post('/updateemp',verify,updateemp);

app.post('/insert',verify,insert);

app.post('/emp',verify,emp);

app.get('/showdata',verify,showdata);

app.all('/jobform',verify,jobform);

app.get('/citydata',verify,citydata);

app.all('/setpassword',setpassword);

app.get('/login',login);

app.all('/activatelink',activatelink);

app.get('/active',active);

app.get('/createpassword',createpassword);

app.get('/registration',registration);

app.post('/login',login1);

app.post('/checkuser',checkuser);

app.listen(8080);