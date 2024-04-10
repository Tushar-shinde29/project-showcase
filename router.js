var express=require('express');
const router=express.Router();
var {daynamictable,eventdemo,tictactoe,kukukube,fetchapi,ehya,awan,hirex}=require('./controller/htmlcontent')
var {studentform,writefile,readfile,showdata1}=require('./controller/student');
var { setpassword, verify, login, activatelink, active, createpassword, registration, login1, checkuser } = require('./controller/login');
var { attendencegrid } = require('./controller/attendencegrid');
var { attendenceorderby } = require('./controller/attendenceorederby');
var {pagination}=require('./controller/pagination');
var { data, insert, updateemp, emp, jobform, citydata, showdata } = require('./controller/jobform');
var { result, individualresult } = require('./controller/studentresult');
const { search } = require('./controller/search');
var { setpassword, verify, login, activatelink, active, createpassword, registration, login1, checkuser } = require('./controller/login');


router.get('/home',verify,(req,res)=>{
    res.render('home');
});
router.get('/daynamictable',verify,daynamictable);

router.get('/tictactoe',verify,tictactoe);

router.get('/kukukube',verify,kukukube);

router.get('/ehya',verify,ehya);

router.get('/awan',verify,awan);

router.get('/hirex',verify,hirex);

router.get('/eventdemo',verify,eventdemo);

router.get('/studentform',verify,studentform);

router.post('/student.js',verify,writefile);

router.get('/md.ejs',verify,readfile);

router.get('/details',verify,showdata1);

router.get('/order',verify,pagination);

router.get('/attendencegrid',verify,attendencegrid);

router.get('/result',verify,result);

router.get('/individualresult',verify,individualresult);

router.get('/attendenceorderby',verify,attendenceorderby);

router.all('/search',verify,search);

router.get('/fetchapi',verify,fetchapi);

router.get('/data',verify,data);

router.post('/updateemp',verify,updateemp);

router.post('/insert',verify,insert);

router.post('/emp',verify,emp);

router.get('/showdata',verify,showdata);

router.all('/jobform',verify,jobform);

router.get('/citydata',verify,citydata);

router.all('/setpassword',setpassword);

router.get('/login',login);

router.all('/activatelink',activatelink);

router.get('/active',active);

router.get('/createpassword',createpassword);

router.post('/login',login1);

router.post('/checkuser',checkuser);

router.get('/registration',registration);

module.exports=router;