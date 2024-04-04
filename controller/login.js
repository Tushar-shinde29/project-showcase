var mysql = require('mysql');
var url = require('url');
// const cors = require('cors');
var express = require('express');
var cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const jwt = require('jsonwebtoken');
const { error } = require('console');
const { CLIENT_RENEG_LIMIT } = require('tls');
const { getusername, passwordupdate, usercheck, registeruser, finduser, getnewcode, logincheck } = require('../model/loginquery');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
// app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json());


app.use(cookieParser());

function salt() {
    let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var salt = "";
    for (let i = 0; i < 4; i++) {
        salt += text.charAt(Math.floor(Math.random() * 26));
    }
    console.log(salt);
    return salt;
}
function activationcode() {
    let text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var code = "";
    for (let i = 0; i < 12; i++) {
        code += text.charAt(Math.floor(Math.random() * 36));

    }
    console.log(code);
    return code;
}


const setpassword = async (req, res) => {
    var data = req.body;
    var s = salt();
    var code = req.body.accode;
    // console.log(data);
    d = [];
    // console.log("pass from form", data.password1);
    var password = `${data.password1}${s}`;
    var result2 = await getusername(code);
    if (!(code.trim() == "") && result2.length > 0) {
        await passwordupdate(password, s, result2[0].username, code);
        res.setHeader('content-Type', 'application/json');
        res.json({ "msg": "password set" });
    }
    else {
        res.setHeader('content-Type', 'application/json');
        res.json({ "msg": "your link is expired" });
    }
};


const checkuser = async (req, res) => {
    var data = req.body;
    var fname = data.fname;
    var lname = data.lname;
    var username = data.username;
    var email = data.email;
    var code = activationcode();
    var user = await usercheck(username, email);
    if (user == null) {
        res.setHeader('content-Type', 'application/json');
        res.json({ "msg": "user already exist" });
    }
    else {
        await registeruser([`${fname}`, `${lname}`, `${username}`, `${email}`, `${code}`]);
        res.setHeader('content-Type', 'application/json');
        res.json({ "msg": "ok", "code": `${code}` });
    }
};



const login1 = async (req, res) => {
    data = req.body;
    var username = req.body.uname;
    var password = req.body.password;
    console.log(username, password);

    var result = await finduser(username);
    if (result.length > 0) {
        if (!(result[0].status == '1')) {
            var code = activationcode();
            await getnewcode(code, result[0].username);
            res.setHeader('content-Type', 'application/json');
            res.json({ "msg": "inactive", "newcode": `${code}` });
        }
        else {
            var ps = `${password}${result[0].salt}`;
            var result1 = await logincheck(username, ps);
            // console.log(result1);
            if (result1.length > 0) {
                const data = {
                    username: `${result1[0].username}`,
                    password: `${result1[0].password}`,
                }
                const token = jwt.sign(data, "hello");
                // console.log(token);
                res.setHeader('content-Type', 'application/json')
                    .json({ "msg": "ok", "data": result1, token: token });
            }
            else {
                res.setHeader('content-Type', 'application/json')
                    .json({ "msg": "ok", "data": result1 });
            }
        }
    }
    else {
        // res.setHeader('content-Type', 'application/json');
        res.json({ "msg": "error", "data": "u are not register pls register first" });

    }

};


const registration = (req, res) => {
    res.render('registration');
};


const createpassword = async (req, res) => {
    var sp = url.parse(req.url, true).query;
    // var q1=`select username,created_at,update_at from users where activationcode='${sp.code}'`;
    //     var d=[];
    //     console.log(q1);
    //     result2=await execute(q1,d);
    //     // // console.log(Date.parse(result2[0].created_at),Date.now());
    //     // if((Date.now()-Date.parse(result2[0].created_at))>30000)
    //     // {
    //     //     res.render('activate');
    //     // }
    //     // else
    //     // {
    res.render('createpassword');
    // }
};



const active = (req, res) => {
    res.render('activate');
};

const activatelink = async (req, res) => {
    let name = req.body.uname;
    console.log(name);
    var result2 = await finduser(name);
    if (result2.length > 0) {
        var code = activationcode();
        await getnewcode(code, name);
        res.setHeader('content-Type', 'application/json');
        res.json({ "msg": "newcode", "newcode": `${code}` });
    }
    else {
        res.setHeader('content-Type', 'application/json');
        res.json({ "msg": "nocode", "data": 'you are not registerd yet pls register first' });
    }
};


const verify = (req, res, next) => {
    // console.log(req);
    if (!(req.cookies.token)) {
        res.render('login');
    }
    else {
        next();
    }

};
const login = (req, res) => {
    res.render('login');
};


const home = (req, res) => {
    try {
        // console.log("cokkie is : "+req.cookies.token); 
    } catch (error) {
        console.log(error);
    }
    res.render('home');
};



module.exports = {
    setpassword,
    home, verify,
    login,
    activatelink,
    active,
    createpassword,
    registration,
    login1,
    checkuser,
}