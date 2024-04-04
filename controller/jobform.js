var mysql = require('mysql');
var url = require('url');
// const cors = require('cors');
var express = require('express');
const bodyparser = require('body-parser');
const { statedata, city, alldata, showempdata, insertdata, updatedata } = require('../model/jobquery');
var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
// app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

const data = async (req, res) => {
    result = await statedata();
    res.setHeader('content-Type', 'application/json');
    res.json(result);
};


const citydata = async (req, res) => {
    var sp = url.parse(req.url, true).query;
    result = await city(sp.cn);
    res.setHeader('content-Type', 'application/json');
    res.json(result);
};


const jobform = (req, res) => {
    res.render('job');
};




const showdata = async (req, res) => {

    empdetails = await alldata();
    res.json(empdetails);
};



const emp = async (req, res) => {
    console.log("emp no", req.body.id);
    var eno = req.body.id;
    var details = await showempdata(eno);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(details);
};


const insert = async (req, res) => {
    var data = req.body;
    await insertdata(data);
    res.setHeader('content-Type', 'application/json');
    res.json({ "msg": "data inserted succesfully" });
};

const updateemp = async (req, res) => {

    var data = req.body;
    await updatedata(data);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ "msg": "data updated succesfully" });
};
module.exports = {
    data,
    updateemp,
    insert,
    emp,
    jobform,
    citydata,
    showdata,
}