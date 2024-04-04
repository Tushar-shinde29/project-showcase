const express = require('express');
const ejs = require('ejs');
const app = express();
let url = require('url');
const { attendencedata } = require('../model/attendencequery');

app.set('view engine', 'ejs');

const attendencegrid = async (req, res) => {
    var sp = url.parse(req.url, true).query;
    if (typeof sp.month == 'undefined') {
        sp.pageno = 1;
    }
    else {
        sp.pageno = sp.pageno;
    }
    var o = (sp.pageno - 1) * 15;
    if (typeof sp.month == 'undefined') {
        sp.month = 12;
    }
    else {
        sp.month = sp.month;
    }
    var attendence = await attendencedata(parseInt(sp.month), parseInt(o), parseInt(sp.pageno));
    if (!(attendence == null)) {
        res.render('attendence', { data: attendence, pn: sp.pageno, month: sp.month });
    }
    else {
        res.send("please enter valid data");
    }
};
module.exports = {
    attendencegrid
}











