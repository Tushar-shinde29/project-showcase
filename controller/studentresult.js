var mysql = require('mysql');
const express = require('express');
const ejs = require('ejs');
const app = express();
let url = require('url');
const { allstudentresult, individualresultdata, totalrecord } = require('../model/studentresultquery');

app.set('view engine', 'ejs');

var numrecord = null;


const result = async (req, res) => {
    numrecord = await totalrecord();
    var sp = url.parse(req.url, true).query;
    if (typeof sp.pageno == 'undefined') {
        sp.pageno = 1;
    }
    else {
        sp.pageno = sp.pageno;
    }
    var o = (sp.pageno - 1) * 15;
    console.log("page is ", Math.ceil(numrecord[0].record / 15));
    if ((sp.pageno > 0 && sp.pageno <= Math.ceil(numrecord[0].record / 15))) {
        var result = await allstudentresult(parseInt(o));

        if (!(result == null)) {
            res.render('result', { data: result, pn: sp.pageno });
        }
        else {
            res.send("pls enter valid data");
        }
    }
    else {
        res.send("pls enter valid data");
    }

};

const individualresult = async (req, res) => {
    var sp = url.parse(req.url, true).query;
    if (sp.rollno > 0 && sp.rollno <= numrecord[0].record) {
        var result = await individualresultdata(parseInt(sp.rollno));
        if (!(result == null)) {
            res.render('sresult', { data: result });
        }
        else {
            res.send("pls enter valid data");
        }
    }
    else {
        res.send("pls enter valid data");
    }
}
module.exports = {
    result,
    individualresult,
}

